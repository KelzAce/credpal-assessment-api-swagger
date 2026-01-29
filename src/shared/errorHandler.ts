import { ErrorRequestHandler } from "express";
import mongoose from "mongoose";
import { ZodError } from "zod";
import { HttpError } from "./HttpError";

export const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: err.flatten(),
    });
  }

  // Custom app errors
  if (err instanceof HttpError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details,
    });
  }

  // Mongoose duplicate key error
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const anyErr = err as any;
  if (anyErr?.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "Duplicate key error",
      details: anyErr.keyValue,
    });
  }

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    return res.status(400).json({
      success: false,
      message: "Database validation error",
      details: err.errors,
    });
  }

  // Fallback
  // eslint-disable-next-line no-console
  console.error(err);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
