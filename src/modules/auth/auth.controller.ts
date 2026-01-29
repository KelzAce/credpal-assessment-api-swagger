import { Request, Response } from "express";
import { asyncHandler } from "../../shared/asyncHandler";
import { authService } from "./auth.service";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const { fullName, email, password } = req.body;

  const { user, token } = await authService.register({ fullName, email, password });

  res.status(201).json({
    success: true,
    message: "Registered successfully",
    token,
    user,
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const { user, token } = await authService.login({ email, password });

  res.status(200).json({
    success: true,
    message: "Login successful",
    token,
    user,
  });
});
