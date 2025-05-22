import type { ObjectId } from "mongodb";

export interface User {
  _id?: ObjectId;
  name: string;
  email: string;
  phone: string;
  tickets?: ObjectId[];
  isVIP?: boolean;
  createdAt: Date;
  updatedAt: Date;
}
