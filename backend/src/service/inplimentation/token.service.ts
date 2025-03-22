import { injectable } from "tsyringe";
import jwt from 'jsonwebtoken';
import { ITokenService } from "../interface/Itoken.service";
import { ITokenPayload } from "../../types/token.types";

@injectable()
export class TokenService implements ITokenService {
    private readonly accessTokenSecret = process.env.ACCESS_TOKEN_SECRET!;
    private readonly refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET!;

    generateAccessToken(payload: ITokenPayload): string {
        return jwt.sign(payload, this.accessTokenSecret, { expiresIn: '15m' });
    }
   
    generateRefreshToken(payload: ITokenPayload): string {
        return jwt.sign(payload, this.refreshTokenSecret, { expiresIn: '7d' });
    }

    verifyAccessToken(token: string): ITokenPayload {
        return jwt.verify(token, this.accessTokenSecret) as ITokenPayload;
    }

    verifyRefreshToken(token: string): ITokenPayload {
        return jwt.verify(token, this.refreshTokenSecret) as ITokenPayload;
    }
}