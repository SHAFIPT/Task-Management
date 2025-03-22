import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import 'react-datepicker/dist/react-datepicker.css';
import { IAssignedUser, IProject, ITask } from '../../types/task.types';
import useProjects from '../../hooks/useProject';
import useAddTask, { AddTaskParams } from '../../hooks/useAddTask';
import "react-datepicker/dist/react-datepicker.css"; 
import axios from 'axios';
import '../../pages/Auth/loadingBody.css'
import { toast } from 'react-toastify';

interface ProjectMember {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  role: string;
}

export interface ProjectData {
  _id: string;
  id: string;
  name: string;
  members: ProjectMember[];
}

interface IUser {
  _id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}



interface AddTaskProps {
  onClose: () => void;
}

const AddTask: React.FC<AddTaskProps> = ({ onClose }) => {
  // Get current user
  const { data: user } = useQuery<IUser>({
    queryKey: ["authUser"],
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });

  const userId = user?._id;
  
  // State for the form
  const [formData, setFormData] = useState<Partial<ITask>>({
    title: '',
    description: '',
    project: '',
    assignedTo: [],
    status: 'backlog',
    priority: 'medium',
    timeEstimate: undefined,
    tags: [],
  });
  
  // State for tag input
  const [tagInput, setTagInput] = useState('');
  
  // Fetch projects
  const { 
    data: projectsData, 
    isLoading: projectsLoading
  } = useProjects({
    page: 1,
    limit: 100,
    userId
  });

  console.log('thsi si eht projectsData :::',projectsData)
  
  // Store members of the selected project
  const [projectMembers, setProjectMembers] = useState<{ id: string, name: string }[]>([]);
  
  // Setup addTask mutation
  const addTaskMutation = useAddTask();
  
  // When project selection changes, update available members
  useEffect(() => {
  if (formData.project && projectsData?.data) {
    const selectedProject = projectsData.data.find((project: ProjectData) => 
      project._id === formData.project || project.id === formData.project
    );

    if (selectedProject && selectedProject.members) {
       const members = selectedProject.members.map((member: ProjectMember) => ({
        id: member.user._id,
        name: member.user.name
      }));
      
      setProjectMembers(members);
    } else {
      setProjectMembers([]);
    }
  }
}, [formData.project, projectsData]);

  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedUsers = Array.from(e.target.selectedOptions, option => {
    const user = projectMembers.find(member => member.id === option.value);
    return user ? { _id: user.id, name: user.name, email: "" } : null;
  }).filter(Boolean) as IAssignedUser[]; // Ensure only valid user objects are stored

  setFormData(prev => ({ ...prev, assignedTo: selectedUsers }));
};
  
  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({ 
        ...prev, 
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };
  
  const handleTagRemove = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Create a new task object with the form data
      const newTask: AddTaskParams = {
        title: formData.title || '',
        description: formData.description,
        project: typeof formData.project === "object" ? formData.project._id : formData.project || '',
        assignedTo: formData.assignedTo?.map(user => typeof user === 'object' ? user._id : user) || [],
        status: formData.status as ITask['status'] || 'backlog',
        priority: formData.priority as ITask['priority'] || 'medium',
        timeEstimate: formData.timeEstimate,
        tags: formData.tags || [],
        createdBy: userId || ''
      };
      
      // Using the mutation with onSuccess callback
      addTaskMutation.mutate(newTask, {
        onSuccess: () => {
          toast.success('Task added succesfuly ')
          onClose(); // Close the modal on success
        },
      });
    } catch (error) {
      console.error("Error creating task:", error);
      // Add more detailed error logging
      if (axios.isAxiosError(error)) {
        console.error("Response status:", error.response?.status);
        console.error("Response data:", error.response?.data);
      }
    }
  };
  
  return (
<>
  {projectsLoading && (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/70 backdrop-blur-md z-50 transition-opacity duration-300">
      <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  )}
    
  <div className="fixed inset-0 flex items-center justify-center bg-gray-900/70 backdrop-blur-md z-50 px-4 transition-all duration-300">
    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg md:max-w-2xl flex flex-col max-h-[90vh] border border-gray-100">
      
      {/* Header (Fixed) */}
      <div className="p-6 flex justify-between items-center border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-800">Add New Task</h2>
        <button 
          onClick={onClose} 
          className="text-gray-500 hover:text-gray-900 hover:bg-gray-100 p-2 rounded-full transition-colors duration-200"
          aria-label="Close modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="overflow-y-auto flex-1 custom-scrollbar">
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                required
                placeholder="Enter task title"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                rows={3}
                placeholder="Enter task description"
              />
            </div>

            {/* Project */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project *</label>
              <div className="relative">
                <select
                  name="project"
                  value={typeof formData.project === "object" ? formData.project._id : formData.project || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors duration-200"
                  required
                >
                  <option value="">Select Project</option>
                  {projectsData?.data?.map((project : IProject) => (
                    <option key={project._id || project._id} value={project._id || project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Assigned To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
              <select
                multiple
                name="assignedTo"
                value={formData.assignedTo?.map(user => typeof user === 'object' ? user._id : user) || []}
                onChange={handleMultiSelectChange}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                size={3}
              >
                {projectMembers.map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple members</p>
            </div>

            {/* Status & Priority */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="relative">
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors duration-200"
                  >
                    <option value="backlog">Backlog</option>
                    <option value="todo">To Do</option>
                    <option value="inProgress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="done">Done</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <div className="relative">
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors duration-200"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Due Date & Time Estimate */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Estimate (hours)</label>
                <input
                  type="number"
                  name="timeEstimate"
                  value={formData.timeEstimate || ""}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  min="0"
                  step="0.5"
                  placeholder="0.0"
                />
              </div>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                  placeholder="Add a tag"
                />
                <button
                  type="button"
                  onClick={handleTagAdd}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
                >
                  Add
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.tags?.map((tag) => (
                  <span key={tag} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center">
                    {tag}
                    <button 
                      type="button" 
                      onClick={() => handleTagRemove(tag)} 
                      className="ml-1.5 text-blue-500 hover:text-blue-700 focus:outline-none"
                      aria-label={`Remove ${tag} tag`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Footer (Fixed) */}
      <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row sm:justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="w-full sm:w-auto px-5 py-3 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-colors duration-200 order-2 sm:order-1"
        >
          Cancel
        </button>
        <button
          type="submit"
          onClick={handleSubmit}
          className="w-full sm:w-auto px-5 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 order-1 sm:order-2"
        >
          Create Task
        </button>
      </div>
    </div>
  </div>
</>
  );
};

export default AddTask;