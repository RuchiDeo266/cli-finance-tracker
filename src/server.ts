import express from "express";
import { pinoHttp } from "pino-http";
import connectDB from "./database.js";
import Expense from "./models/expense.ts";

import { logger } from "./logs/prod-app.ts";

import userRouter from "./routes/user-routes.ts";

import { errorHandler } from "./middlewares/errorHandlers.ts";

const app = express();

app.use(express.json());
app.use(pinoHttp({ logger }));

app.get("/fintrack", (req, res) => {
  logger.info("Info start");
  res.send("Hello from Fin-Tracker App");
});

// routes
app.use("/fintrack/api/userauth", userRouter);

app.post("/fintrack/add-expense", async (req, res) => {
  try {
    const { amount, type_of_expense, date } = req.body;

    const newExpense = new Expense({
      amount,
      type_of_expense,
      date,
    });

    await newExpense.save();

    logger.info("New expense added successfully.");
    res.status(201).send("Expense added!");
  } catch (error) {
    console.log("ERROR:", error);
    logger.error({ error }, "Failed to add a new expense.");
    res.status(500).send("Failed to add expense.");
  }
});

app.get("/fintrack/test-error", (req, res) => {
  throw new Error("This is a test error.");
});

app.use(errorHandler);

// port
const port = 4000;
const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
  });
};

startServer();
