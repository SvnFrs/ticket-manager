import { Schema, type Document, type ObjectId } from "mongoose";

export enum TicketStatus {
  AVAILABLE = "Available",
  BOOKED = "Booked",
  CANCELLED = "Cancelled"
}

export interface ITicket extends Document {
  movieTitle: string;
  cinema: string;
  showTime: Date;
  seatNumber: string;
  price: number;
  status: TicketStatus;
  bookedBy?: ObjectId;
  bookedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ticketSchema = new Schema<ITicket>(
  {
    movieTitle: { type: String, required: true },
    cinema: { type: String, required: true },
    showTime: { type: Date, required: true },
    seatNumber: { type: String, required: true },
    price: { type: Number, required: true },
    status: {
      type: String,
      enum: Object.values(TicketStatus),
      default: TicketStatus.AVAILABLE
    },
    bookedBy: { type: Schema.Types.ObjectId, ref: "User" },
    bookedAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better performance
ticketSchema.index({ movieTitle: 1, cinema: 1, showTime: 1 });
ticketSchema.index({ seatNumber: 1, cinema: 1, showTime: 1 }, { unique: true });
ticketSchema.index({ status: 1 });
ticketSchema.index({ bookedBy: 1 });

export default ticketSchema;
