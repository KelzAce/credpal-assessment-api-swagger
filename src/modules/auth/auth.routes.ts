import { Router } from "express";
import { validate } from "../../shared/validate";
import { registerSchema, loginSchema } from "./auth.validation";
import { register, login } from "./auth.controller";

export const authRouter = Router();

authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", validate(loginSchema), login);
