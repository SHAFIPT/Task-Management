import { Request } from "express";

export interface AuthenticatedRequest extends Request {
  user: {
    rawToken: string;
    id: string;
    [key: string]: any; // For any additional properties
  };
}