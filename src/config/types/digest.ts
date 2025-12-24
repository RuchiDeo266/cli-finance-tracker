// src/types/digest.ts
export interface IncomeRow {
  source: string;
  amount: number;
  notes?: string;
}
export interface SavingRow {
  category: string;
  target: number;
  actual: number;
  difference?: number;
  overshoot_percent?: number;
  status?: string;
}
// export interface SpendingRow {
//   category: string;
//   budget: number;
//   spent: number;
//   diff?: number;
//   overshoot_percent?: number;
// }
export interface DigestParams {
  MONTH_NAME: string;
  USER_NAME: string;
  CLOSING_BALANCE: number;

  // Income (both single placeholders and array)
  INCOME_SALARY?: number;
  INCOME_SALARY_PERCENT?: number;
  INCOME_SIDE?: number;
  INCOME_SIDE_PERCENT?: number;
  PRIMARY_INCOME_PERCENT?: number;
  INCOME_CHANGE_SIGN?: string; // "increased" | "decreased" | "same"
  INCOME_CHANGE_PERCENT?: number;

  INCOME_ROWS?: IncomeRow[];

  TOP_OVERSHOOT_CATEGORIES?: string[];
  UNDER_BUDGET_CATEGORIES?: string[];

  // SPENDING_ROWS?: SpendingRow[];

  // Patterns & behaviours
  TOP_SPEND_CATEGORY?: string;
  REPEATED_OVERSHOOT_CATEGORY?: string;
  LOW_SPEND_CATEGORIES?: string[];
  TOP_SPEND_DAYS?: string;

  STRONG_SAVING_CATEGORY?: string;
  SAVING_PATTERN_SUMMARY?: string;
  CUT_FROM_CATEGORIES?: string[];

  HIGHLIGHTS?: {
    big_wins: string[];
    needs_attention: string[];
  };

  TOP_OVERSHOOT_CATEGORIES_LIST?: string[]; // for programmatic rendering
  GOOD_HABIT?: string[];
  BAD_HABIT?: string[];

  TIPS?: string[];

  // Next month focus
  NEXT_MONTH_THEME?: string;
  NEXT_MONTH_GOAL?: string;

  NEXT_MONTH_STEPS?: string[];

  // meta
  generatedAt?: string;
}
