import { Router } from "express";
import { container } from "tsyringe";
import { AuthController } from "../controller/auth";
import { AuthenticatedRequest } from "../types/authRequst";
import { decodedUserRefreshToken, verifyUserRefreshToken } from "../middleware/authMiddleware";

const authRoute = Router()
const authController = container.resolve<AuthController>(AuthController);

authRoute.post("/send-otp", (req, res, next) => authController.sendOtp(req, res, next));
authRoute.post("/verify-otp", (req, res, next) => authController.verifyOtp(req, res, next));
authRoute.post("/resend-otp", (req, res, next) => authController.resendOtp(req, res, next));
authRoute.post("/login", (req, res, next) => authController.login(req, res, next));
authRoute.post("/register", (req, res, next) => authController.register(req, res, next));
authRoute.post("/forget-Password", (req, res, next) => authController.forgetPassword(req, res, next));
authRoute.post("/reset-password", (req, res, next) => authController.resetPassword(req, res, next));
authRoute.post('/logout',decodedUserRefreshToken, (req, res , next) => authController.logout(req as AuthenticatedRequest, res , next));
authRoute.post('/currentUser',decodedUserRefreshToken, (req, res , next) => authController.currentUser(req as AuthenticatedRequest, res , next));
authRoute.get(
  "/refresh-token",
  verifyUserRefreshToken,
  (req, res, next) => authController.refreshAccessToken(req as AuthenticatedRequest, res, next)
);
export default authRoute