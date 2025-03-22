import Project from "../../model/Project";
import User from "../../model/User";
import { IUser } from "../../types/auth.types";
import { IProject } from "../../types/project.types";
import { BaseRepository } from "../BaseRepository";
import { IProjectRepository } from "../interface/Iproject.repository";

export class ProjectRepository extends BaseRepository <IProject> implements IProjectRepository{
    constructor() {
        super(Project)
    }
    async addProject(data: IProject): Promise<IProject | null> {
        try {
        const newProject = new Project(data);
        return await newProject.save(); 
        } catch (error) {
        console.error("Error adding project:", error);
        throw new Error("Failed to add project");
        }
    }       
    async editProject(id: string, updatedData: Partial<IProject>): Promise<IProject | null> {
    try {
        const updatedProject = await Project.findByIdAndUpdate(id, updatedData, { new: true });
        return updatedProject;
    } catch (error) {
        console.error("Error updating project:", error);
        throw new Error("Failed to update project");
    }
    }
    async fetchAllUsers(): Promise<IUser[] | null> {
        try {
            return await User.find({}, "name _id email ProfilePic");
        } catch (error) {
            console.error("Error fetch users:", error);
            throw new Error("Failed to fetch users");  
        }
    }
   async fetchAllProjects(skip: number, limit: number, query: string, filter: any, userId: string): Promise<IProject[]> {
    try {
        let queryObj: any = {
            $or: [
                { createdBy: userId }, // Projects created by the user
                { "members.user": userId } // Projects where the user is a member
            ]
        };

        // Handle text search
        if (query) {
            queryObj.$and = [
                queryObj,
                {
                    $or: [
                        { name: { $regex: query, $options: 'i' } },
                        { description: { $regex: query, $options: 'i' } }
                    ]
                }
            ];
        }

        // Handle filter
        if (filter === 'active' || filter === 'completed' || filter === 'archived') {
            queryObj.status = filter;
        }

        // Execute query with pagination
        return await Project.find(queryObj)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate('createdBy', 'name email')
            .populate('members.user', 'name email')
            .lean();
    } catch (error) {
        console.error('Error fetching projects:', error);
        throw error;
    }
}
    async totalProjects(): Promise<number> {
        return await Project.countDocuments()
    }

    async deleteProject(id: string): Promise<void | null> {
        try {
            return await Project.findByIdAndDelete(id)
        } catch (error) {
            console.error('Error delete projects:', error);
            throw error;
        }
    }
}