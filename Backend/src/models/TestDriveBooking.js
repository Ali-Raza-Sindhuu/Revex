import mongoose from "mongoose";

const testDriveBookingSchema = new mongoose.Schema({
  car_id: { type: String, required: true, index: true },
  car_name: { type: String, required: true, trim: true, maxlength: 200 },
  full_name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254, index: true },
  phone: { type: String, trim: true, maxlength: 30, default: "" },
  preferred_date: { type: String, required: true, index: true },
  preferred_time: { type: String, required: true, trim: true, maxlength: 80 },
  message: { type: String, trim: true, maxlength: 3000, default: "" },
  status: { type: String, enum: ["requested", "scheduled", "completed", "cancelled"], default: "requested", index: true },
}, { timestamps: true, versionKey: false });

export default mongoose.models.TestDriveBooking || mongoose.model("TestDriveBooking", testDriveBookingSchema);
