import mongoose, { Document } from "mongoose";
// Interface for Category Document
export interface ICategory extends Document {
  name: string;
  type: "Expense" | "Income";
}
// Interface for Budget Document (for TypeScript)
export interface IBudget extends Document {
  userId: mongoose.Types.ObjectId;
  month: number;
  year: number;
  categoryLimits: { name: string; limit: number }[];
}

// Interface for Expense Document (for TypeScript)
export interface IExpense extends Document {
  expenseId: string;
  userId: mongoose.Types.ObjectId;
  amount: number;
  description: string;
  category: string;
  transactionType: "Debit" | "Credit" | "InitialDeposit";
  notes?: string;
  date: Date;
  isCurrent: boolean;
}
