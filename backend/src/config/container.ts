import { container } from "tsyringe";
import { IotpService } from "../service/interface/Iotp.service";
import { otpService } from "../service/inplimentation/otp.service";
import { IOtpRepository } from "../repository/interface/Iotp.repository";
import { OtpRepository } from "../repository/implimentaion/otp.repository";
import { IEmailService } from "../service/interface/Iemail.service";
import { EmailService } from "../service/inplimentation/email.service";
import { AuthController } from "../controller/auth";
import { IAuthController } from "../types/authController.type";
import { IauthService } from "../service/interface/Iauth.service";
import { authService } from "../service/inplimentation/auth.service";
import { AuthRepository } from "../repository/implimentaion/auth.repository";
import { IauthRepository } from "../repository/interface/Iauth.repository";
import { ITokenService } from "../service/interface/Itoken.service";
import { TokenService } from "../service/inplimentation/token.service";
import { IProjectService } from "../service/interface/Iproject.service";
import { ProjectService } from "../service/inplimentation/Project.service";
import { IProjectRepository } from "../repository/interface/Iproject.repository";
import { ProjectRepository } from "../repository/implimentaion/Project.repository";
import { IUserController } from "../types/userContorller.types";
import { UserController } from "../controller/user";
import { ITaskService } from "../service/interface/Itask.service";
import { TaskService } from "../service/inplimentation/task.service";
import { ITaskRespository } from "../repository/interface/Itask.repository";
import { TaskRepository } from "../repository/implimentaion/task.repository";

// Register services
container.register<IotpService>("IotpService", { useClass: otpService });
container.register<IauthService>("IauthService", { useClass: authService });
container.register<IEmailService>("IEmailService", { useClass: EmailService });
container.register<ITokenService>("ITokenService", { useClass: TokenService });
container.register<IProjectService>("IProjectService", { useClass: ProjectService })
container.register<ITaskService>("ITaskService", { useClass: TaskService })

// Register repositories
container.register<IOtpRepository>("IOtpRepository", { useClass: OtpRepository });
container.register<IauthRepository>("IauthRepository", { useClass: AuthRepository });
container.register<IProjectRepository>("IProjectRepository", { useClass: ProjectRepository })
container.register<ITaskRespository>("ITaskRespository", { useClass: TaskRepository });

// Register controllers
container.register<IAuthController>("IAuthController", { useClass: AuthController });
container.register<IUserController>("IUserController", { useClass : UserController})
export default container;