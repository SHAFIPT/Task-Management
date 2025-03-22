  import { useMutation, useQueryClient } from "@tanstack/react-query";
  import { AxiosError } from "axios"; 
  import { toast } from "react-toastify";
  import { addTask } from "../service/taskService";
  import { ITask } from "../types/task.types";

  // Define expected error response type
  interface ApiErrorResponse {
    message: string;
  }

  // Define the task creation parameters
  export interface AddTaskParams {
    title: string;
    description?: string;
    project: string;
    assignedTo: string[];
    status: ITask['status']; 
    priority: ITask['priority'];
    dueDate?: Date;
    timeEstimate?: number;
    tags: string[];
    createdBy: string; 
    attachments?: {
      name: string;
      url: string;
      type: string;
      uploadedBy: string;
      uploadedAt: Date;
    }[];
  }

  const useAddTask = () => {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: addTask,
      onSuccess: () => {
        toast.success("Task added successfully!");
        // Refresh both tasks and projects queries
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        queryClient.invalidateQueries({ queryKey: ["projects"] });
      },
      onError: (error) => {
        // Cast error as AxiosError with ApiErrorResponse
        const axiosError = error as AxiosError<ApiErrorResponse>;
        toast.error(axiosError.response?.data?.message || "Failed to add task");
      },
    });
  };

  export default useAddTask;