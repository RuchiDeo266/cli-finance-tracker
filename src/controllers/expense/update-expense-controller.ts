import { Request, Response } from "express";
import ExpenseModel from "../../models/expense-model.ts";
import { validateExpenseCategories } from "../../services/validate-service.ts";
import { logger } from "../../logs/prod-app.ts";

interface ClientRequest extends Request {
  body: {
    expenseId: string;
    amount: number;
    category: string;
    note: string;
  };
  userId: string;
}
export const updateExpense = async (req: ClientRequest, res: Response) => {
  const userId = req.userId;
  const { expenseId, amount, category, note } = req.body;

  if (!expenseId) {
    res.status(400).json({
      success: false,
      message: "ExpenseId is required",
    });
    return;
  }

  if (!amount || !category || !note) {
    res
      .status(400)
      .json({ success: false, message: "No fields to update provided" });
  }

  try {
    const expenseData = await ExpenseModel.findOne({ userId, expenseId });

    if (!expenseData) {
      res.status(404).json({
        success: false,
        message: "Expnese not found|",
      });
      return;
    }

    if (category && category !== expenseData.category && category !== "Setup") {
      const isValidCategory = await validateExpenseCategories([category]);
      if (!isValidCategory) {
        res.status(400).json({
          success: false,
          message: "Invalid category",
        });
      }
    }

    const updates: any = {};
    if (amount !== undefined) updates.amount = amount;
    if (category) updates.category = category;
    if (note !== undefined) updates.note = note;
    updates.updatedAt = new Date();

    const updatedExpense = await ExpenseModel.findOneAndUpdate(
      { userId, expenseId },
      { $set: updates },
      { new: true } // return updated document
    );

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: updatedExpense,
    });
  } catch (error: any) {
    logger.error("update Expense error :", error);
    res.status(500).json({
      success: false,
      message: "Failed to update expense",
    });
  }
};
