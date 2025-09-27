import mongoose from "mongoose";
import { ref } from "process";
import Expense from "./expense.ts";
import { create } from "domain";

import User from "./user.ts";

const refreshToken = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: User,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  revoked: { type: Boolean, default: false },
});

const refreshTokenModel = mongoose.model("RefreshToken", refreshToken);

const accessToken = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: User,
    required: true,
  }, // reference to User
  token: {
    type: String,
    required: true,
  }, // random string or JWT
  type: {
    type: String,
    enum: ["forgot-password", "email-verify"],
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
  used: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const accessTokenModel = mongoose.model("AccessToken", accessToken);

export { refreshTokenModel, accessTokenModel };
