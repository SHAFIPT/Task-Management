
  export interface IProjectData {
    _id: string;
    name: string;
  }

  export interface IAssignedUser {
    _id: string;
    name: string;
    email: string;
  }

  export interface ITask {
    _id: string;
    title: string;
    description?: string;
    project?:IProjectData | string;
    assignedTo?: IAssignedUser[];
    createdBy?: string
    status?: 'backlog' | 'todo' | 'inProgress' | 'review' | 'done' | 'completed';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    dueDate?: Date;
    timeEstimate?: number;
    tags?: string[];
    attachments?: {
      name: string;
      url: string;
      type: string;
      uploadedBy?: string
      uploadedAt?: Date;
    }[];
    createdAt?: Date;
    updatedAt?: Date;
  }

export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface IProject {
  _id: string; // Unique identifier for the project
  name: string; // Name of the project
  description?: string; // Optional description of the project
  createdBy: string; // ID of the user who created the project
  members: Array<{
    user: IUser | string; // ID of the member
    role: "owner" | "editor" | "viewer"; // Role of the member
  }>;
  status: "active" | "completed" | "archived"; // Status of the project
  createdAt: string; // Timestamp of when the project was created
}
