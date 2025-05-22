import { Collection, ObjectId } from "mongodb";
import { getDB } from "../config/db.config";
import bcrypt from "bcrypt";
import type { User } from "../types/user.types";

export class UserModel {
  private collection: Collection<User>;

  constructor() {
    this.collection = getDB().collection<User>("users");
  }

  async getAll(): Promise<User[]> {
    return await this.collection.find().toArray();
  }

  async getUserTickets(id: string): Promise<any | null> {
    return await this.collection.find(
      { _id: new ObjectId(id) },
      { projection: { tickets: 1 } }
    ).toArray();
  }

  async getByID(id: string): Promise<User | null> {
    return await this.collection.findOne(
      { _id: new ObjectId(id) },
      { projection: { password: 0 } }
    );
  }

  async getByName(name: string): Promise<User | null> {
    return this.collection.findOne(
      { name: { $regex: new RegExp(name, "i") } },
      { projection: { password: 0 } }
    );
  }

  async getByEmail(email: string): Promise<User | null> {
    return this.collection.findOne({ email: email });
  }

  async getByUsername(name: string): Promise<User | null> {
    return this.collection.findOne(
      { username: { $regex: new RegExp(name, "i") } },
      { projection: { password: 0 } }
    );
  }

  async create(User: User): Promise<User | null> {
    const isEmailExist = await this.getByEmail(User.email);

    if (isEmailExist) {
      throw new Error("Email already exists");
    }

    const createdUser = {
      ...User,
      isVIP: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await this.collection.insertOne(createdUser);
    return { ...User, _id: result.insertedId };
  }

  async updateUserStatus(id: string): Promise<any | null> {
    const user = await this.getByID(id);

    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser = {
      ...user,
      isVIP: !user.isVIP,
    };

    const result = await this.collection.
      updateOne({ _id: new ObjectId(id) }, { $set: updatedUser });

    return result.modifiedCount > 0 ? {
      message: "User VIP status updated",
      user: updatedUser,
    } : null;
  }

  async updateUserTickets(userID: string, ticketID: string): Promise<boolean | null> {
    const user = await this.getByID(userID);

    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser = {
      ...user,
      tickets: user.tickets ? [...user.tickets, new ObjectId(ticketID)] : [new ObjectId(ticketID)],
    };

    const result = await this.collection.updateOne(
      { _id: new ObjectId(userID) },
      { $set: updatedUser }
    );

    return result.modifiedCount > 0;
  }

  async deleteUserTickets(userID: string, ticketID: string): Promise<boolean | null> {
    const user = await this.getByID(userID);

    if (!user) {
      throw new Error("User not found");
    }

    const updatedUser = {
      ...user,
      tickets: user.tickets ? user.tickets.filter((ticket) => ticket.toString() !== ticketID) : [],
    };

    const result = await this.collection.updateOne(
      { _id: new ObjectId(userID) },
      { $set: updatedUser }
    );

    return result.modifiedCount > 0;
  }

  async deleteAllUserTickets(id: string): Promise<any | null> {
    const user = await this.getByID(id);

    if (!user) {
      throw new Error("User not found");
    }

    const isUserHaveTickets = user.tickets && user.tickets.length > 0;

    if (!isUserHaveTickets) {
      throw new Error("User has no tickets");
    }

    const updatedUser = {
      ...user,
      tickets: [],
    };

    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedUser }
    );

    return result.modifiedCount > 0 ? {
      message: "All tickets for user deleted",
      deletedTicket: user.tickets?.length,
    } : null;
  }
}
