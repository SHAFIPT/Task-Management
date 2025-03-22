import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { editTask } from "../service/taskService";
import { ITask } from "../types/task.types";

// Define expected API error response type
interface ApiErrorResponse {
  message: string;
}

// Define the expected structure for mutation function parameters
interface EditTaskParams {
  taskId: string;
  updatedData: Partial<ITask>; // Allow partial updates
}

const useEditTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ taskId, updatedData }: EditTaskParams) => 
      editTask(taskId, updatedData),

    onSuccess: () => {
      toast.success("Task updated successfully!");
      // Refresh both tasks and projects queries
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      // Also invalidate related projects since task updates might affect project data
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },

    onError: (error) => {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      toast.error(axiosError.response?.data?.message || "Failed to update task");
    },
  });
};

export default useEditTask;