import { Request, Response } from "express";
import User from "../models/user.ts";
import { accessTokenModel } from "../models/accessToken.ts";
import { generateSixDigitsCode } from "../utils/random-code-generator.ts";

import bcrypt from "bcryptjs";
import { sendEmail } from "../services/emailservices.ts";
import { logger } from "../logs/prod-app.ts";

export const forgotPassword = async (req: Request, res: Response) => {
  const userEmail = req.body.email;
  if (!userEmail || typeof userEmail !== "string") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid or missing email address." });
  }

  try {
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return res.status(200).json({
        success: false,
        message: "Wrong credentials",
      });
    }
    const userId = user._id;

    await accessTokenModel.updateMany(
      { userId, type: "forgot-password", used: false },
      { $set: { used: true } }
    );

    const resetToken = generateSixDigitsCode();
    const SALT = 10; // TODO: move to env
    const hashedCode = await bcrypt.hash(resetToken.toString(), SALT);

    await accessTokenModel.create({
      userId,
      token: hashedCode,
      type: "forgot-password",
      expiry: new Date(Date.now() + 5 * 60 * 1000),
      used: false,
    });

    sendEmail(userEmail, "Your reset code", resetToken.toString());

    res.status(200).json({
      success: true,
      message: "A reset code has been sent to your email.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "An unexpected server error occurred.",
    });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  const { email: userEmail, code: resetCode, password: newPassword } = req.body;

  const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS || "10");

  if (!userEmail || !resetCode || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Missing email, code, or new password.",
    });
  }

  try {
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return res.status(200).json({
        success: true,
        message: "If the account exists, the password has been updated.",
      });
    }

    const userId = user._id;

    const tokenEntry = await accessTokenModel.findOne({
      userId: userId,
      type: "forgot-password", // Must be a reset token
      used: false, // Must not have been used
      expiry: { $gt: new Date() }, // Must not be expired
    });

    if (!tokenEntry) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token." });
    }

    const isResetCodeValid = await bcrypt.compare(resetCode, tokenEntry.token);

    if (!isResetCodeValid) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid reset code." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await User.updateOne({ _id: userId }, { password: hashedPassword });

    tokenEntry.used = true;
    await tokenEntry.save();

    res
      .status(200)
      .send({ success: true, message: "Password updated successfully!" });
  } catch (error: any) {
    logger.error("PASSWORD RESET FAILURE (Root Error):", error);

    return res.status(500).json({
      success: false,
      message: "An unexpected server error occurred during password reset.",
    });
  }
};
