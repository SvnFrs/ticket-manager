import type { Request, Response } from "express";
import type { User } from "../types/user.types";
import { TicketModel } from "../models/ticket.models";
import type { Ticket } from "../types/ticket.types";

const ticketModel = new TicketModel();

export const getTickets = async (req: Request, res: Response) => {
  try {
    const users = await ticketModel.getAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error });
  }
};

export const getUnbookedTickets = async (req: Request, res: Response) => {
  try {
    const tickets = await ticketModel.getUnbookedTickets();

    if (!tickets) {
      return res.status(404).json({ message: "No unbooked tickets found" });
    }

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving unbooked tickets", error });
  }
}

export const createTicket = async (req: Request, res: Response) => {
  try {
    const ticket: Ticket = req.body;
    const newUser = await ticketModel.create(ticket);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating ticket", error });
  }
};
