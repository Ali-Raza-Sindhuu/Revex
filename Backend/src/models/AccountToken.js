import mongoose from "mongoose";

const accountTokenSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["password_reset_tokens", "email_verification_tokens"], required: true },
  token_hash: { type: String, required: true, unique: true }, expires_at: { type: Date, required: true }, used_at: { type: Date, default: null },
}, { timestamps: true, versionKey: false });
accountTokenSchema.index({ expires_at: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.AccountToken || mongoose.model("AccountToken", accountTokenSchema);
