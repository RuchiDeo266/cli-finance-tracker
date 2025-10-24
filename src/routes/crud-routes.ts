import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.ts";
import {
  budgetByCategoryLimitUpdate,
  setBudget,
} from "../controllers/expense/budget-controller.ts";
import { addExpense } from "../controllers/add-expense-controller.ts";
import { setInitialDeposit } from "../controllers/expense/initial-deposit-controller.ts";
import { handleInitialDeposit } from "../controllers/expense/update-initalamount-controller.ts";
import { showExpenses } from "../controllers/show-expense-controller.ts";
import { updateExpense } from "../controllers/expense/update-expense-controller.ts";

const operation = Router();

// initial amount and budget
operation.post("/setup/intialamount", asyncHandler(setInitialDeposit));
operation.post("/setup/budget", asyncHandler(setBudget)); // everymonth and on-demand
operation.post("/update/intial-amount", asyncHandler(handleInitialDeposit));
operation.post(
  "/update/budget/category",
  asyncHandler(budgetByCategoryLimitUpdate)
); // update the category limits

// CRUD - operations
operation.post("/add-expense", asyncHandler(addExpense));

operation.get("/get-expenses", asyncHandler(showExpenses));

operation.patch(`/update/expense`, asyncHandler(updateExpense)); // update only category and amount

operation.delete("/delete/:expenseId");
