import Booking from "../models/Booking.js";
import Cart from "../models/Cart.js";
import Car from "../models/Car.js";
import User from "../models/User.js";
import { AppError } from "../lib/errors.js";
import { getStripe } from "../config/stripe.js";
import { rentalDayCount, validateRentalDates } from "./rental.rules.js";

// Stripe requires Checkout sessions to expire at least 30 minutes in the future.
const HOLD_MINUTES = 35;
const currency = (process.env.STRIPE_CURRENCY || "usd").toLowerCase();
const frontendUrl = () => (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/$/, "");

const clearPaidCartItems = async (bookings) => {
  const cartItems = bookings.map((booking) => booking.cart_item_id).filter(Boolean);
  if (cartItems.length) await Cart.updateOne({ user_id: bookings[0].user_id }, { $pull: { items: { _id: { $in: cartItems } } } });
};

const markSessionPaid = async (session) => {
  if (session.payment_status !== "paid") return { status: session.payment_status || session.status, bookings: [] };
  const bookings = await Booking.find({ checkout_session_id: session.id }).exec();
  if (!bookings.length) return { status: "paid", bookings: [] };
  if (bookings.every((booking) => booking.status === "cancelled")) return { status: "refund_pending", bookings: [] };
  const now = new Date();
  const overlaps = await Promise.all(bookings.map(async (booking) => {
    const conflict = await Booking.findOne({
      _id: { $ne: booking._id }, car_id: booking.car_id, status: "confirmed",
      start_date: { $lte: booking.end_date }, end_date: { $gte: booking.start_date },
    }).select("_id").lean();
    return conflict;
  }));
  if (overlaps.some(Boolean)) {
    await getStripe().refunds.create({ payment_intent: session.payment_intent, reason: "duplicate" });
    await Booking.updateMany({ checkout_session_id: session.id }, { $set: { status: "cancelled" } });
    return { status: "refund_pending", bookings: [] };
  }
  await Booking.updateMany({ checkout_session_id: session.id, status: "pending" }, { $set: { status: "confirmed", paid_at: now } });
  await clearPaidCartItems(bookings);
  return { status: "confirmed", bookings: bookings.map((booking) => ({ id: String(booking._id), car_id: booking.car_id, start_date: booking.start_date, end_date: booking.end_date })) };
};

export const createRentalCheckout = async (userId) => {
  const stripe = getStripe();
  const user = await User.findById(userId).select("name email").lean();
  if (!user) throw new AppError(401, "Please sign in again before checkout.");
  const cart = await Cart.findOne({ user_id: userId });
  if (!cart?.items.length) throw new AppError(400, "Your garage is empty.");
  const rentalItems = cart.items.filter((item) => item.listing_type === "rent");
  if (!rentalItems.length) throw new AppError(400, "Your Garage has no rentals to check out. Purchase cars are saved as a shortlist; open one to request a test drive or send an enquiry.");

  const now = new Date();
  const pendingSince = new Date(now.getTime() - HOLD_MINUTES * 60_000);
  const lineItems = [];
  const pendingBookings = [];
  for (const item of rentalItems) {
    const car = await Car.findById(item.car_id).lean();
    if (!car || car.status === "sold" || car.listing_type !== "rent") throw new AppError(409, "A rental vehicle in your garage is no longer available.");
    const dateError = validateRentalDates({ startDate: item.start_date, endDate: item.end_date });
    if (dateError) throw new AppError(400, dateError);
    const days = rentalDayCount(item.start_date, item.end_date);
    const overlap = await Booking.findOne({
      car_id: car._id, status: { $in: ["confirmed", "pending"] },
      ...( { $or: [{ status: "confirmed" }, { status: "pending", createdAt: { $gte: pendingSince } }] } ),
      start_date: { $lte: item.end_date }, end_date: { $gte: item.start_date },
    }).select("_id").lean();
    if (overlap) throw new AppError(409, `${car.make} ${car.model} is no longer available for those dates. Please choose another rental period.`);
    const unitAmount = Math.round(Number(car.price) * 100);
    if (!Number.isSafeInteger(unitAmount) || unitAmount < 1) throw new AppError(400, "This vehicle has an invalid rental rate.");
    const total = unitAmount * days;
    if (!Number.isSafeInteger(total)) throw new AppError(400, "This rental total is too large to process.");
    lineItems.push({
      price_data: { currency, unit_amount: unitAmount, product_data: { name: `${car.year} ${car.make} ${car.model} rental`, description: `${item.start_date} to ${item.end_date} · ${days} day${days === 1 ? "" : "s"}` } },
      quantity: days,
    });
    pendingBookings.push({ car_id: String(car._id), user_id: userId, cart_item_id: item._id, start_date: item.start_date, end_date: item.end_date, amount_total: total, currency, status: "pending" });
  }

  const savedBookings = await Booking.insertMany(pendingBookings);
  let session;
  try {
    session = await stripe.checkout.sessions.create({
      // Stripe now selects enabled payment methods from the Dashboard.
      mode: "payment", line_items: lineItems,
      customer_email: user.email,
      metadata: { userId: String(userId), bookingIds: savedBookings.map((booking) => String(booking._id)).join(",") },
      expires_at: Math.floor(now.getTime() / 1000) + HOLD_MINUTES * 60,
      success_url: `${frontendUrl()}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl()}/checkout?cancelled=1`,
    });
    await Booking.updateMany({ _id: { $in: savedBookings.map((booking) => booking._id) } }, { $set: { checkout_session_id: session.id } });
  } catch (error) {
    await Booking.deleteMany({ _id: { $in: savedBookings.map((booking) => booking._id) } });
    throw error;
  }
  return { url: session.url, sessionId: session.id, expiresAt: session.expires_at };
};

export const getUserBookings = async (userId) => {
  const bookings = await Booking.find({ user_id: userId }).sort({ createdAt: -1 }).lean();
  if (!bookings.length) return { bookings: [] };
  const cars = await Car.find({ _id: { $in: [...new Set(bookings.map((booking) => booking.car_id))] } }).lean();
  const carsById = new Map(cars.map((car) => [String(car._id), car]));
  return {
    bookings: bookings.map((booking) => ({
      id: String(booking._id), status: booking.status,
      start_date: booking.start_date, end_date: booking.end_date,
      amount_total: booking.amount_total, currency: booking.currency,
      created_at: booking.createdAt, paid_at: booking.paid_at,
      car: carsById.get(String(booking.car_id)) ?? null,
    })),
  };
};

export const getCheckoutStatus = async (sessionId) => {
  if (!sessionId || !sessionId.startsWith("cs_")) throw new AppError(400, "A valid checkout session is required.");
  const stripe = getStripe();
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  if (!session.metadata?.userId) throw new AppError(404, "Checkout session not found.");
  if (session.payment_status === "paid") {
    const result = await markSessionPaid(session);
    return { status: result.status };
  }
  if (session.status === "expired") await Booking.updateMany({ checkout_session_id: sessionId, status: "pending" }, { $set: { status: "cancelled" } });
  return { status: session.payment_status === "paid" ? "confirmed" : session.status === "expired" ? "expired" : session.payment_status || session.status };
};

export const handleStripeWebhook = async (rawBody, signature) => {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) throw new AppError(503, "Stripe webhook is not configured.");
  let event;
  try { event = getStripe().webhooks.constructEvent(rawBody, signature, webhookSecret); }
  catch { throw new AppError(400, "Invalid Stripe webhook signature."); }
  const session = event.data.object;
  if (event.type === "checkout.session.completed" && session.payment_status === "paid") await markSessionPaid(session);
  if (["checkout.session.expired", "checkout.session.async_payment_failed"].includes(event.type)) {
    await Booking.updateMany({ checkout_session_id: session.id, status: "pending" }, { $set: { status: "cancelled" } });
  }
  return { received: true };
};
