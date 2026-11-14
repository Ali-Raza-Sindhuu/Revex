import mongoose from "mongoose";

const schema = new mongoose.Schema({
  fullName: { type: String, required: true, trim: true, maxlength: 120 },
  email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
  phone: { type: String, trim: true, maxlength: 30, default: "" },
  enquiry: { type: String, required: true, enum: ["general", "buying", "rental", "selling", "financing", "inspection", "maintenance", "insurance", "delivery"] },
  car_id: { type: String, default: null, index: true },
  car_name: { type: String, trim: true, maxlength: 200, default: "" },
  contact_time: { type: String, trim: true, maxlength: 80, default: "" },
  message: { type: String, required: true, trim: true, minlength: 10, maxlength: 5000 },
}, { timestamps: true, versionKey: false });

export default mongoose.models.ContactEnquiry || mongoose.model("ContactEnquiry", schema);
