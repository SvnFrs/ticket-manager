import mongoose, { Model } from "mongoose";
import bcrypt from "bcrypt";
import type { IUser } from "../schema/user.schema";
import userSchema from "../schema/user.schema";

const UserMongooseModel: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export class UserModel {
  private model: Model<IUser>;

  constructor() {
    this.model = UserMongooseModel;
  }

  async getAll(): Promise<IUser[]> {
    return await this.model.find().select("-password").exec();
  }

  async getUserTickets(id: string): Promise<any | null> {
    return await this.model
      .findById(id)
      .select("tickets")
      .populate("tickets")
      .exec();
  }

  async getByID(id: string): Promise<IUser | null> {
    return await this.model
      .findById(id)
      .select("-password")
      .exec();
  }

  async getByEmail(email: string): Promise<IUser | null> {
    return await this.model.findOne({ email }).select("-password").exec();
  }

  async getByEmailWithPassword(email: string): Promise<IUser | null> {
    return await this.model.findOne({ email }).exec();
  }

  async create(userData: Partial<IUser>): Promise<IUser | null> {
    const isEmailExist = await this.getByEmail(userData.email!);

    if (isEmailExist) {
      throw new Error("Email already exists");
    }

    // Hash password
    if (userData.password) {
      const saltRounds = 10;
      userData.password = await bcrypt.hash(userData.password, saltRounds);
    }

    const user = new this.model({
      ...userData,
      isVIP: false,
      isActive: true,
    });

    return await user.save();
  }

  async updateUserStatus(id: string): Promise<any | null> {
    const user = await this.model.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    user.isVIP = !user.isVIP;
    await user.save();

    return {
      message: "User VIP status updated",
      user: user.toObject({ transform: (_, ret) => { delete ret.password; return ret; } }),
    };
  }

  async updateLastLogin(id: string): Promise<boolean> {
    const result = await this.model.findByIdAndUpdate(
      id,
      { lastLogin: new Date() },
      { new: true }
    );
    return !!result;
  }

  async updateUserTickets(userID: string, ticketID: string): Promise<boolean | null> {
    const result = await this.model.findByIdAndUpdate(
      userID,
      { $addToSet: { tickets: ticketID } },
      { new: true }
    );

    return !!result;
  }

  async deleteUserTickets(userID: string, ticketID: string): Promise<boolean | null> {
    const result = await this.model.findByIdAndUpdate(
      userID,
      { $pull: { tickets: ticketID } },
      { new: true }
    );

    return !!result;
  }

  async deleteAllUserTickets(id: string): Promise<any | null> {
    const user = await this.model.findById(id);

    if (!user) {
      throw new Error("User not found");
    }

    const isUserHaveTickets = user.tickets && user.tickets.length > 0;

    if (!isUserHaveTickets) {
      throw new Error("User has no tickets");
    }

    const ticketCount = user.tickets?.length || 0;

    user.tickets = [];
    await user.save();

    return {
      message: "All tickets for user deleted",
      deletedTicket: ticketCount,
    };
  }
}
