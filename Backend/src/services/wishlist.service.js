import Car from "../models/Car.js";
import Wishlist from "../models/Wishlist.js";
import { AppError } from "../lib/errors.js";

export const getWishlist = async (userId) => {
  const wishlist = await Wishlist.findOne({ user_id: userId }).select("car_ids").lean();
  return { carIds: wishlist?.car_ids ?? [] };
};

export const addWishlistCar = async (userId, carId) => {
  if (!await Car.exists({ _id: carId })) throw new AppError(404, "Car not found.");
  const wishlist = await Wishlist.findOneAndUpdate(
    { user_id: userId },
    { $setOnInsert: { user_id: userId }, $addToSet: { car_ids: carId } },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
  ).select("car_ids").lean();
  return { carIds: wishlist.car_ids };
};

export const removeWishlistCar = async (userId, carId) => {
  const wishlist = await Wishlist.findOneAndUpdate(
    { user_id: userId },
    { $pull: { car_ids: carId } },
    { returnDocument: "after" },
  ).select("car_ids").lean();
  return { carIds: wishlist?.car_ids ?? [] };
};

export const mergeWishlistCars = async (userId, carIds) => {
  const cars = await Car.find({ _id: { $in: carIds } }).select("_id").lean();
  const validIds = cars.map((car) => String(car._id));
  if (!validIds.length) return getWishlist(userId);
  const wishlist = await Wishlist.findOneAndUpdate(
    { user_id: userId },
    { $setOnInsert: { user_id: userId }, $addToSet: { car_ids: { $each: validIds } } },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
  ).select("car_ids").lean();
  return { carIds: wishlist.car_ids };
};
