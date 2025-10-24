import { logger } from "../logs/prod-app.ts";
import CategoryModel from "../models/category-model.ts";

const initialCategories = [
  // --- Expense (Debit) Categories ---
  { name: "Food & Dining", type: "Expense" },
  { name: "Rent & Mortgage", type: "Expense" },
  { name: "Transportation", type: "Expense" },
  { name: "Utilities", type: "Expense" },
  { name: "Entertainment", type: "Expense" },
  { name: "Investments", type: "Expense" },
  { name: "Loan/Credit cars", type: "Expense" },
  { name: "Luxury/Clothing", type: "Expense" },
  { name: "Beauty", type: "Expense" },
  { name: "Vacation/Fun time", type: "Expense" },
  { name: "Subscriptions", type: "Expense" },
  { name: "Other Expenses", type: "Expense" },

  // --- Income (Credit) Categories ---
  { name: "Salary", type: "Income" },
  { name: "Freelance/Gigs", type: "Income" },
  { name: "Investment Returns", type: "Income" },
  { name: "Gift/Winnings", type: "Income" },
  { name: "Reimbursement", type: "Income" },

  { name: "Setup", type: "InitialDeposit" },
];

export const seedCategories = async () => {
  // verify the imported model resolved and expose expected API
  try {
    const documents = await CategoryModel.countDocuments();
    if (documents === 0) {
      CategoryModel.insertMany(initialCategories);
    } else {
      logger.info("Categories already exists");
    }
  } catch (error: any) {
    logger.error(error);
  }
};
