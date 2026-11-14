import Cart from "../models/Cart.js";
import Car from "../models/Car.js";
import Booking from "../models/Booking.js";
import { AppError } from "../lib/errors.js";
import { rentalRangesOverlap, validateRentalDates } from "./rental.rules.js";
import { cartItemSchema } from "../validators/car.validators.js";

const ACTIVE_HOLD_MINUTES = 35;

const carForCart = async (id) => {
  const car = await Car.findById(id).lean();
  if (!car) throw new AppError(404, "Car not found");
  return car;
};
const validateItem = async (car, item) => {
  if (car.listing_type !== item.listingType) throw new AppError(409, "The selected listing type does not match this car.");
  if (car.status === "sold") throw new AppError(409, "This car has already been sold.");
  if (item.listingType === "buy") {
    if (item.startDate || item.endDate) throw new AppError(400, "Purchase items must not include rental dates.");
    return;
  }
  if (!item.startDate || !item.endDate) throw new AppError(400, "Rental start and end dates are required.");
  const dateError = validateRentalDates(item);
  if (dateError) throw new AppError(400, dateError);
  const pendingSince = new Date(Date.now() - ACTIVE_HOLD_MINUTES * 60_000);
  const bookings = await Booking.find({
    car_id: car._id,
    start_date: { $lte: item.endDate },
    end_date: { $gte: item.startDate },
    $or: [{ status: "confirmed" }, { status: "pending", createdAt: { $gte: pendingSince } }],
  }).select("start_date end_date -_id").lean();
  if (bookings.some((entry) => rentalRangesOverlap({ startDate: item.startDate, endDate: item.endDate }, { startDate: entry.start_date, endDate: entry.end_date }))) throw new AppError(409, "This car is unavailable for the selected rental dates.");
};
const serializeItem = (entry, car) => ({ id: String(entry._id), listing_type: entry.listing_type, start_date: entry.start_date, end_date: entry.end_date, added_at: entry.added_at, car: { id: car._id, make: car.make, model: car.model, year: car.year, year_range: car.year_range, price: car.price, listing_type: car.listing_type, image_url: car.image_url, status: car.status } });

export const getCart = async (userId) => {
  const cart = await Cart.findOneAndUpdate({ user_id: userId }, { $setOnInsert: { user_id: userId } }, { upsert: true, returnDocument: "after", setDefaultsOnInsert: true });
  const cars = await Car.find({ _id: { $in: cart.items.map((item) => item.car_id) } }).lean();
  const byId = new Map(cars.map((car) => [car._id, car]));
  return { cart: { id: String(cart._id), items: cart.items.map((entry) => byId.has(entry.car_id) ? serializeItem(entry, byId.get(entry.car_id)) : null).filter(Boolean) } };
};

const createCartItem = async (userId, item) => {
  const car = await carForCart(item.carId);
  await validateItem(car, item);
  const cart = await Cart.findOneAndUpdate({ user_id: userId }, { $setOnInsert: { user_id: userId } }, { upsert: true, returnDocument: "after", setDefaultsOnInsert: true });
  if (cart.items.some((entry) => entry.car_id === car._id)) throw new AppError(409, "Already in your garage");
  const entry = { car_id: car._id, listing_type: item.listingType, start_date: item.startDate ?? null, end_date: item.endDate ?? null };
  cart.items.push(entry);
  await cart.save();
  return serializeItem(cart.items.at(-1), car);
};
export const addCartItem = createCartItem;
export const mergeCartItems = async (userId, items) => {
  const addedItems = [];
  const skipped = [];
  for (const candidate of items) {
    const parsed = cartItemSchema.safeParse(candidate);
    const carId = typeof candidate?.carId === "string" ? candidate.carId : "unknown";
    if (!parsed.success) { skipped.push({ carId, reason: parsed.error.issues[0]?.message || "Invalid cart item." }); continue; }
    try { addedItems.push(await createCartItem(userId, parsed.data)); }
    catch (error) { if (error instanceof AppError && error.status < 500) skipped.push({ carId: parsed.data.carId, reason: error.message }); else throw error; }
  }
  return { added: addedItems.length, skipped };
};
export const removeCartItem = async (userId, itemId) => {
  const cart = await Cart.findOne({ user_id: userId });
  const entry = cart?.items.id(itemId);
  if (!entry) throw new AppError(404, "Cart item not found");
  entry.deleteOne();
  await cart.save();
};
