import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { logger } from "../logs/prod-app.ts";

const ACCESS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "accessTokenFinTracker";

interface AccessTokenPayload extends jwt.JwtPayload {
  userId: string;
}

interface CustomRequest extends Request {
  userId?: string;
}

export const protect = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  // check the beared token , verify the user and allow the access to update the user.
  // get the accesstoken
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Access token missing or invalid format.",
    });
  }

  const accessToken = authHeader.split(" ")[1];

  try {
    const decode = jwt.verify(
      accessToken,
      ACCESS_TOKEN_SECRET
    ) as AccessTokenPayload;

    logger.debug?.(`Decoded access token payload: ${JSON.stringify(decode)}`);

    if (decode.userId) {
      req.userId = decode.userId;
    } else {
      return res.status(401).json({
        success: false,
        message: "Token payload missing user identifier.",
      });
    }

    return next();
  } catch (error: any) {
    if (error && error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        code: "token_expired",
        message: "Access token has expired.",
      });
    }
    logger.error?.("Access token verification failed", error);
    return res.status(401).json({
      success: false,
      message: "Invalid access token.",
    });
  }
};
