import React, { useEffect, useState } from 'react';
import { Pencil, Trash2, Plus, Clock, Tag, Briefcase } from 'lucide-react';
import Layout from '../Commen/Layout';
import useTasks from '../../hooks/useTask';
import '../../pages/Auth/loadingBody.css';
import AddTask from './AddTask';
import EditTask from './EditTask';
import { ITask } from '../../types/task.types';
import socket from '../../utils/socket';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import useDeleteTask from '../../hooks/useDeleteTask';

interface IUser {
    _id: string;
    name: string;
    email: string;
    role?: string;
    avatar?: string;
  }

const TaskManagement = () => {
  const [page] = useState(1);
  const limit = 10; // Number of tasks per page
  
  // Use the custom hook to fetch tasks
  const { data, isLoading } = useTasks({ page, limit });
   const queryClient = useQueryClient();
  const [tasks, setTasks] = useState<ITask[]>([]);
  console.log('This is shafi :::: taaskss',tasks)
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTask, setCurrentTask] = useState<ITask | null>(null);
  const deleteTaskMutation = useDeleteTask();


  const { data: user } = useQuery<IUser>({
    queryKey: ["authUser"],
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
  
  const userId = user?._id;

  useEffect(() => {
    if (data?.data) {
      setTasks(data.data); // Update tasks with fetched data
    }
  }, [data]);


    useEffect(() => {
    // When a new task is added
    socket.on("taskAdded", (newTask: ITask) => {
      // Only update if the current user is assignee or creator of the task
      const isUserInvolved = 
        newTask.createdBy === userId || 
        newTask.assignedTo?.some(user => user._id === userId) 
      
      if (isUserInvolved) {
        // Refresh the tasks query data
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        toast.success(`New task added: ${newTask.title}`);
      }
    });

    // When a task is updated
    socket.on("taskUpdated", (updatedTask: ITask) => {
      // Only update if the current user is assignee or creator of the task
      const isUserInvolved = 
        updatedTask.createdBy === userId || 
        updatedTask.assignedTo?.some(user => user._id === userId) 
      
      if (isUserInvolved) {
        // Update the local state immediately for a smoother UI experience
        setTasks(currentTasks => 
          currentTasks.map(task => 
            task._id === updatedTask._id ? updatedTask : task
          )
        );
        
        // Also refresh the query data to ensure consistency
        queryClient.invalidateQueries({ queryKey: ["tasks"] });
        toast.info(`Task updated: ${updatedTask.title}`);
      }
    });

    // When a task is deleted
    socket.on("taskDeleted", (data: { taskId: string }) => {
      const deletedTaskId = data.taskId;
      
      // Update the local state immediately
      setTasks(currentTasks => 
        currentTasks.filter(task => task._id !== deletedTaskId)
      );
      
      // Also refresh the query data
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.info(`A task has been deleted`);
    });

    return () => {
      // Clean up listeners
      socket.off("taskAdded");
      socket.off("taskUpdated");
      socket.off("taskDeleted");
    };
  }, [userId, queryClient]);
  

  console.log('This is the data from the backend:', data);

  // Remove a task
  const deleteTask = (taskId: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteTaskMutation.mutate(taskId);
    }
  };

  const handleEditClick = (task: ITask) => {
    const formattedTask: ITask = {
      ...task,
      assignedTo: task.assignedTo || [], // Ensure assignedTo is an array
    };
    setCurrentTask(formattedTask);
    setShowEditModal(true);
  };

  // Priority badges with appropriate colors
  const priorityColors: Record<string, string> = {
    low: "bg-blue-100 text-blue-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800"
  };

  // Status badges with appropriate colors
  const statusColors: Record<string, string> = {
    todo: "bg-gray-100 text-gray-800",
    inProgress: "bg-purple-100 text-purple-800",
    review: "bg-teal-100 text-teal-800",
    completed: "bg-green-100 text-green-800"
  };

  return (
    <>
      <Layout>
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900/70 backdrop-blur-md z-50 transition-opacity duration-300">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        <div className="bg-gray-50 min-h-screen p-6">
          <div className="max-w-6xl mx-auto">
            {/* Header with add task button */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
                <p className="text-gray-500 mt-1">Manage your project tasks efficiently</p>
              </div>
              <button 
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center shadow-md transition-all duration-200"
                onClick={() => setShowAddModal(true)}
              >
                <Plus size={18} className="mr-1" />
                Add Task
              </button>
            </div>

            {/* Task List */}
            {tasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {tasks.map(task => (
                  <div 
                    key={task._id} 
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-100"
                  >
                    {/* Task header with priority indicator */}
                    <div className="p-5 pb-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${priorityColors[task.priority || 'low']}`}>
                            {task.priority ? task.priority.charAt(0).toUpperCase() + task.priority.slice(1) : 'Low'}
                          </span>
                          <span className={`ml-2 text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusColors[task.status || 'todo']}`}>
                            {task.status === 'inProgress' ? 'In Progress' : task.status || 'To Do'}
                          </span>
                        </div>
                        <div className="flex space-x-1">
                          <button className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                            onClick={() => handleEditClick(task)}
                          >
                            <Pencil size={16} className="text-gray-500" />
                          </button>
                          <button 
                            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                            onClick={() => deleteTask(task._id)}
                          >
                            <Trash2 size={16} className="text-gray-500" />
                          </button>
                        </div>
                      </div>
                      <h3 className="font-semibold text-lg text-gray-900 mb-2">{task.title}</h3>
                      {task.project && typeof task.project === 'object' && task.project.name && (
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <Briefcase size={16} className="mr-1" />
                          <span>{task.project.name}</span>
                        </div>
                      )}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{task.description || 'No description available'}</p>
                    </div>

                    {/* Task details */}
                    <div className="px-5 pb-5">
                      <div className="flex items-center text-sm text-gray-500 mb-3">
                        <Clock size={16} className="mr-1" />
                        <span>{task.timeEstimate ? `${task.timeEstimate} hours` : 'No estimate'}</span>
                      </div>
                      
                      <div className="flex items-center mb-4">
                        <div className="flex flex-wrap gap-1 text-xs">
                          {task.tags?.map(tag => (
                            <span key={tag} className="bg-gray-100 text-gray-700 rounded-full px-2.5 py-1 flex items-center">
                              <Tag size={12} className="mr-1" />
                              {tag}
                            </span>
                          )) || []}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                        <div className="flex items-center">
                          {task.assignedTo?.length ? (
                            <>
                              {task.assignedTo.map((user, index) => (
                                <div key={index} className="flex items-center mr-2">
                                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center font-medium text-indigo-700">
                                    {user.name?.charAt(0).toUpperCase()}
                                  </div>
                                  <span className="ml-2 text-sm text-gray-700">{user.name}</span>
                                </div>
                              ))}
                            </>
                          ) : (
                            <span className="text-gray-500 text-sm">Unassigned</span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {task.createdAt ? new Date(task.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center mt-8">No tasks available</p>
            )}
          </div>
        </div>
      </Layout>

      {showAddModal && <AddTask onClose={() => setShowAddModal(false)} />}
      {showEditModal && currentTask && <EditTask onClose={() => setShowEditModal(false)} task={currentTask} />}
    </>
  );
};

export default TaskManagement;
