import { createContext, useState, useEffect, ReactNode } from "react";
import socket from "../utils/socket";
import { toast } from "react-toastify";

// Define specific data types for different notifications
interface Project {
  id: string;
  name: string;
  // Add other project properties as needed
}

interface Task {
  id: string;
  title: string;
  // Add other task properties as needed
}

// Use discriminated union type instead of 'any'
type NotificationData = 
  | { kind: 'project'; project: Project }
  | { kind: 'task'; task: Task }
  | { kind: 'update'; update: Task | Project };

// Define the notification type with specific data structure
interface Notification {
  type: "project" | "task" | "update";
  data: NotificationData;
  timestamp: number;
}

// Define the context type
interface SocketContextType {
  notifications: Notification[];
  connected: boolean;
}

// Create the context with an initial default value
export const SocketContext = createContext<SocketContextType | undefined>(undefined);

// Define props type for the provider
interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [connected, setConnected] = useState<boolean>(false);

  useEffect(() => {
    // Connection status
    socket.on("connect", () => {
      setConnected(true);
      console.log("Socket connected successfully");
    });

    socket.on("disconnect", () => {
      setConnected(false);
      console.log("Socket disconnected");
    });

    // Listen for project events
    socket.on("projectAdded", (project: Project) => {
      console.log("Project added event received:", project);
      setNotifications((prev) => [
        ...prev, 
        { 
          type: "project", 
          data: { kind: 'project', project }, 
          timestamp: Date.now() 
        }
      ]);
      toast.success(`New project added: ${project.name}`);
    });

    socket.on("projectUpdated", (project: Project) => {
      console.log("Project updated event received:", project);
      setNotifications((prev) => [
        ...prev, 
        { 
          type: "project", 
          data: { kind: 'project', project }, 
          timestamp: Date.now() 
        }
      ]);
      toast.info(`Project updated: ${project.name}`);
    });

    // Listen for task events
    socket.on("taskAdded", (task: Task) => {
      console.log("Task added event received:", task);
      setNotifications((prev) => [
        ...prev, 
        { 
          type: "task", 
          data: { kind: 'task', task }, 
          timestamp: Date.now() 
        }
      ]);
      toast.success(`New task added: ${task.title}`);
    });

    socket.on("taskUpdated", (updatedTask: Task) => {
      console.log("Task updated event received:", updatedTask);
      setNotifications((prev) => [
        ...prev, 
        { 
          type: "update", 
          data: { kind: 'update', update: updatedTask }, 
          timestamp: Date.now() 
        }
      ]);
      toast.info(`Task updated: ${updatedTask.title}`);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("projectAdded");
      socket.off("projectUpdated");
      socket.off("taskAdded");
      socket.off("taskUpdated");
    };
  }, []);

  return (
    <SocketContext.Provider value={{ notifications, connected }}>
      {children}
    </SocketContext.Provider>
  );
};