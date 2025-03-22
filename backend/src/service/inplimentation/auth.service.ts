import { IEmailService } from './../interface/Iemail.service';
import { ITokenService } from './../interface/Itoken.service';
import { IauthRepository } from './../../repository/interface/Iauth.repository';
import { inject, injectable } from "tsyringe";
import { IauthService } from "../interface/Iauth.service";
import { IUser } from "../../types/auth.types";
import { comparePassword, hashPassword } from '../../helpers/hashPass';
import { AppError } from '../../middleware/errorHandling';
import { HttpStatus } from '../../enums/HttpStatus';
import { ResponseMessages } from '../../constants/Messages';
import { generateResetToken } from '../../utils/generateResetToken';
@injectable()
export class authService implements IauthService {
  constructor(
    @inject("IauthRepository") private readonly authRepo: IauthRepository,
    @inject("ITokenService") private readonly tokenService: ITokenService,
    @inject('IEmailService') private readonly emailService : IEmailService
  ) {}
  
  async login(credentials: {
    email: string;
    password: string;
    role: string;
  }): Promise<{
    user: Omit<IUser, "password">;
    accessToken: string;
    refreshToken: string;
  }> {
    try {
      let user;
      const { email, password, role } = credentials;

      // Based on role, query the appropriate collection
      if (role === "admin") {
        user = await this.authRepo.findByAdminEmail(email);
      } else if (role === "user") {
        user = await this.authRepo.findByUserEmail(email);
      } else {
        throw new Error("Invalid role specified.");
      }

      if (!user) {
        throw new Error("Invalid email or password.");
      }

      if (!user.password) {
        throw new Error("User password not set.");
      }

      // Compare password
      const isPasswordValid = await comparePassword(password, user.password);
      if (!isPasswordValid) {
        throw new Error("Invalid email or password.");
      }

      // Generate tokens
      const tokenPayload = {
        id: user.id,
        role: user.role || role, // Use the role from user object if available, otherwise use the provided role
      };

      const accessToken = this.tokenService.generateAccessToken(tokenPayload);
      const refreshToken = this.tokenService.generateRefreshToken(tokenPayload);

      // Save refresh token
      if (role === "admin") {
        await this.authRepo.saveAdminRefreshToken(user.id, refreshToken);
      } else {
        await this.authRepo.saveUserRefreshToken(user.id, refreshToken);
      }

      // Remove sensitive data
      const {
        password: _,
        refreshToken: __,
        ...userWithoutSensitive
      } = user.toObject();

      return {
        user: userWithoutSensitive as IUser,
        accessToken,
        refreshToken,
      };
    } catch (error) {
       console.error("Error logging in:", error);
      // Rethrow the error as is if it's already an AppError
      if (error instanceof AppError) {
        throw error;
      }
      // Otherwise, create a new generic error
      throw new AppError((error instanceof Error) ? error.message : "Login failed", 500);
    }
  }
  async register(user: Partial<IUser>): Promise<IUser> {
        try {
            const { email, password, name } = user;

            console.log('This are teh servies datas:::', {
                email,
                password,
                name
            })
            
            if (!email || !password || !name) {
                throw new AppError(ResponseMessages.MISSING_FIELDS, HttpStatus.BAD_REQUEST);
            }

            const existingUser = await this.authRepo.findByUserEmail(email);

            console.log('Thsi sit he existinguser ::::', {
                existingUser
            })
            
            if (existingUser) {
                throw new AppError(ResponseMessages.USER_ALREADY_EXISTS, HttpStatus.CONFLICT);
            }

            // Hash the password
            const hashedPassword = await hashPassword(password);


            console.log('NOw i am addin teh user ::::')
            
            // Create user
            const newUser = await this.authRepo.register({
                ...user,
                password: hashedPassword,
                authType: user.authType || "local",
            });

            console.log('thsi is the new User :::',newUser)

            // Send welcome email
            // await this.emailService.sendWelcomeEmail(newUser.email, newUser.name);
            
            return newUser;
            
        } catch (error) {   
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(ResponseMessages.REGISTRATION_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
  async forgetPassword(email: string): Promise<IUser> {
        try {
            if (!email) {
                throw new AppError(ResponseMessages.EMAIL_REQUIRED, HttpStatus.BAD_REQUEST);
            }

            const existingUser = await this.authRepo.findByUserEmail(email);
            
            if (!existingUser) {
                throw new AppError(ResponseMessages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }

            // Generate password reset token
             const { resetToken, resetTokenExpiry } = generateResetToken();
            
            // Update user with reset token
            await this.authRepo.update(existingUser.id, {
                resetToken,
                resetTokenExpiry,
                updatedAt: new Date()
            });

            if (!existingUser.email) {
                throw new AppError(ResponseMessages.USER_EMAIL_MISSING, HttpStatus.BAD_REQUEST);
            }

            // Send reset password email with token
            await this.emailService.sendPasswordResetEmail(existingUser.email, resetToken);
            
            return existingUser;
            
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(ResponseMessages.PASSWORD_RESET_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
  async resetPassword(email: string, password: string, token: string): Promise<IUser> {
        try {
            if (!email || !password || !token) {
                throw new AppError(ResponseMessages.MISSING_FIELDS, HttpStatus.BAD_REQUEST);
            }

            const existingUser = await this.authRepo.findByUserEmail(email);
            
            if (!existingUser) {
                throw new AppError(ResponseMessages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
            }     

            // Verify reset token
            if (existingUser.resetToken !== token) {
                throw new AppError(ResponseMessages.INVALID_RESET_TOKEN, HttpStatus.UNAUTHORIZED);
            }

            // Check if token is expired
            const now = new Date();
            if (!existingUser.resetTokenExpiry || existingUser.resetTokenExpiry < now) {
                throw new AppError(ResponseMessages.RESET_TOKEN_EXPIRED, HttpStatus.UNAUTHORIZED);
          }
          console.log('Thsi si eth service ::', {
            email,
            password,
            token
          })

            // Hash the new password
            const hashedPassword = await hashPassword(password);
            
            // Update user with new password and clear reset token
            await this.authRepo.update(existingUser.id, {
                password: hashedPassword,
                resetToken: null,
                resetTokenExpiry: null,
                updatedAt: new Date()
            });
            
            return existingUser;
            
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(ResponseMessages.PASSWORD_RESET_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async logout(token: string, id: string): Promise<IUser | null> {
    try {
      const user = await this.authRepo.removeRefreshToken(id, token);

      return user ? user : null;
    } catch (error) {
      return null;
    }
  }
  async refreshAccessToken(refreshToken: string): Promise<string | null> {
        try {
            const payload = await this.tokenService.verifyRefreshToken(refreshToken)

            const tokenPayload = {
                id: payload.id,
                role: payload.role
            };

            const accessToken = this.tokenService.generateAccessToken(tokenPayload);

            return accessToken
        } catch (error) {
            return null;
        }
  }
  
  async currentUser(id: string): Promise<Omit<IUser, "refreshToken" | "password"> | null> {
    return this.authRepo.currentUser(id)
  }
}