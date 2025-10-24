import { Request, Response } from "express";
import ExpenseModel, { amountTypeEnum } from "../../models/expense-model.ts";
import mongoose from "mongoose";
import { generateNextExpenseId } from "../../utils/next-expemse-id-generator.ts";
import { validateExpenseCategories } from "../../services/validate-service.ts";
import { createTransaction } from "../../utils/expense-transaction.ts";
export interface RequestBudget extends Request {
  body: {
    amount: number;
    notes?: string;
    type: typeof amountTypeEnum;
    description?: string;
    category: string;
    transitionType: string;
  };

  userId: string;
}
export const addExpense = async (req: RequestBudget, res: Response) => {
  const { amount, notes, type, category, transitionType, description } =
    req.body;
  const userId = req.userId;

  //   if (!userId) {
  //     return res.status(401).json({ success: false, message: "Unauthorized" });
  //   }

  const validateCategory = await validateExpenseCategories([category]);
  if (!validateCategory) {
    return res.status(400).json({
      success: false,
      message: "Invalid category format or unknown category",
    });
  }
  if (!amount || !type || !transitionType) {
    return res.status(400).json({
      success: false,
      message: "Some field are missing,",
    });
  }

  if (transitionType === "credit") {
    const result = await createTransaction(
      userId,
      amount,
      transitionType, // Hardcode the type here
      category,
      "Income",
      notes
    );
  }

  const result = await createTransaction(
    userId,
    amount,
    transitionType, // Hardcode the type here
    category,
    description,
    notes
  );

  if (result.success) {
    return res.status(201).json({ success: true, expenseId: result.expenseId });
  } else {
    // Send a 500 for transaction failure
    return res.status(500).json({ success: false, message: result.message });
  }
};
