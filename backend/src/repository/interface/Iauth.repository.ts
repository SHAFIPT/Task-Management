import { IAdmin, IUser } from "../../types/auth.types";

export interface IauthRepository{
    register(user : Partial<IUser>) : Promise<IUser>
    findByUserEmail(email: string): Promise<IUser | null>
    findByAdminEmail(email: string): Promise<IAdmin | null>;
    resetPassword(email: string, password: string): Promise<IUser>
    saveUserRefreshToken(userId: string, refreshToken: string): Promise<IUser | null>
    saveAdminRefreshToken(userId: string, refreshToken: string): Promise<IAdmin | null>
    update(id: string, data: Partial<IUser>): Promise<IUser>
    removeRefreshToken(userId: string, refreshToken: string): Promise<IUser | null>;
    currentUser(id: string): Promise<Omit<IUser, "refreshToken" | "password"> | null>
}