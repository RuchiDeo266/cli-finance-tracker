import jwt from "jsonwebtoken";

const ACCESSS_TOKEN_SECRET =
  process.env.ACCESS_TOKEN_SECRET || "accessTokenFinTracker";
const REFRESH_TOKEN_SECRET =
  process.env.REFRESH_TOKEN_SECRET || "refershTokenFinTracker";

//generate tokens
const generateAccessToken = (userId: string) => {
  return jwt.sign({ userId }, ACCESSS_TOKEN_SECRET, { expiresIn: "15m" });
};

const generateRefreshToken = (userId: string) => {
  return jwt.sign({ userId }, REFRESH_TOKEN_SECRET, { expiresIn: "10d" });
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
