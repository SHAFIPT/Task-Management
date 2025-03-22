import  { Schema, model } from "mongoose";
import { ITask } from "../types/task.types";

const TaskSchema: Schema<ITask> = new Schema(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String },
    project: { type: Schema.Types.ObjectId, ref: "Project", required: true },
    assignedTo: [{ type: Schema.Types.ObjectId, ref: "Users" }], // Reference Users
    createdBy: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    status: { type: String, enum: ["backlog", "todo", "inProgress", "review", "done"], default: "todo" },
    priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "medium" },
    dueDate: { type: Date },
    timeEstimate: { type: Number },
    tags: [{ type: String }],
    attachments: [
      {
        name: { type: String },
        url: { type: String },
        type: { type: String },
        uploadedBy: { type: Schema.Types.ObjectId, ref: "Users" },
        uploadedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

// Task Model
const Task = model<ITask>("Task", TaskSchema);
export default Task;