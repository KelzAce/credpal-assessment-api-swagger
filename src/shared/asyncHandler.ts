import { Request, Response, NextFunction, RequestHandler } from "express";

// Wrap async controllers so thrown errors go to the error handler
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>): RequestHandler =>
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
