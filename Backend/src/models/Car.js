import mongoose from "mongoose";

const carSchema = new mongoose.Schema({
  _id: { type: String }, make: { type: String, required: true, index: true },
  model: { type: String, required: true, index: true }, year_range: String,
  year: { type: Number, required: true, index: true }, condition: { type: String, enum: ["new", "used"] },
  listing_type: { type: String, enum: ["buy", "rent"], index: true },
  price: { type: Number, required: true, index: true }, body_type: String, fuel: String,
  transmission: String, cc: Number, bhp: Number, mileage: Number, colour: String,
  image_url: String, image_public_id: String, status: { type: String, default: "available", index: true },
  details: { description: String, specs: { type: mongoose.Schema.Types.Mixed, default: {} }, dealer: { type: mongoose.Schema.Types.Mixed, default: {} }, vin: String },
  features: { type: [String], default: [] },
  gallery: { type: [{ image_url: String, image_public_id: String, sort_order: Number }], default: [] },
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, versionKey: false });

export default mongoose.models.Car || mongoose.model("Car", carSchema);
