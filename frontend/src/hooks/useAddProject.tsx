import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios"; 
import { toast } from "react-toastify";
import { addProject } from "../service/projectService";

// Define expected error response type
interface ApiErrorResponse {
  message: string;
}

const useAddProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addProject,
    onSuccess: () => {
      toast.success("projects added successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects"] }); // Refresh task list
    },
    onError: (error) => {
      // Cast error as AxiosError with ApiErrorResponse
      const axiosError = error as AxiosError<ApiErrorResponse>;
      toast.error(axiosError.response?.data?.message || "Failed to add projects");
    },
  });
};

export default useAddProject;

