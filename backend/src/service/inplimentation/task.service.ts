import { ITaskRespository } from './../../repository/interface/Itask.repository';
import { inject, injectable } from "tsyringe";
import { ITaskService } from "../interface/Itask.service";
import { ITask } from '../../types/task.types';

@injectable()
export class TaskService implements ITaskService{
    constructor(
        @inject("ITaskRespository") private readonly taskRepo: ITaskRespository
    ) { }
    async addTask(data: ITask): Promise<ITask | null> {
        return this.taskRepo.addTask(data)
    }
    async fetchAllTask(skip: number, limit: number, query: string, filter: Object, userId: string): Promise<ITask[]> {
        return this.taskRepo.fetchAllTask(
            skip,
            limit,
            query,
            filter,    
            userId
        )
    }
    async deleteTask(id: string): Promise<void | null> {
        return this.taskRepo.deleteTask(id)
    }
    async editTask(id: string, updatedData: Partial<ITask>): Promise<ITask | null> {
        return this.taskRepo.editTask(
            id,
            updatedData
        )
    }
    async totalTask(): Promise<number> {
        return this.taskRepo.totalTask()
    }
}