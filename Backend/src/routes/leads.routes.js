import { Router } from "express";
import rateLimit from "express-rate-limit";
import { createContactEnquiry, subscribeNewsletter } from "../controllers/leads.controller.js";

const router = Router();
const limit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: "draft-8", legacyHeaders: false });
router.post("/contact", limit, createContactEnquiry);
router.post("/newsletter", limit, subscribeNewsletter);
export default router;
