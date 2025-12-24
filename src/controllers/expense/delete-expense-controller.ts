import { Request, Response } from "express";
import ExpenseModel from "../../models/expense-model.ts";
import { logger } from "../../logs/prod-app.ts";

interface ClientRequest extends Request {
  body: {
    expenseId: string;
  };
  userId: string;
}

export const deleteExpense = async (req: ClientRequest, res: Response) => {
  const expenseId = req.body.expenseId;
  const userId = req.userId;

  if (!expenseId) {
    res.status(404).json({ success: false, message: "Missing data" });
  }

  try {
    const result = await ExpenseModel.deleteOne({
      userId: userId,
      expenseId,
    });

    if (result.deletedCount === 0) {
      res.status(404).json({
        success: false,
        message: "Expense not found!",
      });
    }
    res.status(200).json({
      success: true,
      message: `Expense ${expenseId} deleted successfully`,
    });
  } catch (error: any) {
    logger.error("Error in delete expenses", error);
    res.status(500).json({
      success: false,
      message: "An unexpected server error occurred.",
    });
  }
};
