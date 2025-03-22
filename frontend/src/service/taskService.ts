import { axiosInstance } from './instance/axiousInstance'
import { AddTaskParams } from '../hooks/useAddTask';
import { ITask } from '../types/task.types';

const api = axiosInstance;


export const getTasks = async ({
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

  const { data } = await api.get(`/api/user/fetchAllTask?${params.toString()}`);
  return data;
};

export const addTask = async (task: AddTaskParams) => {
  const { data } = await api.post("/api/user/addTask", task);
  return data;
};


export const deleteTask = async (taskId: string) => {
  const { data } = await api.delete(`/api/user/deleteTask/${taskId}`);
  return data;
};

export const editTask = async (taskId: string, updatedTask: Partial<ITask>) => {
  const { data } = await api.put(`/api/user/editTask/${taskId}`, updatedTask);
  return data;
};
