import mongoose, { Schema, Document } from "mongoose";
import { ICategory } from "../config/types/expenseInterface.ts";

const categorySchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  type: {
    type: String,
    enum: ["Expense", "Income", "InitialDeposit"],
    required: true,
  },
});

const CategoryModel = mongoose.model<ICategory>("Category", categorySchema);
export default CategoryModel;
