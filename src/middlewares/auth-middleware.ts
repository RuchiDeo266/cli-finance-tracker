import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const protect = (req: Request, res: Response, next: NextFunction) => {
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
      "accessTokenFinTracker"
    ) as jwt.JwtPayload;
    if (decode.userId) {
      req.userId = decode.userId as string;
    } else {
      return res.status(401).json({
        success: false,
        message: "Token payload missing user identifier.",
      });
    }
    next();
  } catch (error: any) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        code: "token_expired",
        message: "Access token has expired.",
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid access token.",
    });
  }
};
