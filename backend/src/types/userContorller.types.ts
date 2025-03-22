
import { NextFunction, Request, Response } from "express";

export interface IUserController {
    addProject(req: Request, res: Response, next: NextFunction): Promise<void>;
    fetchAllUsers(req: Request, res: Response, next: NextFunction): Promise<void>;
}