import { createContext, useState, useEffect, ReactNode } from "react";
import socket from "../utils/socket";
import { toast } from "react-toastify";

// Define the notification type
interface Notification {
  type: "project" | "task" | "update";
  data: any;
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
    socket.on("projectAdded", (project) => {
      console.log("Project added event received:", project);
      setNotifications((prev) => [
        ...prev, 
        { type: "project", data: project, timestamp: Date.now() }
      ]);
      toast.success(`New project added: ${project.name}`);
    });

    socket.on("projectUpdated", (project) => {
      console.log("Project updated event received:", project);
      setNotifications((prev) => [
        ...prev, 
        { type: "project", data: project, timestamp: Date.now() }
      ]);
      toast.info(`Project updated: ${project.name}`);
    });

    // Listen for task events
    socket.on("taskAdded", (task) => {
      console.log("Task added event received:", task);
      setNotifications((prev) => [
        ...prev, 
        { type: "task", data: task, timestamp: Date.now() }
      ]);
      toast.success(`New task added: ${task.title}`);
    });

    socket.on("taskUpdated", (updatedTask) => {
      console.log("Task updated event received:", updatedTask);
      setNotifications((prev) => [
        ...prev, 
        { type: "update", data: updatedTask, timestamp: Date.now() }
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