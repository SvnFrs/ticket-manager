import type { ObjectId } from "mongoose";

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  password?: string; // Made optional for responses
  phone: string;
  role?: string;
  tickets?: ObjectId[];
  isVIP?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
