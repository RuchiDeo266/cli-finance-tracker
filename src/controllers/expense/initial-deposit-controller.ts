import { Response } from "express";
import { amountTypeEnum } from "../../models/expense-model.ts";
import { RequestBudget } from "./add-expense-controller.ts";
import { createTransaction } from "../../utils/expense-transaction.ts";

export const setInitialDeposit = async (req: RequestBudget, res: Response) => {
  const { amount, notes, type, transitionType, description } = req.body;
  const userId = req.userId;

  const result = await createTransaction(
    userId,
    amount,
    amountTypeEnum[2],
    "InitialDeposit",
    description
  );
  if (result.success) {
    return res.status(201).json({ success: true, expenseId: result.expenseId });
  } else {
    // Send a 500 for transaction failure
    return res.status(500).json({ success: false, message: result.message });
  }
};
