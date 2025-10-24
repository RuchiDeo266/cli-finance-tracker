import mongoose, { Schema, Document } from "mongoose";
import { IExpense } from "../config/types/expenseInterface.ts";
export const amountTypeEnum = ["debit", "credit", "initialdeposit"];
const expenseSchema: Schema = new Schema({
  expenseId: {
    type: String,
    required: true,
    unique: true, // Crucial for fast lookup and integrity checks (Fin0001)
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true, // Index for fast user-specific queries
  },
  amount: {
    type: Number,
    required: true,
    min: 0.01, // Ensures all recorded transactions have a value
  },
  description: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    required: true,
    // NOTE: Validation logic in the controller will verify this name against CategoryModel
  },
  transactionType: {
    type: String,
    enum: amountTypeEnum,
    required: true,
  },
  notes: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
    index: true, // Index for fast time-based reports
  },
  isCurrent: {
    type: Boolean,
    default: false,
    // CRITICAL: This is only set to true when the transactionType is 'InitialDeposit'
    // and it represents the currently active starting balance.
  },
});

const ExpenseModel = mongoose.model<IExpense>("Expense", expenseSchema);
export default ExpenseModel;
