import mongoose from "mongoose";

import ExpenseModel, { amountTypeEnum } from "../models/expense-model.ts";
import { generateNextExpenseId } from "./next-expemse-id-generator.ts";

// Assumes input is already validated (amount > 0, category is valid, etc.)
export async function createTransaction(
  userId: string,
  amount: number,
  transactionType: string, // Use the correct type
  category: string,
  description?: string,
  notes?: string
): Promise<
  { success: true; expenseId: string } | { success: false; message: string }
> {
  //check the transition type
  const isTransition = Object.values(amountTypeEnum).includes(
    transactionType.toLowerCase()
  );

  if (!isTransition) {
    return { success: false, message: "Invalid transaction type" };
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Generate unique ID within the transaction
    const expenseId = await generateNextExpenseId(session, userId);

    // 2. CORRECT MONGOOSE SYNTAX: Use new/save for transactions
    const newExpense = new ExpenseModel({
      expenseId: expenseId,
      userId: userId,
      amount: amount,
      category: category,
      description:
        description ||
        (transactionType === "InitialDeposit"
          ? "Initial Account Setup"
          : "No description provided"),
      transactionType: transactionType,
      notes: notes,
      date: new Date(),
      isCurrent: transactionType === "InitialDeposit" ? true : false,
    });

    await newExpense.save({ session }); // Save the new document

    await session.commitTransaction();
    return { success: true, expenseId: expenseId };
  } catch (error: any) {
    await session.abortTransaction();
    console.error("TRANSACTION SERVICE FAILURE:", error);

    // Return a generic error message, not the internal error object
    return {
      success: false,
      message: "Database transaction failed due to internal error.",
    };
  } finally {
    session.endSession();
  }
}
