import jwt from "jsonwebtoken";
import { AppError } from "../lib/errors.js";
import User from "../models/User.js";

export const authenticate = async (req, res, next) => {
  const authorization = req.get("authorization") || "";
  const [scheme, token, extra] = authorization.split(" ");
  if (scheme !== "Bearer" || !token || extra) {
    return next(new AppError(401, "Authentication required"));
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload || typeof payload !== "object" || !payload.sub) {
      throw new Error("JWT subject missing");
    }
  } catch {
    return next(new AppError(401, "Authentication required"));
  }

  const user = await User.findById(payload.sub).select("password_changed_at").lean();
  if (!user) return next(new AppError(401, "Authentication required"));
  const changedAt = user.password_changed_at ? Math.floor(new Date(user.password_changed_at).getTime() / 1000) : null;
  if (changedAt !== null && (!payload.iat || payload.iat < changedAt)) {
    return next(new AppError(401, "Authentication required"));
  }

  req.userId = String(payload.sub);
  next();
};
