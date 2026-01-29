import mongoose, { InferSchemaType } from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: ["income", "expense"], required: true },
    amount: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "NGN" },
    description: { type: String },
    category: { type: String },
    occurredAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true },
);

transactionSchema.index({ user: 1, occurredAt: -1 });

export type Transaction = InferSchemaType<typeof transactionSchema>;

export const TransactionModel = mongoose.model<Transaction>("Transaction", transactionSchema);
