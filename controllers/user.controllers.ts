import type { Request, Response } from "express";
import { UserModel } from "../models/user.models";
import type { User } from "../types/user.types";

const userModel = new UserModel();

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await userModel.getAll();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error });
  }
};

export const getUserTickets = async (req: Request, res: Response) => {
  try {
    const id = req.params.id || "";
    const tickets = await userModel.getUserTickets(id);

    if (!tickets) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user tickets", error });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id || "";
    const user = await userModel.getByID(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
};

export const getUserByName = async (req: Request, res: Response) => {
  try {
    const name = req.params.name || "";
    const user = await userModel.getByName(name);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
}

export const createUser = async (req: Request, res: Response) => {
  try {
    const user: User = req.body;
    const newUser = await userModel.create(user);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "Error creating user", error });
  }
};

export const updateUserStatus = async (req: Request, res: Response) => {
  try {
    const id = req.params.id || "";

    const user = await userModel.updateUserStatus(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

export const updateUserTickets = async (req: Request, res: Response) => {
  try {
    const userID = req.params.userID || "";
    const ticketID = req.params.ticketID || "";

    const user = await userModel.updateUserTickets(userID, ticketID);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
}

export const deleteAllUserTickets = async (req: Request, res: Response) => {
  try {
    const id = req.params.id || "";
    const result = await userModel.deleteAllUserTickets(id);

    if (!result) {
      return res.status(404).json({ message: "Failed to delete user tickets" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};
