import { Schema, type Document, type ObjectId } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  tickets?: ObjectId[];
  isVIP?: boolean;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  USER = "User",
  ADMIN = "Admin",
  STAFF = "Staff",
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USER
    },
    tickets: [{ type: Schema.Types.ObjectId, ref: "Ticket" }],
    isVIP: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

// Add indexes for better performance
// userSchema.index({ email: 1 });
// userSchema.index({ name: 1 });
// userSchema.index({ role: 1 });

export default userSchema;
