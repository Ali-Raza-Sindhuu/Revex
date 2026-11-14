import { z } from "zod";
import Car from "../models/Car.js";
import TestDriveBooking from "../models/TestDriveBooking.js";
import { AppError } from "../lib/errors.js";
import { isValidCalendarDate } from "../services/rental.rules.js";

const times = ["Any time during opening hours", "Morning (9am–12pm)", "Afternoon (12pm–3pm)", "Late afternoon (3pm–6pm)"];
const schema = z.object({
  carId: z.string().trim().min(1).max(64),
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(30).optional().default(""),
  preferredDate: z.string().refine(isValidCalendarDate, "Choose a valid test-drive date."),
  preferredTime: z.enum(times),
  message: z.string().trim().max(3000).optional().default(""),
  consent: z.literal(true),
});

export const createTestDriveController = async (req, res) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    const errors = Object.fromEntries(parsed.error.issues.map((issue) => [String(issue.path[0] || "body"), issue.message]));
    throw new AppError(400, "Please check the test-drive request.", errors);
  }
  const values = parsed.data;
  if (values.preferredDate < new Date().toISOString().slice(0, 10)) throw new AppError(400, "Choose today or a future date.");
  const car = await Car.findById(values.carId).select("make model year status listing_type").lean();
  if (!car) throw new AppError(404, "This car could not be found.");
  if (car.listing_type !== "buy") throw new AppError(400, "Test drives can only be requested for cars listed for purchase.");
  if (car.status === "sold") throw new AppError(409, "This car is no longer available for a test drive.");
  const booking = await TestDriveBooking.create({
    car_id: String(car._id), car_name: `${car.year} ${car.make} ${car.model}`,
    full_name: values.fullName, email: values.email.toLowerCase(), phone: values.phone,
    preferred_date: values.preferredDate, preferred_time: values.preferredTime,
    message: values.message, status: "requested",
  });
  res.status(201).json({ message: "Your test-drive request has been received.", requestId: String(booking._id), status: booking.status });
};
