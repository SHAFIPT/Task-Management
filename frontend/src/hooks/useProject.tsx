import { useQuery } from '@tanstack/react-query';
import { fetchProjects } from '../service/projectService';

interface UseTasksParams {
  page?: number;
  limit?: number;
  filter?: string;
  search?: string;
  userId?: string;
}

const useProjects = ({ page, limit, filter, search }: UseTasksParams = {}) => {
  return useQuery({
    queryKey: ["projects", page, limit, filter, search],
    queryFn: () => fetchProjects({ page, limit, filter, search }),
  });
};


export default useProjects
