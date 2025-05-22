import type { ObjectId } from "mongodb";

export interface Ticket {
  _id?: ObjectId;
  movieTitle: string;
  cinema: string;
  showTime: string;
  seatNumber: string;
  price: number;
  createdAt: Date;
  updatedAt: Date;
}
