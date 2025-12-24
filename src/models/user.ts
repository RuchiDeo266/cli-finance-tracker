import mongoose from "mongoose";
const userSchema = new mongoose.Schema({
  email: {
    type: "String",
    required: true,
    unique: true,
    lowercase: true,
  },
  username: {
    type: "String",
    required: true,
    unique: false,
  },
  password: {
    type: "String",
    required: true,
  },
  createdAt: {
    type: "Date",
    default: Date.now(),
  },
  updatedAt: {
    type: "Date",
    default: Date.now(),
  },
});

const User = mongoose.model("User", userSchema);

export default User;
