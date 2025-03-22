import { LoginCredentials, OtpVerification, RegisterCredentials } from '../types/auth';
import axiosInstance from './instance/axiousInstance';

const api = axiosInstance;

export const loginUser = async (credentials: LoginCredentials) => {
   const { data } = await api.post('/api/auth/login', credentials);
  return data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/api/auth/currentUser'); 
  return response.data.user;
};

export const registerUser = async ({ name, email, password }: RegisterCredentials) => {
  const { data } = await api.post('/api/auth/register', { name, email, password });
  return data;
};

export const sendOtp = async (email: string) => {
 const { data } = await api.post('/api/auth/send-otp', { email });
  return data;
};

export const verifyOtp = async  ({ email, otp }: OtpVerification) => {
  const { data } = await api.post('/api/auth/verify-otp', { email, otp });
  return data;
};

let refreshAttempted = false;

export const refreshAccessToken = async (): Promise<string | null> => {
    if (refreshAttempted) {
      logoutUser();
      return null;
    }
  try {
    const { data } = await axiosInstance.post("/api/auth/refresh-token");
    localStorage.setItem("accessToken", data.accessToken);

    refreshAttempted = false;
    return data.accessToken;
  } catch (error) {
    console.error("Failed to refresh token:", error);
    refreshAttempted = true; 
    return null;
  }
};

export const logoutUser = async () => {
  console.log('runnig logout........................')
  const { data } = await api.post('/api/auth/logout');
  console.log('this is the data::::::::::::',data)
  return data;
};

export const resendOtp = async (email: string) => {
  const { data } = await api.post('/api/auth/resend-otp', { email });
  return data;
}; 

export const forgotPassword = async (email: string) => {
  const { data } = await api.post('/api/auth/forget-Password', { email });
  return data;
};

export const resetPassword = async ({ email, password, token }: { email: string; password: string; token: string }) => {
  const { data } = await api.post('/api/auth/reset-password', { email, password, token });
  return data;
};