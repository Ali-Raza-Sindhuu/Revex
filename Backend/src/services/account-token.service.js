import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import AccountToken from "../models/AccountToken.js";
import User from "../models/User.js";
import { AppError } from "../lib/errors.js";
import { sendEmail } from "./mail.service.js";

const CONFIG = {
  password_reset_tokens: { expiresSeconds: 1800, subject: "Reset your REVEX password", path: "/reset-password?token=", heading: "Reset your password", description: "Use the link below within 30 minutes to choose a new password." },
  email_verification_tokens: { expiresSeconds: 86400, subject: "Verify your REVEX email", path: "/verify-email?token=", heading: "Verify your REVEX email", description: "Use the link below within 24 hours to verify your email address." },
};
const hash = (token) => createHash("sha256").update(token).digest("hex");
const frontendUrl = () => (process.env.FRONTEND_URL || "http://localhost:5173").replace(/\/+$/, "");

export const createAndSendAccountToken = async (type, user) => {
  const config = CONFIG[type];
  if (!config) throw new Error("Unsupported account token type");
  const token = randomBytes(32).toString("hex");
  await AccountToken.create({ user_id: user._id || user.id, type, token_hash: hash(token), expires_at: new Date(Date.now() + config.expiresSeconds * 1000) });
  const link = `${frontendUrl()}${config.path}${encodeURIComponent(token)}`;
  await sendEmail({ to: user.email, subject: config.subject, html: `<h1>${config.heading}</h1><p>${config.description}</p><p><a href="${link}">${config.heading}</a></p>`, text: `${config.description}\n${link}` });
};

const consume = async (type, token) => {
  if (typeof token !== "string" || !/^[a-f0-9]{64}$/i.test(token)) throw new AppError(400, "This link is invalid or has expired.");
  const record = await AccountToken.findOneAndUpdate({ type, token_hash: hash(token), used_at: null, expires_at: { $gt: new Date() } }, { $set: { used_at: new Date() } }, { new: true });
  if (!record) throw new AppError(400, "This link is invalid, expired, or has already been used.");
  return record;
};

export const forgotPassword = async (email) => {
  const user = await User.findOne({ email: email.trim().toLowerCase() });
  if (user) { try { await createAndSendAccountToken("password_reset_tokens", user); } catch (error) { console.error(`[account-email] reset email failed reason=${error.name || "Error"}`); } }
  return { message: "If an account exists for that email, we've sent a link." };
};
export const resetPassword = async (token, password) => {
  const record = await consume("password_reset_tokens", token);
  await User.findByIdAndUpdate(record.user_id, { password_hash: await bcrypt.hash(password, 12), password_changed_at: new Date() });
};
export const verifyEmail = async (token) => {
  const record = await consume("email_verification_tokens", token);
  await User.findByIdAndUpdate(record.user_id, { $set: { email_verified_at: new Date() } });
};
export const resendVerification = async (userId) => {
  const user = await User.findById(userId);
  if (user && !user.email_verified_at) { try { await createAndSendAccountToken("email_verification_tokens", user); } catch (error) { console.error(`[account-email] verification email failed reason=${error.name || "Error"}`); } }
  return { message: "If your account needs verification, we have sent an email." };
};
