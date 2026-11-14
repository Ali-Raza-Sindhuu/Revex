import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  listing_type: { type: String, enum: ["buy", "rent"], required: true },
  start_date: { type: String, default: null }, end_date: { type: String, default: null },
  added_at: { type: Date, default: Date.now },
  car_id: { type: String, required: true },
}, { _id: true });
const cartSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  items: { type: [itemSchema], default: [] },
}, { timestamps: true, versionKey: false });

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
