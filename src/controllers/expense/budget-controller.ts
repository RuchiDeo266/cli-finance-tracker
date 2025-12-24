import { Request, Response } from "express";
import { logger } from "../../logs/prod-app.ts";
import { validateExpenseCategories } from "../../services/validate-service.ts";
import BudgetModel from "../../models/budget-model.ts";

interface BudgetSetRequest extends Request {
  body: {
    limits: Array<{ name: string; limit: number }>;
  };
  userId: string;
}

export const setBudget = async (req: BudgetSetRequest, res: Response) => {
  const userId = req.userId;
  const { limits } = req.body;

  if (!limits || !Array.isArray(limits)) {
    return res.status(400).json({
      success: false,
      message: "Missing limits data.",
    });
  }

  try {
    // Take all limits name
    const limitsName: string[] = limits.map((limit) => limit.name);

    // Validate the catergory names with existing one
    const validatedNames = await validateExpenseCategories(limitsName);

    if (!validatedNames.success) {
      return res.status(400).json({
        success: false,
        message: "Budget creation failed",
        invalidCategories: validatedNames.invalidCategories,
      });
    }

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();

    const getBudgetData = await BudgetModel.findOne({ userId: userId });

    if (!getBudgetData) {
      // No budget for this month/year yet → create it
      await BudgetModel.create({
        userId,
        month: currentMonth,
        year: currentYear,
        categoryLimits: limits,
      });
    } else {
      // Budget for this month/year exists → update only its limits
      await BudgetModel.findOneAndUpdate(
        {
          userId,
          month: currentMonth,
          year: currentYear,
        },
        {
          $set: { categoryLimits: limits },
        },
        {
          new: true,
          runValidators: true,
        }
      );
    }
    return res.status(201).json({
      success: true,
      message: `Monthly budget for ${currentMonth}/${currentYear} successfully set/updated.`,
    });
  } catch (error) {
    logger.error(
      `Failed to set/update monthly budget for user ${userId}: ${
        error instanceof Error ? error.message : String(error)
      }`
    );

    return res.status(500).json({
      success: false,
      message:
        "Failed to set/update monthly budget. Please try again later or contact support if the issue persists.",
    });
  }
};
