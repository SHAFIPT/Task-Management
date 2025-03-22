import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { deleteProject } from "../service/projectService";

interface ApiErrorResponse {
  message: string;
}

const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      toast.success("Project deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      const axiosError = error as AxiosError<ApiErrorResponse>; // Specify the generic type
      toast.error(axiosError.response?.data?.message || "Failed to delete Project");
    },
  });
};

export default useDeleteProject;
