import type { ObjectId } from "mongoose";

export interface Ticket {
  _id?: ObjectId;
  movieTitle: string;
  cinema: string;
  showTime: string | Date;
  seatNumber: string;
  price: number;
  createdAt?: Date;
  updatedAt?: Date;
}
