import { IUser } from "../../types/auth.types";

export interface IauthService{
    login(credentials: { email: string; password: string; role: string }): Promise<{
        user: Omit<IUser, "password">;
        accessToken: string;
        refreshToken: string;
    }>
    register(user: Partial<IUser>): Promise<{
    user: Omit<IUser, "password">;
    accessToken: string;
    refreshToken: string;
    }>
    forgetPassword(email : string) : Promise<IUser>
    resetPassword(email: string, password: string, token: string): Promise<IUser>
    logout(token: string, id: string): Promise<IUser | null>;
    currentUser(id: string): Promise<Omit<IUser, "refreshToken" | "password"> | null>
    refreshAccessToken(refreshToken: string): Promise<string | null>;
}