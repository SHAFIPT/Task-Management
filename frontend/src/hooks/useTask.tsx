import { useQuery } from "@tanstack/react-query";
import { getTasks } from "../service/taskService";

interface UseTasksParams {
  page?: number;
  limit?: number;
  filter?: string;
  search?: string;
}

const useTasks = ({ page, limit, filter, search }: UseTasksParams = {}) => {
  return useQuery({
    queryKey: ["tasks", page, limit, filter, search],
    queryFn: () => getTasks({ page, limit, filter, search }),
  });
};

export default useTasks;
