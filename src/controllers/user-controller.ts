import { Request, Response } from "express";
import User from "../models/user.ts";
import {
  AuthorizedRequest,
  UserLogin,
  UserRegistration,
} from "../config/types/userInterface.ts";
import bcrypt from "bcryptjs";
import { logger } from "../logs/prod-app.ts";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
} from "../utils/jwt-tokens.ts";

// Controller for user registration
export const registerUser = async (req: Request, res: Response) => {
  const requestBody: UserRegistration = req.body;

  // checks for each value
  if (!requestBody.email || !requestBody.username || !requestBody.password) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  // check the email of the user in the database
  const userExists = await User.findOne({ email: requestBody.email });

  if (userExists) {
    return res.status(401).json({
      success: false,
      isUserExists: true,
      message: `User already exists`,
    });
    // TODO : move to the login user
  }

  const salt = 10; // TODO :  move salt to env
  const genSalt = await bcrypt.genSalt(salt);
  const hashedPassword = await bcrypt.hash(requestBody.password, genSalt);

  // store hashed password
  const newUser = await User.create({
    email: requestBody.email,
    username: requestBody.username,
    password: hashedPassword,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  const userId = newUser?._id;

  res.status(201).json({
    success: true,
    message: "User registered successfully",
  });
};

// Controller for user login
export const loginUser = async (req: Request, res: Response) => {
  // Logic for user login and token generation
  //check for the user email and password
  const requestBody: UserLogin = req.body;

  // check the access token
  // const authHeader = req?.headers?.authorization;
  // if (!authHeader) {
  //   return res
  //     .status(401)
  //     .json({ success: false, message: "No token provided" });
  // }

  // checks for each value
  if (!requestBody.email || !requestBody.password) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  //check if user is present
  const userExists = await User.findOne({ email: requestBody.email });
  if (!userExists) {
    return res.status(401).json({
      success: false,
      isUserExists: false,
      message: "Invalid Credentials",
    });
  }

  // check password
  const comparePassword = await bcrypt.compare(
    requestBody.password,
    userExists.password
  );

  if (!comparePassword) {
    return res
      .status(401)
      .json({ success: false, message: "unauthorised access" });
  }

  // generate tokens
  const userId = userExists._id;
  const accesstoken = generateAccessToken(userId.toString());
  const refreshtoken = await generateRefreshToken(userId.toString());

  res.status(200).json({
    message: "User logged in successfully",
    refreshtoken,
    accesstoken,
  });
};

// Controller for updating a user's profile (protected)
export const updateProfile = async (req: Request, res: Response) => {
  const username = req.body.newusername;
  const userId = req.body.user_id; // TODO : change how the things are taken here

  if (!userId) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized access." });
  }

  if (!username && typeof username !== "string" && username.length < 3) {
    return;
    res.status(400).json({
      success: false,
      message: "Username must be string and at least more than 3 characters",
    });
  }

  try {
    const result = await User.updateOne(
      { _id: userId },
      { username: username }
    );

    if (result.modifiedCount == 0 && result.matchedCount === 1) {
      return res.status(200).json({
        success: true,
        message:
          "Profile updated successfully (no changes applied as username was already set).",
      });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully!",
    });
  } catch (error) {
    logger.error("Profile update failed:");
    res.status(500).json({
      success: false,
      message: "An internal server error occurred while updating the profile.",
    });
  }
};
