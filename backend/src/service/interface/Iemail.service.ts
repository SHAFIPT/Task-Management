

export interface IEmailService {
    sendOtpEmail(email: string, otp: string): Promise<boolean>;
    sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean>
}
  