import nodemailer from "nodemailer";
import { logger } from "../logs/prod-app.ts";
import { env } from "../config/env.ts";

const createTestTransporter = () => {
  logger.info("Configuring Nodemailer for DEV (Mailtrap)...");
  return nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: env.mailUser,
      pass: env.mailPass,
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
    from: env.emailForm,
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
