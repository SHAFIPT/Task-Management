import { ITask } from "../../types/task.types"


export interface ITaskService{
    addTask(data : ITask) : Promise<ITask | null>
    fetchAllTask(
        skip: number,
        limit: number,
        query: string,
        filter: Object,
        userId: string): Promise<ITask[]>
    totalTask(): Promise<number>
    editTask(id: string, updatedData: Partial<ITask>): Promise<ITask | null>
    deleteTask(id: string): Promise<void | null> 
}