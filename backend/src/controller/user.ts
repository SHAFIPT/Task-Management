import { ITaskService } from './../service/interface/Itask.service';
import { IProjectService } from './../service/interface/Iproject.service';
import { inject, injectable } from "tsyringe";
import { IUserController } from "../types/userContorller.types";
import {  NextFunction, Request, Response } from 'express';
import { HttpStatus } from '../enums/HttpStatus';
import { ResponseMessages } from '../constants/Messages';
import { IProject } from '../types/project.types';
import mongoose from 'mongoose';
import Project from '../model/Project';
import { getIo } from '../socketInstance';

@injectable()
export class UserController implements IUserController {
  constructor(
    @inject("IProjectService") private readonly projectService: IProjectService,
    @inject("ITaskService") private readonly taskService : ITaskService
  ) {}

  public async fetchAllUsers(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const users = await this.projectService.fetchAllUsers();
      res.status(HttpStatus.OK).json({
        message: ResponseMessages.USER_FETCHED_SUCCESSFULLY,
        users,
      });
    } catch (error) {
      next(error);
    }
  }

  public async addProject(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, description, createdBy, members } = req.body;
      
      if (!name || !createdBy) {
        res
          .status(HttpStatus.BAD_REQUEST)
          .json({ message: ResponseMessages.PROJECT_NAME_AND_CREATER_REQUERD });
        return;
      }

      const newProject = new Project({
        id: new mongoose.Types.ObjectId().toString(),
        name,
        description,
        createdBy,
        members,
        status: "active",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const project = await this.projectService.addProject(newProject);
      if (!project) {
        res.status(500).json({ message: "Failed to add project" });
        return;
      }

        const socketIo = getIo();
      if (socketIo) {
        socketIo.emit("projectAdded", project);
      }

      res.status(201).json({ message: "Project added successfully", project });
    } catch (error) {
      next(error);
    }
  }

  public async fetchAllProjects(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { limit, page, search, filter } = req.query;
      const userId = (req as any).user.id;

      const pageNumber = parseInt(page as string) || 1;
      const limitNumber = parseInt(limit as string) || 10;
      const skip = (pageNumber - 1) * limitNumber;

      // Count total projects for pagination metadata
      const totalProjects = await this.projectService.totalProjects();

      // Get projects with filters applied
      const projects = await this.projectService.fetchAllProjects(
        skip,
        limitNumber,
        search as string,
        filter as string,
        userId
      );

      res.status(200).json({
        success: true,
        data: projects,
        pagination: {
          total: totalProjects,
          page: pageNumber,
          limit: limitNumber,
          pages: Math.ceil(totalProjects / limitNumber),
        },
      });
    } catch (error) {
      next(error);
    }
  }

  public async edit(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;
    const updatedData = req.body;
    if (!id) {
       res.status(HttpStatus.NOT_FOUND).json({ message: ResponseMessages.PROJECT_ID_IS_NOTFOUND });
    }

    const updatedProject = await this.projectService.editProject(id, updatedData);
    if (!updatedProject) {
      res.status(HttpStatus.NOT_FOUND).json({ message: ResponseMessages.PROJECT_NOT_FOUND });
    }

     const socketIo = getIo();
    if (socketIo) {
      console.log("Emitting projectUpdated event with data:", updatedProject);
      socketIo.emit("projectUpdated", updatedProject);
    } else {
      console.error("Socket.io instance is not available!");
    }

    res.status(HttpStatus.OK).json({
      success: true, message:
      ResponseMessages.PROJECT_UPDATED_SUCCESSFULLY , data: updatedProject
    });
  } catch (error) {
    next(error);
  }
}
  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> { 
    try {
        const { id } = req.params;

        if (!id) {
            res.status(HttpStatus.NOT_FOUND).json({ message: ResponseMessages.PROJECT_ID_IS_NOTFOUND });
            return; // Return to prevent further execution
        }

        const deletedProject = await this.projectService.deleteProject(id);

        if (!deletedProject) {
            res.status(HttpStatus.NOT_FOUND).json({ message: ResponseMessages.PROJECT_NOT_FOUND });
            return; 
        }

        const socketIo = getIo();
        if (socketIo) {
            console.log("Emitting projectDeleted event with project ID:", id);
            socketIo.emit("projectDeleted", { projectId: id });
        } else {
            console.error("Socket.io instance is not available!");
        }

        res.status(HttpStatus.OK).json({
            success: true,
            message: ResponseMessages.PROJECT_DELETED_SUCESSFULLY,
            data: { projectId: id }
        });
    } catch (error) {
        next(error);
    }
}


  public async addTask(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const taskData = req.body;
      
      const addedTask = await this.taskService.addTask(taskData);
      
      if (addedTask) {

          const socketIo = getIo();
          if (socketIo) {
            console.log("Emitting taskAdded event with data:", addedTask);
            socketIo.emit("taskAdded", addedTask);
          } else {
            console.error("Socket.io instance is not available!");
          }



        res.status(HttpStatus.CREATED).json({
          success: true,
          message: ResponseMessages.TASK_CREATED_SUCCESSFULLY,
          data: addedTask
        });
      } else {
        res.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          message: ResponseMessages.TASK_CREATION_FAILED
        });
      }
    } catch (error) {
      next(error);
    }
  }
  public async getAllTasks(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
       const { limit, page, search, filter } = req.query;
        const userId = (req as any).user.id;
        const pageNumber = parseInt(page as string) || 1;
        const limitNumber = parseInt(limit as string) || 10;
        const skip = (pageNumber - 1) * limitNumber;

      
      const tasks = await this.taskService.fetchAllTask(
        skip,
        limitNumber,
        search as string,
        filter as string,
        userId
      );
      
      const total = await this.taskService.totalTask();
      
      res.status(HttpStatus.OK).json({
        success: true,
        data: tasks,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          pages: Math.ceil(total / Number(limit))
        }
      });
    } catch (error) {
      next(error);
    }
  }
  public async updateTask(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      if (!id) {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: ResponseMessages.TASK_ID_IS_NOTFOUND
        });
        return;
      }
      
      const updatedTask = await this.taskService.editTask(id, updateData);
      
      if (updatedTask) {

        const socketIo = getIo();
      if (socketIo) {
        console.log("Emitting taskUpdated event with data:", updatedTask);
        socketIo.emit("taskUpdated", updatedTask);
      }

        res.status(HttpStatus.OK).json({
          success: true,
          message: ResponseMessages.TASK_UPDATED_SUCCESSFULLY,
          data: updatedTask
        });
      } else {
        res.status(HttpStatus.NOT_FOUND).json({
          success: false,
          message: ResponseMessages.TASK_ID_IS_NOTFOUND
        });
      }
    } catch (error) {
      next(error);
    }
  }

  public async deleteTask(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { id } = req.params;

    if (!id) {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: ResponseMessages.TASK_ID_IS_NOTFOUND
      });
      return;
    }

    const deletedTask = await this.taskService.deleteTask(id);

    if (!deletedTask) {
      res.status(HttpStatus.NOT_FOUND).json({
        success: false,
        message: ResponseMessages.TASK_NOT_FOUND
      });
      return;
    }

    const socketIo = getIo();
    if (socketIo) {
      console.log("Emitting taskDeleted event with task ID:", id);
      socketIo.emit("taskDeleted", { taskId: id });
    } else {
      console.error("Socket.io instance is not available!");
    }

    res.status(HttpStatus.OK).json({
      success: true,
      message: ResponseMessages.TASK_DELETED_SUCCESSFULLY,
      data: { taskId: id }
    });
  } catch (error) {
    next(error);
  }
}
}