import { z } from "zod";

export const createTransactionSchema = z.object({
  body: z.object({
    type: z.enum(["income", "expense"]),
    amount: z.number().positive(),
    currency: z.string().min(3).max(3).default("NGN"),
    description: z.string().min(1).max(300).optional(),
    category: z.string().min(1).max(100).optional(),
    occurredAt: z.string().datetime().optional(), // ISO date string
  }),
});

export const updateTransactionSchema = z.object({
  body: z
    .object({
      type: z.enum(["income", "expense"]).optional(),
      amount: z.number().positive().optional(),
      currency: z.string().min(3).max(3).optional(),
      description: z.string().min(1).max(300).optional(),
      category: z.string().min(1).max(100).optional(),
      occurredAt: z.string().datetime().optional(),
    })
    .refine((obj) => Object.keys(obj).length > 0, "At least one field is required"),
});

export const idParamSchema = z.object({
  params: z.object({
    id: z.string().min(1),
  }),
});

export const listSchema = z.object({
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sort: z.string().optional(),
  }),
});
