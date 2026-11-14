import { z } from "zod";
import { AppError } from "../lib/errors.js";
import { addWishlistCar, getWishlist, mergeWishlistCars, removeWishlistCar } from "../services/wishlist.service.js";

const carIdSchema = z.string().trim().min(1).max(64);
const mergeSchema = z.object({ carIds: z.array(carIdSchema).max(100) });

const parse = (schema, value) => {
  const result = schema.safeParse(value);
  if (!result.success) throw new AppError(400, "Invalid wishlist request.");
  return result.data;
};

export const getWishlistController = async (req, res) => res.status(200).json(await getWishlist(req.userId));
export const addWishlistCarController = async (req, res) => {
  const { carId } = parse(z.object({ carId: carIdSchema }), req.body);
  res.status(200).json(await addWishlistCar(req.userId, carId));
};
export const removeWishlistCarController = async (req, res) => {
  const carId = parse(carIdSchema, req.params.carId);
  res.status(200).json(await removeWishlistCar(req.userId, carId));
};
export const mergeWishlistCarsController = async (req, res) => {
  const { carIds } = parse(mergeSchema, req.body);
  res.status(200).json(await mergeWishlistCars(req.userId, carIds));
};
