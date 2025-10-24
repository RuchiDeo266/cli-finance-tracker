import { Request, Response } from "express";
import CategoryModel from "../../models/category-model.ts";
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
      message: "Missing month, year, or limits data.",
    });
  }

  try {
    const limitsName: string[] = limits.map((limit) => limit.name);

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

    const getBudgetData = await BudgetModel.findOne({ id: userId });

    if (!getBudgetData) {
      BudgetModel.create(
        {
          $set: {
            userId: userId,
            month: currentMonth,
            year: currentYear,
            categoryLimits: limits,
          },
        },
        { new: true, upsert: true, runValidators: true }
      );
    } else {
      if (currentYear < getBudgetData.year) {
        await BudgetModel.findOneAndUpdate(
          {
            userId: userId,
          },
          {
            $set: {
              month: currentMonth,
              year: currentYear,
              categoryLimits: limits,
            },
          },
          { new: true, upsert: true, runValidators: true }
        );
      }
      if (currentMonth > getBudgetData.month) {
        await BudgetModel.findOneAndUpdate(
          {
            userId: userId,
            year: currentYear,
          },
          {
            $set: {
              month: currentMonth,
              categoryLimits: limits,
            },
          },
          { new: true, upsert: true, runValidators: true }
        );
      }

      if (
        currentMonth === getBudgetData.month &&
        currentYear === getBudgetData.year
      ) {
        await BudgetModel.findOneAndUpdate(
          {
            userId: userId,
            year: currentYear,
            month: currentMonth,
          },
          {
            $set: {
              categoryLimits: limits,
            },
          },
          { new: true, upsert: true, runValidators: true }
        );
      }
    }
    return res.status(201).json({
      success: true,
      message: `Monthly budget for ${currentMonth}/${currentYear} successfully set/updated.`,
    });
  } catch (error) {}
};

export const budgetByCategoryLimitUpdate = async () => {};
