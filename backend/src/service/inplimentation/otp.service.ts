import { IEmailService } from "./../interface/Iemail.service";
import { IOtpRepository } from "./../../repository/interface/Iotp.repository";
import { inject, injectable } from "tsyringe";
import { IotpService } from "../interface/Iotp.service";
import { IOTP } from "../../types/otp.types";

@injectable()
export class otpService implements IotpService {
  constructor(
    @inject("IOtpRepository") private readonly otpRepo: IOtpRepository,
    @inject("IEmailService") private readonly emailService: IEmailService
  ) {}
  async sendOtp(email: string): Promise<IOTP | null> {
    try {
      const createOtp = await this.otpRepo.createOtp(email);
      if (createOtp) {
        await this.emailService.sendOtpEmail(email, createOtp.otp);
      }

      return createOtp;
    } catch (error) {
      throw new Error("Error in sendOtp services");
    }
  }

  async verifyOtp(email: string, otp: string): Promise<boolean> {
    return this.otpRepo.verifyOtp(email, otp);
  }

  async resendOtp(email: string): Promise<IOTP | null> {
    const otpRecord = await this.otpRepo.resendOtp(email);

    if (otpRecord) {
      await this.emailService.sendOtpEmail(email, otpRecord.otp);
    }

    return otpRecord;
  }
}
