import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.ts";
import {
  loginUser,
  registerUser,
  updateProfile,
} from "../controllers/auth/user-controller.ts";
import { protect } from "../middlewares/auth-middleware.ts";
import { regerateToken } from "../controllers/auth/token-regerenate-contorller.ts";
import {
  forgotPassword,
  updatePassword,
} from "../controllers/auth/password-controller.ts";

const userRouter = Router();

// routes for the user : login , register, profile-update
userRouter.post("/register", asyncHandler(registerUser));
userRouter.post("/login", asyncHandler(loginUser));
userRouter.post("/forgot-password", asyncHandler(forgotPassword));
userRouter.post("/update-password", asyncHandler(updatePassword));

// protected
userRouter.put("/refresh", asyncHandler(regerateToken));
userRouter.put("/profile-update", protect, asyncHandler(updateProfile));
// TODO : Controller for reset password
// userRouter.put("/reset-password", protect, asyncHandler(updatePassword));

export default userRouter;
