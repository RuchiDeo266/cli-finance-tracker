import path from "path";
import fs from "fs";

import { logger } from "../../../logs/prod-app.ts";
import { generateMonthlyDigest } from "../../../services/api-output.ts";
import { generatePdfData } from "../generate-pdf-data.ts";
import { renderHtml } from "../../../services/pdf/renderTemplate.ts";
import { htmlToPdfBuffer } from "../../../services/pdf/generatePdf.ts";
import { fileURLToPath } from "url";
import { sendPdfByEmail } from "../../../services/emailservices.ts";

export const sampleMonthlyDigest = async () => {
  // TODO: note this problem

  const fileName2 = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(fileName2);

  const budgetCSV = path.join(__dirname, "./budget.csv");
  const expenseCSV = path.join(__dirname, "./expense.csv");

  const budgetData = fs.readFileSync(budgetCSV, "utf-8");
  const expenseData = fs.readFileSync(expenseCSV, "utf-8");

  const budgetLines = budgetData.split("\n");
  const budgetHeaders = budgetLines[0].split(",");
  const budgetOfLastMonth = budgetLines.slice(1).map((line) => {
    const values = line.split(",");
    return budgetHeaders.reduce((obj, header, index) => {
      obj[header.trim()] = values[index]?.trim();
      return obj;
    }, {} as Record<string, string>);
  });

  const expenseLines = expenseData.split("\n");
  const expenseHeaders = expenseLines[0].split(",");
  const expenseOfLastMonth = expenseLines.slice(1).map((line) => {
    const values = line.split(",");
    return expenseHeaders.reduce((obj, header, index) => {
      obj[header.trim()] = values[index]?.trim();
      return obj;
    }, {} as Record<string, string>);
  });

  const passableObject = {
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

  // Generate the digest data to be sent to HTML template
  const digestData = await generatePdfData(passableObject, analysisFromAi);
  logger.info(digestData);
  // Render HTML and convert to PDF
  const html = renderHtml(digestData);
  const pdfBuffer = await htmlToPdfBuffer(html);

  // const fileName = `monthly-digest-0001-${
  //   new Date().toISOString().split("T")[0]
  // }.pdf`;
  // const filePath = path.join(__dirname, "../../../", fileName);

  // await fs.promises.writeFile(filePath, pdfBuffer);

  const toEmail = "ruchi4deo5@gmail.com";

  await sendPdfByEmail(
    toEmail,
    `Monthly Digest — ${digestData.MONTH_NAME}`,
    "Attached is your monthly digest.",
    pdfBuffer
  );
};
