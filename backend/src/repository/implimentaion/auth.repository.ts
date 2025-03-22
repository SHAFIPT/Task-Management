import { IauthRepository } from './../interface/Iauth.repository';
import { IAdmin, IUser } from "../../types/auth.types";
import { BaseRepository } from "../BaseRepository";
import User from '../../model/User';
import { AppError } from '../../middleware/errorHandling';
import { ResponseMessages } from '../../constants/Messages';
import { HttpStatus } from '../../enums/HttpStatus';
import Admin from '../../model/Admin';


export class AuthRepository extends BaseRepository<IUser> implements IauthRepository {
  constructor() {
    super(User);
  }
  
  async register(user: Partial<IUser>): Promise<IUser> {
    try {
      return await this.create(user);
    } catch (error) {
      throw new AppError(ResponseMessages.REGISTRATION_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async resetPassword(email: string, password: string): Promise<IUser> {
    try {
      const user = await User.findOne({ email }).exec();
      
      if (!user) {
        throw new AppError(ResponseMessages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      
      return await this.update(user.id, { 
        password,
        updatedAt: new Date()
      });
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(ResponseMessages.PASSWORD_RESET_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async findByUserEmail(email: string): Promise<IUser | null> {
    try {
        return await User.findOne({ email }).exec();
    } catch (error) {
        throw new AppError("Error in find by email", HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
    async update(id: string, data: Partial<IUser>): Promise<IUser> {
    try {
      const updatedUser = await this.model.findByIdAndUpdate(
        id,
        { ...data, updatedAt: new Date() },
        { new: true }
      );
      
      if (!updatedUser) {
        throw new AppError(ResponseMessages.USER_NOT_FOUND, HttpStatus.NOT_FOUND);
      }
      
      return updatedUser;
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(ResponseMessages.UPDATE_FAILED, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
  async findByAdminEmail(email: string): Promise<IAdmin | null> {
        try {

            const registedUser = await Admin.findOneAndUpdate(
                { email: email }, 
                { $set: { lastLogin: new Date() } }, 
                { new: true } 
            );


            if (!registedUser) {
                throw new Error('Admin is not found')
            }

            return registedUser
            
        } catch (error) {
            console.error('Error in findByEmail:', error);
            throw new Error('Failed to find Admin.');
        }
  }
  async saveAdminRefreshToken(userId: string, refreshToken: string): Promise<IAdmin | null>{
        try {
        
            return await Admin.findByIdAndUpdate(userId, { refreshToken });
            
        } catch (error) {
            console.error('Error saving refresh token:', error);
            throw new Error('Failed to save refresh token.');
        }
    } 
    async removeRefreshToken(
    userId: string,
    refreshToken: string
  ): Promise<IUser | null> {
    try {
      const userWithRemovedToken = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { refreshToken: refreshToken } },
        { new: true }
      ).select("-password -refreshToken");

      return userWithRemovedToken;
    } catch (error) {
      return null;
    }
    }
    async saveUserRefreshToken(userId: string, refreshToken: string): Promise<IUser | null> {
    try {
        return this.update(userId, { refreshToken: [refreshToken] });
    } catch (error) {
        console.error("Error saving refresh token:", error);
        throw new Error("Failed to save refresh token.");
    }
  }
  
    async currentUser(id: string): Promise<Omit<IUser, "refreshToken" | "password"> | null> {
    try {
      const user = await User.findById(id).select("-refreshToken -password").exec(); // Ensure it's a Mongoose query
      return user;
    } catch (error) {
      throw new Error("Failed to fetch the current user");
    }
  }

}