import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";

import { env } from "./shared/env";
import { notFound } from "./shared/notFound";
import { errorHandler } from "./shared/errorHandler";

import { authRouter } from "./modules/auth/auth.routes";
import { transactionRouter } from "./modules/transactions/transactions.routes";

import { setupSwagger } from "./docs/swagger";

export const app = express();

// Security & basics
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: env.CORS_ORIGIN ? env.CORS_ORIGIN.split(",") : "*",
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300, // adjust as needed
    standardHeaders: "draft-7",
    legacyHeaders: false,
  }),
);

// Routes

setupSwagger(app);
app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({ success: true, message: "OK" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/transactions", transactionRouter);

// 404 + error handler
app.use(notFound);
app.use(errorHandler);
