import { IProjectRepository } from './../../repository/interface/Iproject.repository';
import { inject, injectable } from "tsyringe";
import { IProjectService } from "../interface/Iproject.service";
import { IProject } from '../../types/project.types';
import { IUser } from '../../types/auth.types';

@injectable()
export class ProjectService implements IProjectService{
    constructor(
        @inject("IProjectRepository") private readonly projectRepo : IProjectRepository
    ) { }
    async addProject(data: IProject): Promise<IProject | null> {
        return this.projectRepo.addProject(data)
    }
    async fetchAllUsers(): Promise<IUser[] | null>{
        return this.projectRepo.fetchAllUsers()
    }
    async fetchAllProjects(skip: number, limit: number, query: string, filter: Object ,userId: string): Promise<IProject[]> {
        return this.projectRepo.fetchAllProjects(
            skip,
            limit,
            query,
            filter,    
            userId
        )
    }
    async totalProjects(): Promise<number> {
        return this.projectRepo.totalProjects()
    }
    async editProject(id: string, updatedData: Partial<IProject>): Promise<IProject | null> {
        return this.projectRepo.editProject(
            id,
            updatedData
        )
    }
    async deleteProject(id: string): Promise<void | null>  {
        return this.projectRepo.deleteProject(id)
    }
}