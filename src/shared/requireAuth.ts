import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { env } from "./env";
import { HttpError } from "./HttpError";

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return next(new HttpError(401, "Missing or invalid Authorization header"));
  }

  const token = header.slice("Bearer ".length).trim();

  try {
    const payload = jwt.verify(token, env.JWT_SECRET) as { id: string; email: string; iat: number; exp: number };
    req.user = { id: payload.id, email: payload.email };
    return next();
  } catch {
    return next(new HttpError(401, "Invalid or expired token"));
  }
};
