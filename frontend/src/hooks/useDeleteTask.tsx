import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { deleteTask } from "../service/taskService";

interface ApiErrorResponse {
  message: string;
}

const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      toast.success("Task deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      const axiosError = error as AxiosError<ApiErrorResponse>; // Specify the generic type
      toast.error(axiosError.response?.data?.message || "Failed to delete task");
    },
  });
};

export default useDeleteTask;
