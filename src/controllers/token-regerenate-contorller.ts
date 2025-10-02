import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { refreshTokenModel } from "../models/tokens.ts";
import {
  generateAccessToken,
  generateRefreshToken,
} from "../utils/jwt-tokens.ts";

export const regerateToken = async (req: Request, res: Response) => {
  const clientRefreshToken = req.body.refreshToken;
  if (!req.body.refreshToken) {
    return res.status(401).send({
      message: "refresh token not passed",
    });
  }

  let payload: jwt.JwtPayload;
  try {
    payload = jwt.verify(
      req.body.refreshToken,
      "refershTokenFinTracker"
    ) as jwt.JwtPayload;
  } catch (error: any) {
    const message =
      error.name === "TokenExpiredError"
        ? "Invalid or expired token signature."
        : "Invalid refresh token.";
    return res.status(401).send({
      success: false,
      message: message,
    });
  }

  const refreshTokenDb = await refreshTokenModel.findOne({
    token: clientRefreshToken,
  });

  if (!refreshTokenDb) {
    return {
      success: false,
      message: "Token doesn't exists",
    };
  }

  if (refreshTokenDb.expiry > new Date()) {
    return res.status(401).send({
      success: false,
      message: "Expired Refresh Token.",
    });
  }
  const userId = payload.userId;

  const newAccessToken = generateAccessToken(userId);
  const newRefreshToken = await generateRefreshToken(userId);

  return res.status(200).send({
    success: true,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
    message: "Tokens successfully refreshed.",
  });
};
