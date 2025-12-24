import { Request, Response } from "express";
import { validateExpenseCategories } from "../../services/validate-service.ts";
import { createTransaction } from "../../utils/expense-transaction.ts";
import { logger } from "../../logs/prod-app.ts";
export interface RequestBudget extends Request {
  body: {
    amount: number;
    notes: string;
    description?: string;
    category: string;
    transitionType: string;
  };
  userId: string;
}
export const addExpense = async (req: RequestBudget, res: Response) => {
  const { amount, notes, category, transitionType, description } = req.body;
  const userId = req.userId;

  const validateCategory = await validateExpenseCategories([category]);
  logger.info(validateCategory);
  if (!validateCategory.success) {
    return res.status(400).json({
      success: false,
      message: "Invalid category format or unknown category",
    });
  }

  if (
    amount == null ||
    typeof amount !== "number" ||
    amount <= 0 ||
    !notes ||
    !category ||
    !transitionType
  ) {
    return res.status(400).json({
      success: false,
      message: "Some fields are missing or invalid.",
    });
  }

  const allowedTypes = ["credit", "debit", "investment"] as const;
  if (!allowedTypes.includes(transitionType as any)) {
    return res.status(400).json({
      success: false,
      message: "Invalid transition type. Allowed: credit, debit, investment.",
    });
  }

  try {
    // Validate category
    const categoryValidation = await validateExpenseCategories([category]);

    if (!categoryValidation.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid category format or unknown category.",
        invalidCategories: categoryValidation.invalidCategories,
      });
    }

    // Route different transition types
    let result;

    if (transitionType === "credit") {
      result = await createTransaction(
        userId,
        amount,
        transitionType,
        category,
        "Income",
        notes
      );
    } else if (transitionType === "investment") {
      const finalDescription = description || "Investment";
      result = await createTransaction(
        userId,
        amount,
        transitionType,
        category,
        finalDescription,
        notes
      );
    } else {
      result = await createTransaction(
        userId,
        amount,
        transitionType,
        category,
        description,
        notes
      );
    }

    if (result.success) {
      return res
        .status(201)
        .json({ success: true, expenseId: result.expenseId });
    } else {
      return res.status(500).json({ success: false, message: result.message });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to add expense. Please try again later.",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};
