import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.ts";
import {
  loginUser,
  registerUser,
  updateProfile,
} from "../controllers/user-controller.ts";
import { protect } from "../middlewares/auth-middleware.ts";
import { regerateToken } from "../controllers/token-regerenate-contorller.ts";
import {
  forgotPassword,
  updatePassword,
} from "../controllers/password-controller.ts";

const userRouter = Router();

// routes for the user : login , register, profile-update
userRouter.post("/register", asyncHandler(registerUser));
userRouter.post("/login", asyncHandler(loginUser));
userRouter.post("/forgot-password", asyncHandler(forgotPassword));
userRouter.post("/update-password", asyncHandler(updatePassword));

// protected
userRouter.put("/refresh", asyncHandler(regerateToken));
userRouter.put("/profile-upate", protect, asyncHandler(updateProfile));
userRouter.put("/reset-password", protect, asyncHandler(updatePassword));

export default userRouter;
