import "dotenv/config";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import authRoutes from "./routes/auth.routes.js";
import carRoutes from "./routes/cars.routes.js";
import cartRoutes from "./routes/cart.routes.js";
import paymentRoutes from "./routes/payments.routes.js";
import testDriveRoutes from "./routes/test-drives.routes.js";
import leadsRoutes from "./routes/leads.routes.js";
import wishlistRoutes from "./routes/wishlist.routes.js";
import { errorHandler, notFound } from "./middleware/error.js";
import { connectDatabase } from "./config/database.js";
import { configureCloudinary } from "./config/cloudinary.js";
import { stripeWebhookController } from "./controllers/payments.controller.js";

const missingRequiredEnvironment = [
  !process.env.JWT_SECRET && "JWT_SECRET",
].filter(Boolean);
if (missingRequiredEnvironment.length) {
  throw new Error(`Missing required environment variable(s): ${missingRequiredEnvironment.join(", ")}`);
}
configureCloudinary();
const app = express();
const configuredFrontendOrigin = process.env.FRONTEND_URL || "http://localhost:5173";
// CORS compares the browser's origin (scheme + host + port), not a full URL
// with a trailing slash or a frontend path.
const frontendOrigin = new URL(configuredFrontendOrigin).origin;
const allowedOrigins = new Set([frontendOrigin, "http://localhost:5173", "http://127.0.0.1:5173"]);

app.use(helmet());
app.use(cors({
  origin: (origin, callback) => callback(null, !origin || allowedOrigins.has(origin)),
  credentials: true,
}));
app.use(async (req, res, next) => {
  try { await connectDatabase(); next(); } catch (error) { next(error); }
});
app.post("/api/payments/webhook", express.raw({ type: "application/json", limit: "1mb" }), stripeWebhookController);
app.use(express.json({ limit: "16kb" }));
app.get("/health", (req, res) => res.status(200).json({ status: "ok" }));
app.use("/api/cars", carRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/wishlist", wishlistRoutes);
app.use("/api/test-drives", testDriveRoutes);
app.use("/api", authRoutes);
app.use("/api", leadsRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;
