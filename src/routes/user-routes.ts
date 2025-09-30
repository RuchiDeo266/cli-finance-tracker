import { Router } from "express";
import { asyncHandler } from "../utils/async-handler.ts";
import {
  forgotPassword,
  loginUser,
  registerUser,
  updateProfile,
} from "../controllers/user-controller.ts";

import { protect } from "../middlewares/auth-middleware.ts";
// routes for the user : login , register, profile-update

const userRouter = Router();

userRouter.post("/register", asyncHandler(registerUser));
userRouter.post("/login", asyncHandler(loginUser));
userRouter.post("/forgot-password", asyncHandler(forgotPassword));

// protected
userRouter.put("/profile-upate", protect, asyncHandler(updateProfile));

export default userRouter;
