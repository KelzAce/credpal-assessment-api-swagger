import { z } from "zod";

export const registerSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).max(100),
    email: z.string().email().transform((v) => v.toLowerCase().trim()),
    password: z.string().min(8).max(200),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email().transform((v) => v.toLowerCase().trim()),
    password: z.string().min(1),
  }),
});
