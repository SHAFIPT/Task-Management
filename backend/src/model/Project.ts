import mongoose, { Schema, Document, model } from "mongoose";
import { IProject } from "../types/project.types";


const ProjectSchema: Schema<IProject> = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "Users", required: true },
    members: [
      {
        user: { type: Schema.Types.ObjectId, ref: "Users", required: true },
        role: { type: String, enum: ["owner", "editor", "viewer"], default: "viewer" },
      },
    ],
    status: { type: String, enum: ["active", "completed", "archived"], default: "active" },
  },
  { timestamps: true }
);

// Create and export the model
const Project = model<IProject>("Project", ProjectSchema);
export default Project;