import { z } from "zod";
import { AppError } from "../lib/errors.js";
import ContactEnquiry from "../models/ContactEnquiry.js";
import NewsletterSubscriber from "../models/NewsletterSubscriber.js";

const contactSchema = z.object({
  fullName: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().max(30).optional().default(""),
  enquiry: z.enum(["general", "buying", "rental", "selling", "financing", "inspection", "maintenance", "insurance", "delivery"]),
  carId: z.string().trim().max(64).optional(),
  carName: z.string().trim().max(200).optional(),
  contactTime: z.string().trim().max(80).optional(),
  message: z.string().trim().min(10).max(5000), consent: z.literal(true),
});
const newsletterSchema = z.object({ email: z.string().trim().email().max(254) });
const parse = (schema, body) => {
  const result = schema.safeParse(body);
  if (!result.success) throw new AppError(400, "Please check the submitted information.", Object.fromEntries(result.error.issues.map((issue) => [String(issue.path[0] || "body"), issue.message])));
  return result.data;
};

export const createContactEnquiry = async (req, res) => {
  const { consent, ...values } = parse(contactSchema, req.body);
  const { carId, carName, contactTime, ...enquiry } = values;
  await ContactEnquiry.create({ ...enquiry, email: enquiry.email.toLowerCase(), car_id: carId || null, car_name: carName || "", contact_time: contactTime || "" });
  res.status(201).json({ message: "Your enquiry has been received." });
};
export const subscribeNewsletter = async (req, res) => {
  const { email } = parse(newsletterSchema, req.body);
  try { await NewsletterSubscriber.create({ email: email.toLowerCase() }); }
  catch (error) { if (error.code !== 11000) throw error; }
  res.status(200).json({ message: "Thanks! You're on the list." });
};
