export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface OtpVerification {
  email: string;
  otp: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  token?: string; // Optional field if needed
}

export interface IUser {
    _id?: string;
    name: string;
    email: string;
    role?: string;
    profilePicture: string;
    isBlocked?: string;
    password ?: string
}  