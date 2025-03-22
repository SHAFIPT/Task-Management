
import { IProject } from '../types/task.types';
import { axiosInstance } from './instance/axiousInstance'

const api = axiosInstance;

export const fetchUsers = async () => {
   const response = await api.get(`/api/user/fetchAllUsers`);
  return response.data; 
}

export const fetchProjects = async ({ 
  page, 
  limit, 
  filter, 
  search 
}: { 
  page?: number, 
  limit?: number, 
  filter?: string, 
  search?: string 
}) => {
  const params = new URLSearchParams();
  
  if (page) params.append('page', String(page));
  if (limit) params.append('limit', String(limit));
  if (filter) params.append('filter', filter);
  if (search) params.append('search', search);
  
  const response = await api.get(`/api/user/projects?${params.toString()}`);
  return response.data;
};

export const addProject = async (project: IProject) => {
  const response = await api.post(`/api/user/addProject`, project);
  return response.data;
};

export const editProject = async (projectId: string, updatedData: Partial<IProject>) => {
  const response = await api.put(`/api/user/edit/${projectId}`, updatedData);
  return response.data;
};

export const deleteProject = async (projectId: string) => {
  await api.delete(`/api/user/delete/${projectId}`);
};