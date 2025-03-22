import Task from "../../model/Task";
import { ITask } from "../../types/task.types";
import { ITaskRespository } from "../interface/Itask.repository";
import { v4 as uuidv4 } from 'uuid';

export class TaskRepository implements ITaskRespository{
    async addTask(data: ITask): Promise<ITask | null> {
        try {
            // Generate a unique ID for the task if not provided
            if (!data.id) {
                data.id = uuidv4();
            }
            
            // Create a new task document
            const newTask = new Task(data);
            
            // Save the task to the database
            const savedTask = await newTask.save();
            
            return savedTask;
        } catch (error) {
            console.error('Error adding task:', error);
            throw new Error("Failed to add task");
        }
    }
    async fetchAllTask(skip: number, limit: number, query: string, filter: Object, userId: string): Promise<ITask[]> {
    try {
        let queryObj: any = {
            $or: [
                { createdBy: userId }, // Fetch tasks created by the user
                { assignedTo: userId } // Fetch tasks assigned to the user
            ]
        };

        // Add text search if query is provided
        if (query && query.trim() !== '') {
            queryObj.$and = [
                queryObj,
                {
                    $or: [
                        { title: { $regex: query, $options: 'i' } },
                        { description: { $regex: query, $options: 'i' } },
                        { tags: { $in: [new RegExp(query, 'i')] } }
                    ]
                }
            ];
        }

        // Merge additional filters
        queryObj = { ...queryObj, ...filter };

        // Get tasks with pagination
        const tasks = await Task.find(queryObj)
            .populate('project', 'name') // Populate project name
            .populate('assignedTo', 'name email') // Populate assigned users
            .populate('createdBy', 'name email') // Populate creator
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 }); // Sort by newest first
            
        return tasks;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw new Error("Failed to fetch tasks");
    }
}


    async totalTask(): Promise<number> {
        return await Task.countDocuments()
    }
    async deleteTask(id: string): Promise<void | null> {
        try {
            return await Task.findByIdAndDelete(id)
        } catch (error) {
            throw new Error("Error in task delete")            
        }
    }
    async editTask(id: string, updatedData: Partial<ITask>): Promise<ITask | null> {
        try {
            const updatedTask = await Task.findByIdAndUpdate(
                id,
                { $set: updatedData },
                { new: true } // Return the updated document
            )
            .populate('project', 'name')
            .populate('assignedTo', 'name email')
            .populate('createdBy', 'name email');
            
            return updatedTask;
        } catch (error) {
            console.error('Error updating task:', error);
            throw new Error("Failed to update task");
        }
    }
}