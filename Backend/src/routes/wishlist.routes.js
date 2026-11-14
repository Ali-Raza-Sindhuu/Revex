import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import {
  addWishlistCarController,
  getWishlistController,
  mergeWishlistCarsController,
  removeWishlistCarController,
} from "../controllers/wishlist.controller.js";

const router = Router();
router.use(authenticate);
router.get("/", getWishlistController);
router.post("/items", addWishlistCarController);
router.post("/merge", mergeWishlistCarsController);
router.delete("/items/:carId", removeWishlistCarController);
export default router;
