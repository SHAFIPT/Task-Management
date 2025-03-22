import { IUser } from "../../types/auth.types";
import { IProject } from "../../types/project.types";

export interface IProjectRepository{
    addProject(data: IProject): Promise<IProject | null>
    fetchAllUsers(): Promise<IUser[] | null>
    fetchAllProjects(
        skip: number,
        limit: number,
        query: string,
        filter: Object,
        userId: string): Promise<IProject[]>
    totalProjects(): Promise<number>
    editProject(id: string, updatedData: Partial<IProject>): Promise<IProject | null>
    deleteProject(id: string): Promise<void | null> 
}