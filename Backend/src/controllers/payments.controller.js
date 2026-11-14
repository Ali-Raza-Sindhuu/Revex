import { AppError } from "../lib/errors.js";
import { createRentalCheckout, getCheckoutStatus, getUserBookings, handleStripeWebhook } from "../services/payments.service.js";

export const createCheckoutController = async (req, res) => res.status(201).json(await createRentalCheckout(req.userId));
export const userBookingsController = async (req, res) => res.status(200).json(await getUserBookings(req.userId));
export const checkoutStatusController = async (req, res) => res.status(200).json(await getCheckoutStatus(req.params.sessionId));
export const stripeWebhookController = async (req, res) => {
  const signature = req.get("stripe-signature");
  if (!signature) throw new AppError(400, "Missing Stripe signature.");
  res.status(200).json(await handleStripeWebhook(req.body, signature));
};
