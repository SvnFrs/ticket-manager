import type { Request, Response } from "express";
import { TicketModel } from "../models/ticket.models";
import type { ITicket } from "../schema/ticket.schema";
import type { AuthenticatedRequest } from "../middleware/auth.middleware";

const ticketModel = new TicketModel();

export const getTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await ticketModel.getAll();
    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving tickets", error });
  }
};

export const getAvailableTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await ticketModel.getAvailableTickets();

    if (!tickets || tickets.length === 0) {
      return res.status(404).json({ message: "No available tickets found" });
    }

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving available tickets", error });
  }
};

export const getUserTickets = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.params.userId;
    const tickets = await ticketModel.getUserTickets(userId);

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user tickets", error });
  }
};

export const createTicket = async (req: Request, res: Response) => {
  try {
    const ticketData: Partial<ITicket> = req.body;
    const newTicket = await ticketModel.create(ticketData);
    res.status(201).json(newTicket);
  } catch (error) {
    res.status(500).json({ message: "Error creating ticket", error });
  }
};

export const bookTicket = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { ticketId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "User authentication required" });
    }

    const result = await ticketModel.bookTicket(ticketId, userId);

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    res.json({
      message: result.message,
      ticket: result.ticket
    });
  } catch (error) {
    res.status(500).json({ message: "Error booking ticket", error });
  }
};

export const cancelTicket = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const ticketId = req.params.id;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ message: "User authentication required" });
    }

    if (!ticketId) {
      return res.status(400).json({ message: "Ticket ID is required" });
    }

    const result = await ticketModel.cancelTicket(ticketId, userId);

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    res.json({ message: result.message });
  } catch (error) {
    res.status(500).json({ message: "Error cancelling ticket", error });
  }
};
