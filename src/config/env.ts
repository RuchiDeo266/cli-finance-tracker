import dotenv from "dotenv";
dotenv.config();
export const env = {
  port: process.env.PORT || "5000",
  mongoUri: process.env.MONGO_URI!,
  jwtSecret: process.env.JWT_SECRET!,
  refreshSecret: process.env.REFRESH_SECRET!,
  emailUser: process.env.EMAIL_USER!,
  emailPass: process.env.EMAIL_PASS!,
  frontendUrl: process.env.FRONTEND_URL!,

  emailForm: process.env.EMAIL_FROM,
  mailHost: process.env.MAILTRAP_HOST,
  mailPort: process.env.MAILTRAP_PORT,
  mailPass: process.env.MAILTRAP_PASS,
  mailUser: process.env.MAILTRAP_USER,
};
