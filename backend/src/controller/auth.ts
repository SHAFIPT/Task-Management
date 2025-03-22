import { ResponseMessages } from '../constants/Messages';
import { HttpStatus } from '../enums/HttpStatus';
import { IotpService } from './../service/interface/Iotp.service';
import { inject, injectable } from "tsyringe";
import { CookieOptions, NextFunction, Request, Response } from 'express';
import { IAuthController } from '../types/authController.type';
import { IauthService } from '../service/interface/Iauth.service';
import { AuthenticatedRequest } from '../types/authRequst';

@injectable()
export class AuthController implements IAuthController {
    constructor(
        @inject('IotpService') private readonly otpService: IotpService, 
        @inject('IauthService') private readonly authService: IauthService
    ) { }

    private readonly REFRESH_TOKEN_COOKIE_OPTIONS: CookieOptions = {
        httpOnly: true,
        secure: true, // Always use secure in production
        sameSite: 'none', // Critical for cross-domain requests
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    };


    public async sendOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email } = req.body;
            const otp = await this.otpService.sendOtp(email);
             res.status(HttpStatus.OK).json({ 
                success: true, 
                message: ResponseMessages.OTP_SUCCESSFULY_SENT, 
                otp 
            });
        } catch (error) {
            next(error as Error);
        }
    }
    public async verifyOtp(req: Request, res: Response, next: NextFunction): Promise< void> {
        try {
            const { email, otp } = req.body;
            const isValid = await this.otpService.verifyOtp(email, otp);
            res.status(HttpStatus.OK).json({ 
                success: isValid, 
                message: isValid ? ResponseMessages.OTP_VERIFIED : ResponseMessages.OTP_INVALID 
            });
        } catch (error) {
            next(error);
        }
    }
    public async resendOtp(req: Request, res: Response, next: NextFunction): Promise< void> {
        try {
            const { email } = req.body;
            const otp = await this.otpService.resendOtp(email);
            res.status(HttpStatus.OK).json({ 
                success: true, 
                message: ResponseMessages.OTP_RESENT, 
                otp 
            });
        } catch (error) {
            next(error);
        }
    }

    public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password, role } = req.body
            
            if (!email || !password || !role ) {
                res.status(HttpStatus.BAD_REQUEST).json({
                success: false,
                message: ResponseMessages.MISSING_FIELDS
                });
              return
            }

            const user = await this.authService.login({ email, password, role });
            res.cookie('refreshToken', user.refreshToken, this.REFRESH_TOKEN_COOKIE_OPTIONS);
            
            res.status(HttpStatus.OK).json({ 
                success: true, 
                message: ResponseMessages.LOGIN_SUCCESS,
                user: user.user,
                accessToken: user.accessToken
            });
        } catch (error) {
        next(error)
    }
}
     public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const userData = req.body;
            const user = await this.authService.register(userData);
            
            res.status(HttpStatus.CREATED).json({ 
                success: true, 
                message: ResponseMessages.REGISTRATION_SUCCESS,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }   
            });
        } catch (error) {
            next(error);
        }
    }
     public async forgetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email } = req.body;
            await this.authService.forgetPassword(email);
            
            res.status(HttpStatus.OK).json({ 
                success: true, 
                message: ResponseMessages.PASSWORD_RESET_EMAIL_SENT
            });
        } catch (error) {
            next(error);
        }
    }

    public async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password, token } = req.body;
            await this.authService.resetPassword(email, password ,token);
            
            res.status(HttpStatus.OK).json({ 
                success: true, 
                message: ResponseMessages.PASSWORD_RESET_SUCCESS
            });
        } catch (error) {
            next(error);
        }
    }
    public async logout(
    req: AuthenticatedRequest,
    res: Response, 
    next: NextFunction
    ): Promise<void> {
    try {
        const { user } = req;

        const logoutData = await this.authService.logout(user.rawToken, user.id);
        if (logoutData) {
        res.status(HttpStatus.OK)
            .clearCookie("refreshToken")
            .json({message :  ResponseMessages.USER_LOGGED_OUT});
        }
    } catch (error) {
        next(error);
    }
    }         
    public async currentUser(
    req: AuthenticatedRequest,
    res: Response, 
    next: NextFunction
    ): Promise<void> {
    try {
        const { user } = req;
        const userData = await this.authService.currentUser(user.id);
        if (userData) {
        res.status(HttpStatus.OK)
            .json({message :  ResponseMessages.CURRENT_USER_FETCHED_SUCCESSFULLY});
        }
    } catch (error) {
        next(error);
    }
    }         
    public async refreshAccessToken(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
    ): Promise<void> {
    const { user } = req;

    try {
        const accessToken = await this.authService.refreshAccessToken(user.rawToken);

        if (accessToken) {
        res.status(HttpStatus.OK).json({
            message: ResponseMessages.TOKEN_CREATED_SUCCESSFULLY,
            accessToken,
        });
        }
    } catch (error) {
       next(error)
    }
    }    
}