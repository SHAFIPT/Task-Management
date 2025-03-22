import mongoose, { Schema } from "mongoose";
import { IOTP } from "../types/otp.types";

const OTPSchema: Schema<IOTP> = new Schema({
    email: { type: String },
    otp: { type: String, required: true },
    expirationTime: { type: Date, required: true },
    attempts: { type: Number, default: 0 },
    reSendCount: { type: Number, default: 0 },
    lastResendTime: { type: Date, default: null },
},
    {timestamps : true},
)

OTPSchema.index({ expirationTime: 1 }, { expireAfterSeconds: 86400 });


export default mongoose.model<IOTP>('OTP', OTPSchema)