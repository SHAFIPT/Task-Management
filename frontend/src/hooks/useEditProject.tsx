import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { editProject } from "../service/projectService";
import { IProject } from "../types/task.types";

interface ApiErrorResponse {
  message: string;
}

const useEditProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ projectId, updatedData }: { projectId: string; updatedData: Partial<IProject> }) =>
      editProject(projectId, updatedData),
    onSuccess: () => {
      toast.success("Project updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (error) => {
      const axiosError = error as AxiosError<ApiErrorResponse>;
      toast.error(axiosError.response?.data?.message || "Failed to update Project");
    },
  });
};

export default useEditProject;
