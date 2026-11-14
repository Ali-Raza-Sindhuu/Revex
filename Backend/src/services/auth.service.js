import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import User from "../models/User.js";
import { AppError } from "../lib/errors.js";
import { createAndSendAccountToken } from "./account-token.service.js";

let googleCredentialVerifier;
export const setGoogleCredentialVerifier = (verifier) => { googleCredentialVerifier = verifier; };
const publicUser = (user) => user && ({ id: String(user._id), name: user.name, fullName: user.name, email: user.email, createdAt: user.created_at, updatedAt: user.updated_at, emailVerifiedAt: user.email_verified_at || null });
const issueToken = (id) => jwt.sign({ sub: String(id) }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "1h" });
export const getUserById = async (id) => publicUser(await User.findById(id).lean());

export const signup = async ({ name, fullName, email, password }) => {
  const normalizedName = (name || fullName).trim();
  if (await User.exists({ email })) throw new AppError(409, "An account with this email already exists");
  const user = await User.create({ name: normalizedName, email, password_hash: await bcrypt.hash(password, 12) });
  const result = publicUser(user);
  try { await createAndSendAccountToken("email_verification_tokens", result); } catch (error) { console.error(`[account-email] signup verification setup failed reason=${error.name || "Error"}`); }
  const token = issueToken(user._id);
  return { user: result, token, accessToken: token, message: "Account created successfully" };
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email }).lean();
  if (!user?.password_hash || !(await bcrypt.compare(password, user.password_hash))) throw new AppError(401, "Invalid email or password");
  const token = issueToken(user._id);
  return { user: publicUser(user), token, accessToken: token };
};

export const updateProfile = async (id, { name, currentPassword, newPassword }) => {
  const user = await User.findById(id);
  if (!user) throw new AppError(404, "User not found");
  if (newPassword) {
    if (!user.password_hash || !(await bcrypt.compare(currentPassword || "", user.password_hash))) throw new AppError(401, "Current password is incorrect");
    user.password_hash = await bcrypt.hash(newPassword, 12);
    user.password_changed_at = new Date();
  }
  if (name) user.name = name;
  await user.save();
  return publicUser(user);
};

export const loginWithGoogle = async (credential) => {
  let payload;
  try {
    if (googleCredentialVerifier) payload = await googleCredentialVerifier(credential, process.env.GOOGLE_CLIENT_ID);
    else { const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); payload = (await client.verifyIdToken({ idToken: credential, audience: process.env.GOOGLE_CLIENT_ID })).getPayload(); }
  } catch { throw new AppError(401, "Invalid Google credential"); }
  const email = typeof payload?.email === "string" ? payload.email.trim().toLowerCase() : "";
  const subject = typeof payload?.sub === "string" ? payload.sub : "";
  if (!email || !subject || payload.email_verified !== true) throw new AppError(401, "Invalid Google credential");
  let user = await User.findOne({ email });
  if (user?.google_sub && user.google_sub !== subject) throw new AppError(401, "Google account does not match this user");
  if (!user) user = new User({ email, name: (payload.name?.trim() || email.split("@")[0]).slice(0, 120), email_verified_at: new Date() });
  user.google_sub = subject;
  user.email_verified_at ||= new Date();
  await user.save();
  const token = issueToken(user._id);
  return { user: publicUser(user), token, accessToken: token };
};
