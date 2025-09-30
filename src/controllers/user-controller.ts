import { Request, Response } from "express";
import User from "../models/user.ts";
import {
  UserLogin,
  UserRegistration,
} from "../config/interfaces/userInterface.ts";
import bcrypt from "bcryptjs";
import { logger } from "../logs/prod-app.ts";

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
  await User.insertOne({
    email: requestBody.email,
    username: requestBody.username,
    password: hashedPassword,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  });

  // generate the tokens
  // call functions that generates the access token and refresh token

  res.status(201).json({ message: "User registered successfully" });
};

// Controller for user login
export const loginUser = async (req: Request, res: Response) => {
  // Logic for user login and token generation
  //check for the user email and password
  const requestBody: UserLogin = req.body;

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

  res.status(200).json({ message: "User logged in successfully" });
};

// Controller for forgot password
export const forgotPassword = async (req: Request, res: Response) => {
  // Logic for handling a "forgot password" request
  res.status(200).json({ message: "Password reset link sent to email" });
};

// Controller for updating a user's profile (protected)
export const updateProfile = async (req: Request, res: Response) => {
  // Logic to update user profile information
  res.status(200).json({ message: "Profile updated successfully" });
};
