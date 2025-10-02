import mongoose from "mongoose";

const accessToken = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
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
// access token for the reset purpose y
export const accessTokenModel = mongoose.model("AccessToken", accessToken);
