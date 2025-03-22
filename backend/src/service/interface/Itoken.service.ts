// interface/ITokenService.ts

export interface ITokenPayload {
    id: string;
    role: string | null;
    // Add any other properties you want to include in the token
}

export interface ITokenService {
    /**
     * Generates a short-lived access token
     * @param payload Data to be encoded in the token
     * @returns Signed JWT access token
     */
    generateAccessToken(payload: ITokenPayload): string;

    /**
     * Generates a long-lived refresh token
     * @param payload Data to be encoded in the token
     * @returns Signed JWT refresh token
     */
    generateRefreshToken(payload: ITokenPayload): string;

    /**
     * Verifies and decodes an access token
     * @param token JWT access token to verify
     * @returns Decoded token payload
     * @throws JsonWebTokenError if token is invalid
     */
    verifyAccessToken(token: string): ITokenPayload;

    /**
     * Verifies and decodes a refresh token
     * @param token JWT refresh token to verify
     * @returns Decoded token payload
     * @throws JsonWebTokenError if token is invalid
     */
    verifyRefreshToken(token: string): ITokenPayload;

    /**
     * Revokes a refresh token
     * @param token Refresh token to revoke
     * @returns True if token was revoked successfully
     */
    revokeRefreshToken?(token: string): Promise<boolean>;

    /**
     * Checks if a refresh token has been revoked
     * @param token Refresh token to check
     * @returns True if token is revoked
     */
    isRefreshTokenRevoked?(token: string): Promise<boolean>;
}