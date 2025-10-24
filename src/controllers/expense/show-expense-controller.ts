import { Request, Response } from "express";
import ExpenseModel from "../../models/expense-model.ts";

interface ClientBody extends Request {
  body: {
    expenseId?: string;
    query: {
      page?: number;
      limit?: number;
    };
  };
  userId: string;
}

export const showExpenses = async (req: ClientBody, res: Response) => {
  const userId = req.userId;
  let requestExpenseId = req.body;
  const page = parseInt(String(req.body.query.page)) || 1;
  const limit = parseInt(String(req.body.query.limit)) || 10;

  try {
    let expenseData;
    if (requestExpenseId) {
      expenseData = await ExpenseModel.findOne({
        userId: userId,
        expenseId: requestExpenseId,
      });
      res.status(200).json({
        Success: true,
        message: "Expense retrieved SuccessFully",
        data: expenseData,
      });
    }

    if (!requestExpenseId) {
      res.status(404).json({
        success: false,
        message: "Expense not found!",
      });
    }

    const skip = (page - 1) * limit;

    const [expense, total] = await Promise.all([
      ExpenseModel.find({
        userId,
      })
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit),
      ExpenseModel.countDocuments({
        userId,
      }),
    ]);

    res.status(200).json({
      Success: true,
      message: "Data loaded SuccessFully",
      data: expense,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        hasMore: skip + expense.length < total,
      },
    });
  } catch (error) {
    res.status(400).json({ success: false, message: Error });
  }
};
