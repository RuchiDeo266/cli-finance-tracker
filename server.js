import express from "express";
import pino from "pino";
import pinoHttp from "pino-http";
import connectDB from "./database.js";
import Expense from "./models/expense.js";

export const logger = pino();

const app = express();

app.use(express.json());
// use pino-http middleware
// every request will log automatically.
app.use(pinoHttp({ logger }));

app.get("/", (req, res) => {
  res.send("Hello from Fin-Tracker App");
});

app.post("/add-expense", async (req, res) => {
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

// port
const port = 3000;
const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    logger.info(`Server is running on http://localhost:${port}`);
  });
};

startServer();
