import jwt from "jsonwebtoken";
import { refreshTokenModel } from "../models/tokens.ts";
import { logger } from "../logs/prod-app.ts";

const ACCESSS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "accessTokenFinTracker";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "refershTokenFinTracker";
const TEMPRORY_TOKEN_SECRET =
  process.env.TEMPRORY_TOKEN_SECRET || "temproryTokenSecret";

//generate tokens
const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, ACCESSS_TOKEN_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = async (userId: string) => {
  const expiryDate = new Date();
  expiryDate.setDate(expiryDate.getDate() + 10);

  const newRefreshToken = jwt.sign({ userId }, REFRESH_TOKEN_SECRET, {
    expiresIn: "10d",
  });

  await refreshTokenModel.findOneAndUpdate(
    { userId },
    {
      token: newRefreshToken,
      expiry: expiryDate,
      revoked: false,
      createdAt: new Date(),
    },
    { upsert: true, new: true } //create if not exists
  );

  return newRefreshToken;
};

// check tokens
const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESSS_TOKEN_SECRET);
};

const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
};

export {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
