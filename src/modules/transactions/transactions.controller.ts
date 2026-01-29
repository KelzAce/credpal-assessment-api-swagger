import { Request, Response } from "express";
import { asyncHandler } from "../../shared/asyncHandler";
import { HttpError } from "../../shared/HttpError";
import { TransactionModel } from "./transactions.model";

export const createTransaction = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new HttpError(401, "Unauthorized");

  const occurredAt = req.body.occurredAt ? new Date(req.body.occurredAt) : new Date();

  const created = await TransactionModel.create({
    user: userId,
    ...req.body,
    occurredAt,
  });

  res.status(201).json({
    success: true,
    message: "Transaction created",
    data: created,
  });
});

export const listTransactions = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new HttpError(401, "Unauthorized");

  const page = Math.max(1, parseInt((req.query.page as string) || "1", 10));
  const limitRaw = parseInt((req.query.limit as string) || "10", 10);
  const limit = Math.min(100, Math.max(1, limitRaw));
  const sort = (req.query.sort as string) || "-occurredAt";
  const skip = (page - 1) * limit;

  const filter = { user: userId };

  const [total, data] = await Promise.all([
    TransactionModel.countDocuments(filter),
    TransactionModel.find(filter).sort(sort).skip(skip).limit(limit),
  ]);

  const pages = Math.ceil(total / limit) || 1;

  res.status(200).json({
    success: true,
    message: "Transactions fetched",
    data,
    meta: { page, limit, total, pages },
  });
});

export const getTransaction = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new HttpError(401, "Unauthorized");

  const tx = await TransactionModel.findOne({ _id: req.params.id, user: userId });
  if (!tx) throw new HttpError(404, "Transaction not found");

  res.status(200).json({
    success: true,
    message: "Transaction fetched",
    data: tx,
  });
});

export const updateTransaction = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new HttpError(401, "Unauthorized");

  const update: Record<string, unknown> = { ...req.body };
  if (req.body.occurredAt) update.occurredAt = new Date(req.body.occurredAt);

  const tx = await TransactionModel.findOneAndUpdate(
    { _id: req.params.id, user: userId },
    update,
    { new: true, runValidators: true },
  );

  if (!tx) throw new HttpError(404, "Transaction not found");

  res.status(200).json({
    success: true,
    message: "Transaction updated",
    data: tx,
  });
});

export const deleteTransaction = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new HttpError(401, "Unauthorized");

  const tx = await TransactionModel.findOneAndDelete({ _id: req.params.id, user: userId });
  if (!tx) throw new HttpError(404, "Transaction not found");

  res.status(200).json({
    success: true,
    message: "Transaction deleted",
    data: tx,
  });
});
