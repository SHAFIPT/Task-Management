import mongoose, { Document } from "mongoose";

export interface ITask extends Document {
  id: string;
  title: string;
  description?: string;
  project: mongoose.Types.ObjectId;
  assignedTo: mongoose.Types.ObjectId[];
  createdBy: mongoose.Types.ObjectId;
  status: "backlog" | "todo" | "inProgress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  dueDate?: Date;
  timeEstimate?: number;
  tags?: string[];
  attachments?: {
    name: string;
    url: string;
    type: string;
    uploadedBy: mongoose.Types.ObjectId;
    uploadedAt: Date;
  }[];
  createdAt: Date;
  updatedAt: Date;
}