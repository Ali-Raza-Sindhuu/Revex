import { Router } from "express";
import { checkoutStatusController, createCheckoutController, userBookingsController } from "../controllers/payments.controller.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();
router.get("/session/:sessionId", checkoutStatusController);
router.get("/bookings", authenticate, userBookingsController);
router.post("/checkout-session", authenticate, createCheckoutController);
export default router;
