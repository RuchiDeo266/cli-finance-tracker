import nodemailer from "nodemailer";
import { logger } from "../logs/prod-app.ts";
// import { env } from "../config/env.ts";

const createTestTransporter = () => {
  logger.info("Configuring Nodemailer for DEV (Mailtrap)...");

  if (!process.env.MAILTRAP_USER || !process.env.MAILTRAP_PASS) {
    throw new Error("Mailtrap credentials missing in environment variables");
  }
  return nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST || "sandbox.smtp.mailtrap.io",
    port: parseInt(String(process.env.MAILTRAP_PORT) || "587"),
    auth: {
      user: process.env.MAILTRAP_USER,
      pass: process.env.MAILTRAP_PASS,
    },
  });
};

export const sendEmail = async (
  toEmail: string,
  subject: string,
  htmlBody: string
) => {
  const transporter = createTestTransporter();
  logger.info(`details : ${toEmail}, ${subject} , ${htmlBody}`);
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: subject,
    html: htmlBody,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(
      `[MAILTRAP] Message sent: ${info.messageId}. Check your Mailtrap inbox.`
    );
    return true;
  } catch (error: any) {
    logger.error("MAILTRAP ERROR: Failed to send test email.", error);
    return false;
  }
};

export const sendPdfByEmail = async (
  toEmail: string,
  subject: string,
  htmlBody: string,
  pdfBuffer: Buffer,
  filename = "digest.pdf"
) => {
  const transporter = createTestTransporter();
  logger.info(`details of digest email : ${toEmail}, ${subject} , ${htmlBody}`);
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: subject,
    html: htmlBody,
    attachments: [
      { filename, content: pdfBuffer, contentType: "application/pdf" },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    logger.info(
      `[MAILTRAP] PDF sent: ${info.messageId}. Check your Mailtrap inbox.`
    );
    return true;
  } catch (error: any) {
    logger.error(
      "MAILTRAP ERROR: Failed to send test email for digest.",
      error
    );
    return false;
  }
};
