import { Document, ObjectId } from "mongoose";

export interface IUser extends Document {
  _id: ObjectId | string;
  name: string | null;
  email: string | null;
  password: string | null;
  ProfilePic: string | null;
  role: string | null;
  isBlocked: boolean | null;
  Chat: ObjectId | string | null;
  refreshToken?: string[];
  lastLogin: Date | null;
  authType: "local" | "google";
  resetToken?: string | null;
  resetTokenExpiry?: Date | null;
  isVerified?: boolean;
  updatedAt?: Date;
  createdAt?: Date;
  token?: string;
}
           

export interface IAdmin extends Document {
  _id: ObjectId;
  email: string | null;
  password: string | null;
  role: string | null;
  refreshToken: string [] | null;
}