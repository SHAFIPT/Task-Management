import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { container } from 'tsyringe';
import { AuthenticatedRequest } from '../types/authRequst';
import { TokenService } from '../service/inplimentation/token.service';
const tokenService = new TokenService();


interface AuthRequest extends Request {
  user?: { id: string };
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const tokenService = container.resolve<TokenService>(TokenService); // Resolve TokenService using tsyringe

    // Get token from headers
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      res.status(401).json({ message: "Unauthorized: No token provided" });
      return; // Ensure middleware does not proceed further
    }

    // Verify token using TokenService
    const decoded = tokenService.verifyAccessToken(token);

    // Attach user ID to the request object
    req.user = { id: decoded.id };

    next(); // Proceed to next middleware/controller
  } catch (error) {
    res.status(401).json({ message: "Unauthorized: Invalid token" });
    return;
  }
};

export default authMiddleware;

export const decodedUserRefreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const refreshToken = req.cookies?.refreshToken || req.header("refreshToken");


  console.log('There is an error isn the refreshtoken :::',refreshToken)
  if (!refreshToken) {
    res.status(401).json({ message: "Access Denied" });
    return;
  }    

  try {
    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as jwt.JwtPayload;
    
    // Cast req to AuthenticatedRequest
    (req as AuthenticatedRequest).user = { 
      ...decoded, 
      rawToken: refreshToken,
      id: decoded.id // Make sure the decoded token has an id property
    };

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Token or Expired" });
    return;
  }
};


export const verifyUserRefreshToken = (
  req: Request, // Keep Express default type
  res: Response,
  next: NextFunction
): void => {
  const refreshToken = req.cookies?.refreshToken || req.header("refreshToken");

  if (!refreshToken) {
    res.status(401).json({ message: "Access Denied" });
    return;
  }

  try {
    const decoded = tokenService.verifyRefreshToken(refreshToken);

    // ✅ Type assertion
    (req as AuthenticatedRequest).user = { rawToken: refreshToken, id: decoded.id };

    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Token or Expired" });
    return;
  }
};