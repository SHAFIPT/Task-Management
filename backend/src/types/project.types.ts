import mongoose, {  Document } from "mongoose";

export interface IProject extends Document {
  id: string;
  name: string;
  description?: string;
  createdBy: mongoose.Types.ObjectId;
  members: {
    user: mongoose.Types.ObjectId;
    role: "owner" | "editor" | "viewer";
  }[];
  status: "active" | "completed" | "archived";
  createdAt: Date;
  updatedAt: Date;
}
