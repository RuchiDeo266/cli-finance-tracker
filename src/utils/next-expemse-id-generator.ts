import mongoose from "mongoose";
import CounterModel from "../models/counter-model.ts";

export async function generateNextExpenseId(
  session: mongoose.ClientSession,
  userId: string
): Promise<String> {
  const expenseId = "";

  const counter = await CounterModel.findOneAndUpdate(
    { userId: userId },
    { $inc: { sequence_value: 1 } },
    {
      new: true,
      upsert: true,
      session: session,
    }
  );

  if (!counter || counter.sequence_value === undefined) {
    throw new Error("Counter sequence value could not be generated.");
  }

  const newNumber = counter.sequence_value;

  const paddedNumber = String(newNumber).padStart(5, "0");

  return `Fin${paddedNumber}`;
}
