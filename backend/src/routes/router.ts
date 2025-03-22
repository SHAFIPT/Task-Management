import { Router } from "express";
import authRoute from "./authRouter";
import userRouter from "./usersRouter";

const router = Router()

router.use('/api/auth',authRoute)
router.use('/api/user',userRouter)

export default router