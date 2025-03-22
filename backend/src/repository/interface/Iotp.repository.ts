import { IOTP } from "../../types/otp.types";

export interface IOtpRepository {
  createOtp(email: string): Promise<IOTP | null>;
  verifyOtp(email: string, otp: string): Promise<boolean>;
  resendOtp(email: string): Promise<IOTP | null>;
}