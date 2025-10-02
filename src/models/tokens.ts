import mongoose from "mongoose";

const refreshToken = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
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

export const refreshTokenModel = mongoose.model("RefreshToken", refreshToken);
