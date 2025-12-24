import mongoose, { Schema, Document } from "mongoose";
import { IBudget } from "../config/types/expenseInterface.ts";

// Sub-schema for individual category limits
const categoryLimitSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    limit: {
      type: Number,
      required: true,
      default: 0,
      min: 0, // Budget limit should not be negative
    },
  },
  { _id: false }
); // Prevents Mongoose from creating unnecessary IDs for embedded documents

const budgetSchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true, // Index for fast lookup by user
  },
  month: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
  },
  year: {
    type: Number,
    required: true,
  },

  // Array of category limits using the embedded schema
  categoryLimits: {
    type: [categoryLimitSchema],
    required: true,
    default: [],
  },
});

// This ensures a user can only have ONE budget document for a specific month and year.
budgetSchema.index({ userId: 1, month: 1, year: 1 }, { unique: true });

const BudgetModel = mongoose.model<IBudget>("Budget", budgetSchema);
export default BudgetModel;
