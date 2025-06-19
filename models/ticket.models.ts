import mongoose, { Model } from "mongoose";
import type { ITicket } from "../schema/ticket.schema";
import { TicketStatus } from "../schema/ticket.schema";
import ticketSchema from "../schema/ticket.schema";
import { UserModel } from "./user.models";

const TicketMongooseModel: Model<ITicket> = mongoose.model<ITicket>("Ticket", ticketSchema);

export class TicketModel {
  private model: Model<ITicket>;
  private userModel: UserModel;

  constructor() {
    this.model = TicketMongooseModel;
    this.userModel = new UserModel();
  }

  async getAll(): Promise<ITicket[]> {
    return await this.model.find().populate("bookedBy", "name email").exec();
  }

  async getAvailableTickets(): Promise<ITicket[]> {
    return await this.model.find({ status: TicketStatus.AVAILABLE }).exec();
  }

  async getUserTickets(userId: string): Promise<ITicket[]> {
    return await this.model.find({ bookedBy: userId }).exec();
  }

  async getByID(id: string): Promise<ITicket | null> {
    return await this.model.findById(id).populate("bookedBy", "name email").exec();
  }

  async create(ticketData: Partial<ITicket>): Promise<ITicket> {
    const ticket = new this.model({
      ...ticketData,
      status: TicketStatus.AVAILABLE
    });
    return await ticket.save();
  }

  // Simplified booking without transactions for development
  async bookTicket(ticketId: string, userId: string): Promise<{ success: boolean; message: string; ticket?: ITicket }> {
    try {
      // Check if ticket exists and is available
      const ticket = await this.model.findById(ticketId);
      if (!ticket) {
        return { success: false, message: "Ticket not found" };
      }

      if (ticket.status !== TicketStatus.AVAILABLE) {
        return { success: false, message: "Ticket is not available" };
      }

      // Update ticket
      ticket.status = TicketStatus.BOOKED;
      ticket.bookedBy = new mongoose.Types.ObjectId(userId);
      ticket.bookedAt = new Date();
      await ticket.save();

      // Update user's tickets array
      const userUpdateResult = await this.userModel.updateUserTickets(userId, ticketId);

      if (!userUpdateResult) {
        // Rollback ticket status if user update fails
        ticket.status = TicketStatus.AVAILABLE;
        ticket.bookedBy = undefined;
        ticket.bookedAt = undefined;
        await ticket.save();
        return { success: false, message: "Failed to update user tickets" };
      }

      return {
        success: true,
        message: "Ticket booked successfully",
        ticket: await this.getByID(ticketId)
      };
    } catch (error) {
      console.error("Error booking ticket:", error);
      throw error;
    }
  }

  // Simplified cancellation without transactions
  async cancelTicket(ticketId: string, userId: string): Promise<{ success: boolean; message: string }> {
    try {
      const ticket = await this.model.findById(ticketId);
      if (!ticket) {
        return { success: false, message: "Ticket not found" };
      }

      if (ticket.status !== TicketStatus.BOOKED) {
        return { success: false, message: "Ticket is not booked" };
      }

      if (ticket.bookedBy?.toString() !== userId) {
        return { success: false, message: "You can only cancel your own tickets" };
      }

      // Update ticket
      ticket.status = TicketStatus.AVAILABLE;
      ticket.bookedBy = undefined;
      ticket.bookedAt = undefined;
      await ticket.save();

      // Remove from user's tickets array
      await this.userModel.deleteUserTickets(userId, ticketId);

      return { success: true, message: "Ticket cancelled successfully" };
    } catch (error) {
      console.error("Error cancelling ticket:", error);
      throw error;
    }
  }

  async update(id: string, ticketData: Partial<ITicket>): Promise<boolean> {
    const result = await this.model.findByIdAndUpdate(
      id,
      ticketData,
      { new: true }
    );
    return !!result;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndDelete(id);
    return !!result;
  }
}
