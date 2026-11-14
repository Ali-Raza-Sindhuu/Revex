import mongoose from "mongoose";

const schema = new mongoose.Schema({ email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 } }, { timestamps: true, versionKey: false });
export default mongoose.models.NewsletterSubscriber || mongoose.model("NewsletterSubscriber", schema);
