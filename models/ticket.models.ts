import { Collection, ObjectId } from "mongodb";
import { getDB } from "../config/db.config";
import type { Ticket } from "../types/ticket.types";

export class TicketModel {
  private collection: Collection<Ticket>;

  constructor() {
    this.collection = getDB().collection<Ticket>("tickets");
  }

  async getAll(): Promise<Ticket[]> {
    return await this.collection.find().toArray();
  }

  async getUnbookedTickets(): Promise<any[]> {
    const unbookedTickets = await this.collection.aggregate([
      {
        $lookup: {
          from: "users",
          let: { ticketId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $in: ["$$ticketId", { $ifNull: ["$tickets", []] }]
                }
              }
            }
          ],
          as: "bookedBy"
        }
      },
      {
        $match: {
          bookedBy: { $size: 0 }
        }
      }
    ]).toArray();

    return unbookedTickets;
  }

  async getByID(id: string): Promise<Ticket | null> {
    return await this.collection.findOne({ _id: new ObjectId(id) });
  }

  async create(Ticket: Ticket): Promise<Ticket> {
    const result = await this.collection.insertOne(Ticket);
    return { ...Ticket, _id: result.insertedId };
  }

  async update(id: string, Ticket: Ticket): Promise<boolean> {
    const result = await this.collection.updateOne(
      { _id: new ObjectId(id) },
      { $set: Ticket }
    );
    return result.modifiedCount > 0;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ _id: new ObjectId(id) });
    return result.deletedCount > 0;
  }
}
