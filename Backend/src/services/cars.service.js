import Car from "../models/Car.js";
import Booking from "../models/Booking.js";
import { AppError } from "../lib/errors.js";
import { nextAvailableRentalStart, rentalDayCount } from "./rental.rules.js";

const ACTIVE_HOLD_MINUTES = 35;

export const listCars = async (query) => {
  const filter = { status: "available" };
  if (query.location) {
    const escapedLocation = query.location.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter["details.dealer.city"] = { $regex: escapedLocation, $options: "i" };
  }
  for (const [key, field] of Object.entries({ condition: "condition", listingType: "listing_type", make: "make", model: "model", year: "year", bodyType: "body_type", fuel: "fuel", transmission: "transmission", colour: "colour" })) if (query[key] !== undefined && query[key] !== "") filter[field] = query[key];
  if (query.minYear !== undefined || query.maxYear !== undefined) filter.year = { ...(query.minYear !== undefined ? { $gte: query.minYear } : {}), ...(query.maxYear !== undefined ? { $lte: query.maxYear } : {}) };
  if (query.maxMileage !== undefined) filter.mileage = { $lte: query.maxMileage };
  if (query.minPrice !== undefined || query.maxPrice !== undefined) {
    const price = { ...(query.minPrice !== undefined ? { $gte: query.minPrice } : {}), ...(query.maxPrice !== undefined ? { $lte: query.maxPrice } : {}) };
    filter.$or = [{ listing_type: "rent" }, { price }];
  }
  const sort = { newest: { year: -1, created_at: -1, _id: 1 }, "price-asc": { price: 1, _id: 1 }, "price-desc": { price: -1, _id: 1 }, year: { year: 1, _id: 1 } }[query.sort];
  const [total, items] = await Promise.all([
    Car.countDocuments(filter),
    Car.find(filter).sort(sort).skip((query.page - 1) * query.pageSize).limit(query.pageSize).lean(),
  ]);
  return { items: items.map((car) => ({ ...car, id: car._id })), total, page: query.page, pageCount: Math.ceil(total / query.pageSize) };
};

export const getCarFacets = async () => {
  const [makes, modelRows, years, bodyTypes] = await Promise.all([
    Car.distinct("make", { status: "available" }),
    Car.find({ status: "available" }).select("make model -_id").sort({ make: 1, model: 1 }).lean(),
    Car.distinct("year", { status: "available" }), Car.distinct("body_type", { status: "available" }),
  ]);
  const modelsByMake = {};
  for (const row of modelRows) (modelsByMake[row.make] ??= []).push(row.model);
  for (const make of Object.keys(modelsByMake)) modelsByMake[make] = [...new Set(modelsByMake[make])];
  return { makes: makes.sort(), modelsByMake, years: years.sort((a, b) => b - a), bodyTypes: bodyTypes.filter(Boolean).sort() };
};

export const getCarById = async (carId) => {
  const car = await Car.findById(carId).lean();
  if (!car) throw new AppError(404, "Car not found");
  car.id = car._id;
  car.features ??= [];
  car.gallery ??= [];
  car.details ??= null;
  return car;
};

export const getCarAvailability = async (carId, from, to) => {
  const car = await Car.findById(carId).select("listing_type").lean();
  const exists = Boolean(car);
  if (!exists) throw new AppError(404, "Car not found");
  if (to < from) throw new AppError(400, "Availability end date must be on or after the start date.");
  if (car.listing_type !== "rent") throw new AppError(400, "Availability dates apply to rental listings only.");
  const rentalDays = rentalDayCount(from, to);
  if (!rentalDays || rentalDays > 30) throw new AppError(400, "Choose a rental range of 1–30 days.");
  const pendingSince = new Date(Date.now() - ACTIVE_HOLD_MINUTES * 60_000);
  const bookings = await Booking.find({
    car_id: carId,
    end_date: { $gte: from },
    $or: [{ status: "confirmed" }, { status: "pending", createdAt: { $gte: pendingSince } }],
  }).select("start_date end_date -_id").sort({ start_date: 1 }).lean();
  const ranges = bookings.map(({ start_date, end_date }) => ({ startDate: start_date, endDate: end_date }));
  const conflicts = ranges.filter((range) => range.startDate <= to && range.endDate >= from);
  return {
    bookedRanges: conflicts,
    nextAvailableDate: nextAvailableRentalStart(from, rentalDays, ranges),
  };
};
