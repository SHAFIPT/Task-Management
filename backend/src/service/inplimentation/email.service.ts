import { IEmailService } from "../interface/Iemail.service";
import nodemailer from 'nodemailer';

export class EmailService implements IEmailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        })
    }

    async sendOtpEmail(email: string, otp: string): Promise<boolean> {
        try {
            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Your OTP Code',
                html: `Your OTP is: ${otp}. It is valid for a limited time.`,
            };
             const info = await this.transporter.sendMail(mailOptions);
                console.log('Email send response:', info);
            return true;

        } catch (error) {
            console.error('Error sending email:', error);
            return false
        }
    }
    async sendPasswordResetEmail(email: string, resetToken: string): Promise<boolean> {
        try {
            const resetLink = `${process.env.FRONTEND_URL}auth/reset-password?token=${resetToken}`;

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: "Password Reset Request",
                html: `
                    <p>You requested a password reset. Click the link below to reset your password:</p>
                    <p><a href="${resetLink}" style="color: blue; text-decoration: underline;">Reset Password</a></p>
                    <p>This link will expire in 1 hour.</p>
                `
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log("Password reset email sent: " + info.response);
            return true;
        } catch (error) {
            console.error("Error sending password reset email:", error);
            return false;
        }
    }
}