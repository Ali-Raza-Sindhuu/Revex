import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password_hash: { type: String, default: null }, google_sub: { type: String, unique: true, sparse: true },
  email_verified_at: { type: Date, default: null }, password_changed_at: { type: Date, default: null },
}, { timestamps: { createdAt: "created_at", updatedAt: "updated_at" }, versionKey: false });

export default mongoose.models.User || mongoose.model("User", userSchema);
