import path from "path";
import fs from "fs";

import User from "../../models/user.ts";
import { error } from "node:console";
import ExpenseModel, { amountTypeEnum } from "../../models/expense-model.ts";
import BudgetModel from "../../models/budget-model.ts";
import { IBudget, IExpense } from "../../config/types/expenseInterface.ts";
import { Document } from "mongoose";
import { generateMonthlyDigest } from "../../services/api-output.ts";
import { logger } from "../../logs/prod-app.ts";
import { sendEmail, sendPdfByEmail } from "../../services/emailservices.ts";
import { generatePdfData } from "./generate-pdf-data.ts";
import { renderHtml } from "../../services/pdf/renderTemplate.ts";
import { htmlToPdfBuffer } from "../../services/pdf/generatePdf.ts";

export interface PassableObj {
  userName: string;
  expenseOfLastMonth: (Document & IExpense)[];
  budgetOfLastMonth: Document & IBudget;
  totalClosingBalance: number;
}

const getHashMapCategories = (
  hashMap: { key: string; value: number }[],
  key: string,
  value: number
): { key: string; value: number }[] => {
  const entry = hashMap.find((item) => item.key === key);
  if (entry) {
    entry.value += value;
  } else {
    hashMap.push({ key, value });
  }
  return hashMap;
};

export async function monthlyDigest(userId: string) {
  // get a user
  const userData = await User.findOne({ userId });
  if (!userData) {
    throw error("User data not found");
  }

  const id = userData.id;
  const userEmail = userData.email;
  // get the budget of last month

  const now = new Date();

  const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

  const endOfLastMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    0,
    23,
    59,
    59
  );

  // TODO:check if the pdf already exits in Bucket using monngodb
  // TODO: get the pdf from the bucket
  // TODO: Send mail

  const expenseOfLastMonth = await ExpenseModel.find({
    userId: id,
    data: { $gte: startOfLastMonth, $lte: endOfLastMonth },
  });

  if (!expenseOfLastMonth) {
    throw error("404 : Data not found");
  }

  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();

  // get the budget of last month
  const budgetOfLastMonth = await BudgetModel.findOne({
    userId,
    month: currentMonth === 1 ? 12 : currentMonth,
    year: currentMonth === 1 ? currentYear - 1 : currentYear,
  });

  if (!budgetOfLastMonth) {
    throw error("Data not found");
  }

  // Initial Deposite of last month
  const initialDepo = expenseOfLastMonth.filter((list) => {
    if (list.transactionType === amountTypeEnum[2] && list.isCurrent === true)
      return list.amount;
  });

  if (!initialDepo[0]) {
    throw error("Not found");
  }

  // get the total current amount = (initial + credit) - (debit + investment)
  let value: number = initialDepo[0].amount;

  expenseOfLastMonth.forEach((list) => {
    if (
      list.transactionType === amountTypeEnum[0] ||
      list.transactionType === amountTypeEnum[3]
    ) {
      value -= list.amount;
    }
    if (list.transactionType === amountTypeEnum[1]) {
      value += list.amount;
    }
  });

  const passableObject: PassableObj = {
    userName: "Rob",
    totalClosingBalance: 9012,
    expenseOfLastMonth: expenseOfLastMonth,
    budgetOfLastMonth: budgetOfLastMonth,
  };

  let analysisFromAi;
  try {
    analysisFromAi = await generateMonthlyDigest(passableObject);
  } catch (error: any) {
    logger.error("Error in AI api", error);
    throw error;
  }

  // generate the digest data to be send to HTML template
  const digestData = await generatePdfData(passableObject, analysisFromAi);

  // Render HTML and convert to PDF
  const html = renderHtml(digestData);
  const pdfBuffer = await htmlToPdfBuffer(html);

  // TODO: Save the pdf in bucket
  // TODO: Save the reference in the mongodb
  // const fileName = `monthly-digest-${userId}-${
  //   new Date().toISOString().split("T")[0]
  // }.pdf`;
  // const filePath = path.join(__dirname, "../../../", fileName);
  // fs.writeFileSync(filePath, pdfBuffer);

  const toEmail = userEmail;

  await sendPdfByEmail(
    toEmail,
    `Monthly Digest — ${digestData.MONTH_NAME}`,
    "Attached is your monthly digest.",
    pdfBuffer
  );
  return { ok: true, message: "Email sent" };
}
