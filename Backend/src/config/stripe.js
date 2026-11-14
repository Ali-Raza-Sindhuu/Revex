import Stripe from "stripe";

let stripeClient;

export const getStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY || "";
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || "";
  const secretMode = secretKey.match(/^sk_(test|live)_/)?.[1];
  const publishableMode = publishableKey.match(/^pk_(test|live)_/)?.[1];
  if (!secretMode || !publishableMode || secretMode !== publishableMode) {
    const error = new Error("Stripe keys are missing, invalid, or use different test/live modes. Check STRIPE_SECRET_KEY and STRIPE_PUBLISHABLE_KEY.");
    error.status = 503;
    throw error;
  }
  stripeClient ??= new Stripe(secretKey);
  return stripeClient;
};
