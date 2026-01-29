import { Router } from "express";
import { requireAuth } from "../../shared/requireAuth";
import { validate } from "../../shared/validate";
import {
  createTransactionSchema,
  updateTransactionSchema,
  idParamSchema,
  listSchema,
} from "./transactions.validation";
import {
  createTransaction,
  listTransactions,
  getTransaction,
  updateTransaction,
  deleteTransaction,
} from "./transactions.controller";

export const transactionRouter = Router();

// All routes are protected
transactionRouter.use(requireAuth);

// Create
transactionRouter.post("/", validate(createTransactionSchema), createTransaction);

// List
transactionRouter.get("/", validate(listSchema), listTransactions);

// Read single
transactionRouter.get("/:id", validate(idParamSchema), getTransaction);

// Update
transactionRouter.patch("/:id", validate(idParamSchema.merge(updateTransactionSchema)), updateTransaction);

// Delete
transactionRouter.delete("/:id", validate(idParamSchema), deleteTransaction);
