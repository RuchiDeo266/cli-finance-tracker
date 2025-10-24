import mongoose from "mongoose";
import { Request, Response } from "express";

import { RequestBudget } from "./add-expense-controller.ts";
import ExpenseModel from "../../models/expense-model.ts";
import { generateNextExpenseId } from "../../utils/next-expemse-id-generator.ts";

export const handleInitialDeposit = async (
  req: RequestBudget,
  res: Response
) => {
  const { amount, description } = req.body;
  const userId = req.userId;

  if (!userId || !amount || !description) {
    return res.status(400).json({
      success: false,
      message: "Amount and a description/reason are required.",
    });
  }

  // Start MongoDB Transaction for atomicity
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. INVALIDATE OLD ACTIVE DEPOSIT (Audit Trail)
    // Find the currently active InitialDeposit and mark it as historical.
    const oldDeposit = await ExpenseModel.findOneAndUpdate(
      { userId: userId, transactionType: "InitialDeposit", isCurrent: true },
      {
        $set: {
          isCurrent: false,
          notes: `Replaced by new deposit on ${new Date().toISOString()}. Reason: ${description}`,
        },
      },
      { new: true, session: session } // Use the transaction session
    );

    const newExpenseId = await generateNextExpenseId(session, userId); // Assume ID generator is imported

    const newDeposit = new ExpenseModel({
      userId: userId,
      expenseId: newExpenseId,
      amount: amount,
      transactionType: "InitialDeposit",
      description: description, // Stores the user's reason
      category: "Setup", // Use a fixed category for internal consistency
      isCurrent: true, // CRITICAL: This is the new active starting point
    });
    await newDeposit.save({ session });

    await session.commitTransaction();

    // 3. Final Response
    const message = oldDeposit
      ? "Initial balance adjusted successfully."
      : "Initial balance set successfully.";

    return res.status(201).json({
      success: true,
      message: message,
      expenseId: newExpenseId,
    });
  } catch (error) {
    await session.abortTransaction();
    console.error("Initial Deposit Transaction Failed:", error);
    return res.status(500).json({
      success: false,
      message: "Transaction failed. Balance not updated.",
    });
  } finally {
    session.endSession();
  }
};
