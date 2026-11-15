import { AppError } from "../lib/errors.js";

export const notFound = (req, res, next) => {
  next(new AppError(404, "Route not found"));
};

export const errorHandler = (error, req, res, next) => {
  console.error(`[${req.method} ${req.originalUrl}]`, error);
  if (res.headersSent) return next(error);

  const errorStatus = Number.isInteger(error.status) ? error.status : error.statusCode;
  const status = Number.isInteger(errorStatus) && errorStatus >= 400 && errorStatus < 600
    ? errorStatus
    : 500;

  const isProductionServerError = status >= 500 && process.env.NODE_ENV === "production";
  const message = status === 500 || isProductionServerError ? "Internal server error" : error.message;
  const response = { message, error: { message } };
  if (error.errors) response.errors = error.errors;
  res.status(status).json(response);
};
