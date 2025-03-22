import { Router } from "express";
import { container } from "tsyringe";
import { UserController } from "../controller/user";
import authMiddleware from "../middleware/authMiddleware";

const userRouter = Router()
const userController = container.resolve<UserController>(UserController);

//Project
userRouter.get('/fetchAllUsers',authMiddleware,(req, res, next) => userController.fetchAllUsers(req, res, next));
userRouter.post('/addProject', authMiddleware,(req, res, next) => userController.addProject(req, res, next));
userRouter.get('/projects', authMiddleware,(req, res, next) => userController.fetchAllProjects(req, res, next));
userRouter.put('/edit/:id', authMiddleware,(req, res, next) => userController.edit(req, res, next));
userRouter.delete('/delete/:id', authMiddleware, (req, res, next) => userController.delete(req, res, next));

//Task
userRouter.post('/addTask', authMiddleware,(req, res, next) => userController.addTask(req, res, next));
userRouter.get('/fetchAllTask', authMiddleware,(req, res, next) => userController.getAllTasks(req, res, next));
   
userRouter.put('/editTask/:id', authMiddleware,(req, res, next) => userController.updateTask(req, res, next));
   
userRouter.delete('/deleteTask/:id', authMiddleware,(req, res, next) => userController.deleteTask(req, res, next));
   
export default userRouter