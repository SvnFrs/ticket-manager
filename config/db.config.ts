import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGO_URI || "";

export const connectDB = async (): Promise<void> => {
  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB with Mongoose");
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    process.exit(1);
  }
};

export const closeDB = async (): Promise<void> => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed");
};

// Get the mongoose connection
export const getDB = () => {
  return mongoose.connection.db;
};
