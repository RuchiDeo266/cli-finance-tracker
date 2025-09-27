import mongoose from "mongoose";
import { logger } from "./logs/prod-app.ts";

const dburl = `mongodb+srv://ruchi4deo5_db_user:Peropeko%40123@fintrack1.grb8fq7.mongodb.net/fin-tracker-db`;

const connectDB = async () => {
  try {
    await mongoose.connect(dburl);
  } catch (err) {
    logger.error({ error: err.message }, "MongoDB connection error.");
    process.exit(1);
  }
};

mongoose.connection.on("connected", () => {
  logger.info("MongoDB Connected SuccessFully!!");
});

mongoose.connection.on("disconnected", () => {
  logger.info("MongoDb disconnected");
});

export default connectDB;
