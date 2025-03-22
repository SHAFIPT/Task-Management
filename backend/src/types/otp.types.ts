import { Document } from "mongoose";

export interface IOTP extends Document {
    email: string;
    otp: string;       
    expirationTime: Date;
    attempts: number;
    reSendCount: number;
    lastResendTime: Date | null;    
    role: string;
}