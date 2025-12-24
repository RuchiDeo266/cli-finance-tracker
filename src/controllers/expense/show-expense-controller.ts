import { Request, Response } from "express";
import ExpenseModel from "../../models/expense-model.ts";

interface ClientBody extends Request {
  body: {
    expenseId?: string;
  };
  query: {
    page: string;
    limit: string;
  };
  userId: string;
}

export const showExpenses = async (req: ClientBody, res: Response) => {
  const userId = req.userId;
  let expenseId = req.body?.expenseId;

  const page = req.query.page ? parseInt(String(req.query.page), 10) : 1;
  const limit = req.query.limit ? parseInt(String(req.query.limit), 10) : 10;

  try {
    // 1. If expenseId is provided → return single expense
    if (expenseId) {
      const expense = await ExpenseModel.findOne({
        userId,
        expenseId,
      });

      if (!expense) {
        return res.status(404).json({
          success: false,
          message: "Expense not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Expense retrieved successfully.",
        data: expense,
      });
    }

    // 2. Otherwise → return paginated list
    const skip = (page - 1) * limit;

    const [expenses, total] = await Promise.all([
      ExpenseModel.find({ userId }).sort({ date: -1 }).skip(skip).limit(limit),
      ExpenseModel.countDocuments({ userId }),
    ]);

    return res.status(200).json({
      success: true,
      message: "Expenses loaded successfully.",
      data: expenses,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasMore: skip + expenses.length < total,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load expenses.",
      // keep during debugging, remove in prod:
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
