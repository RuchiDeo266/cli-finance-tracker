import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.ts";
import { setBudget } from "../controllers/expense/budget-controller.ts";
import { addExpense } from "../controllers/expense/add-expense-controller.ts";
import { setInitialDeposit } from "../controllers/expense/initial-deposit-controller.ts";
import { handleInitialDeposit } from "../controllers/expense/update-initalamount-controller.ts";
import { showExpenses } from "../controllers/expense/show-expense-controller.ts";
import { updateExpense } from "../controllers/expense/update-expense-controller.ts";
import { protect } from "../middlewares/auth-middleware.ts";
import { deleteExpense } from "../controllers/expense/delete-expense-controller.ts";
import { monthlyDigestProvider } from "../controllers/expense/monthly-digest-provider.ts";

const operation = Router();

// initial amount and budget
operation.post(
  "/setup/initial-amount",
  protect,
  asyncHandler(setInitialDeposit)
);
operation.post("/setup/budget", protect, asyncHandler(setBudget)); // everymonth and on-demand
operation.post(
  "/update/intial-amount",
  protect,
  asyncHandler(handleInitialDeposit)
);

operation.patch(`/update/expense-update`, protect, asyncHandler(updateExpense)); // update only category and amount

// TODO : make the budget category editables
// operation.post(
//   "/update/budget/category",
//   protect,
//   asyncHandler(budgetByCategoryLimitUpdate)
// ); // update the category limits

// CRUD - operations
operation.post("/add-expense", protect, asyncHandler(addExpense));

operation.get("/get-expenses", protect, asyncHandler(showExpenses));
operation.get(
  "/monthly-digest-pdf",
  protect,
  asyncHandler(monthlyDigestProvider)
);

operation.delete("/delete", protect, asyncHandler(deleteExpense));
// takes only one expenseID

export default operation;
