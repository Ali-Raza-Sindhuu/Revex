import { Router } from "express";
import rateLimit from "express-rate-limit";
import { createTestDriveController } from "../controllers/test-drives.controller.js";

const router = Router();
const limit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: "draft-8", legacyHeaders: false });
router.post("/", limit, createTestDriveController);
export default router;
