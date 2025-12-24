import { SavingRow } from "../../config/types/digest.ts";
import { PassableObj } from "./monthly-digest.ts";

// TODO: change type back to passableObj
export const generatePdfData = async (
  passableObject: any,
  analysisFromAi: any
) => {
  // Income
  const incomeMap = new Map();
  passableObject.expenseOfLastMonth
    .filter((items: any) => items.transactionType === "Credit")
    .forEach((items: any) => {
      const existing = incomeMap.get(items.category);
      incomeMap.set(items.category, {
        amount: existing ? existing.amount + items.amount : items.amount,
        notes: items.notes,
      });
    });

  // convert map to array
  const incomeRows = Array.from(incomeMap, ([key, value]) => ({
    category: key,
    amount: value.amount,
    notes: value.notes,
  }));

  // Spending
  const totalDebitrow = new Map();

  passableObject.expenseOfLastMonth
    .filter((items: any) => items.transactionType === "Debit")
    .forEach((items: any) => {
      const existing = totalDebitrow.get(items.category);
      totalDebitrow.set(
        items.category,
        existing ? existing.amount + items.amount : items.amount
      );
    });

  const spendingrow: SavingRow[] = [];

  totalDebitrow.forEach((value, key) => {
    const categoryBudget = passableObject.budgetOfLastMonth.categoryLimits;
    if (categoryBudget.find((i: any) => i.name === key)) {
      let index = categoryBudget.findIndex(key);
      let target = categoryBudget[index].limit;
      let actual = value;
      let difference = actual - target;

      let status =
        difference > 0 ? "Budget Goal Not Achieved ❌" : "Goal Achieved ✔️";

      let overshoot = (difference / target) * 100;
      spendingrow.push({
        category: key,
        target,
        actual,
        difference,
        overshoot_percent: overshoot,
        status: status,
      });
    }
  });

  analysisFromAi = JSON.parse(analysisFromAi);
  const income = analysisFromAi.income;
  const spending = analysisFromAi.spending;
  const spendingPatterns = analysisFromAi.patterns;
  const highlight = analysisFromAi.highlights;
  const nextMonthFocus = analysisFromAi.next_month_focus;

  // convert the timestamp into human-readable format

  const dateObject = new Date();
  const simpleFormat = dateObject.toDateString();
  console.log(simpleFormat);

  const data = {
    "MONTH_NAME": analysisFromAi.month_name,
    "USER_NAME": passableObject.userName,
    "CLOSING_BALANCE": passableObject.totalClosingBalance,

    "PRIMARY_INCOME_PERCENT": income?.primary_income_percent ?? 0,
    "INCOME_CHANGE_SIGN": income?.income_change_sign ?? "",
    "INCOME_CHANGE_PERCENT": income?.income_change_percent ?? 0,

    "INCOME_ROWS": incomeRows,

    "TOP_OVERSHOOT_CATEGORIES": spending?.alert_categories ?? [],
    "UNDER_BUDGET_CATEGORIES": spending?.under_budget_categories ?? [],

    "SPENDING_ROWS": spendingrow,

    "TOP_SPEND_CATEGORY": spendingPatterns?.top_spend_category ?? "",
    "REPEATED_OVERSHOOT_CATEGORY":
      spendingPatterns?.repeated_overshoot_category ?? "",
    "LOW_SPEND_CATEGORIES": spendingPatterns?.low_spend_categories ?? [],
    "TOP_SPEND_DAYS": spendingPatterns?.top_spend_days ?? [],

    "STRONG_SAVING_CATEGORY": spendingPatterns?.strong_saving_category ?? "",
    "SAVING_PATTERN_SUMMARY": spendingPatterns?.saving_pattern_summary ?? "",
    "CUT_FROM_CATEGORIES": spendingPatterns?.cut_from_categories ?? [],

    "HIGHLIGHTS": {
      "big_wins": highlight.big_wins ?? [],
      "needs_attention": highlight.needs_attention ?? [],
    },

    "TOP_OVERSHOOT_CATEGORIES_LIST": spendingPatterns?.top_spend_category ?? "",
    "GOOD_HABIT": highlight.good_habbit ?? [],
    "BAD_HABIT": highlight.bad_habbit ?? [],

    "TIPS": analysisFromAi?.tips ?? [],

    "NEXT_MONTH_THEME": nextMonthFocus?.theme ?? "",
    "NEXT_MONTH_GOAL": nextMonthFocus?.goal ?? "",
    "NEXT_MONTH_STEPS": nextMonthFocus?.steps ?? [],

    "generatedAt": simpleFormat,
  };

  // Data for html template
  return data;
};
