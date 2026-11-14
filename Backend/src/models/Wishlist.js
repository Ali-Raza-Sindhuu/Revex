import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  car_ids: { type: [String], default: [] },
}, { timestamps: true, versionKey: false });

export default mongoose.models.Wishlist || mongoose.model("Wishlist", wishlistSchema);
