import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  car_id: { type: String, required: true, index: true }, user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  start_date: { type: String, required: true }, end_date: { type: String, required: true },
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending", index: true },
  cart_item_id: { type: mongoose.Schema.Types.ObjectId },
  checkout_session_id: { type: String, default: null, index: true, sparse: true },
  amount_total: { type: Number, min: 0 }, currency: { type: String, default: "usd" }, paid_at: { type: Date, default: null },
}, { timestamps: true, versionKey: false });

bookingSchema.index({ car_id: 1, status: 1, start_date: 1, end_date: 1 });

export default mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
