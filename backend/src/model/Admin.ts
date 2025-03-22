import mongoose, { model, Schema } from "mongoose";
import { IAdmin } from "../types/auth.types";


const AdminSchema: Schema = new Schema({
  email: { type: String },
  password: { type: String },
  refreshToken:{type:Array},
  role: {type:String , default:"admin"},
});

const Admin = mongoose.model<IAdmin>("admin", AdminSchema);

export default Admin;
