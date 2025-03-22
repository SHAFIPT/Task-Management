import { IUser } from "../../types/auth.types";
import { IOTP } from "../../types/otp.types";



export interface IotpService {
    sendOtp(email: string): Promise<IOTP | null>
    verifyOtp(email: string, otp: string): Promise<boolean>
    resendOtp(email: string): Promise<IOTP | null> 
}