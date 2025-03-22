import React, { useState, useEffect } from 'react';
import 'react-datepicker/dist/react-datepicker.css';
import { X, Clock, Tag, Plus, Check } from 'lucide-react';
import { toast } from 'react-toastify';
import {  IProject, ITask } from '../../types/task.types';
import useEditTask from '../../hooks/useEditTask';
import useProjects from '../../hooks/useProject';
import { validateEditTask } from '../../validator/validateEdit';

interface ProjectMember {
  _id: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
  role: string;
}


interface EditTaskProps {
  task: ITask;
  onClose: () => void;
}

const EditTask: React.FC<EditTaskProps> = ({ task, onClose }) => {
  const editTaskMutation = useEditTask();
  
  // Properly initialize all form fields from task data
  const [formData, setFormData] = useState({
    title: task.title || '',
    description: task.description || '',
    project: typeof task.project === 'object' ? task.project._id : task.project || '',
    assignedTo: task.assignedTo ? task.assignedTo.map((user) => user._id) : [], // Map user objects to IDs
    status: task.status || 'backlog',
    priority: task.priority || 'low',
    timeEstimate: task.timeEstimate || 0,
    tags: task.tags || [],
    dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
  });

  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  // Fetch projects
  const {
    data: projectsData,
    isLoading: projectsLoading,
  } = useProjects({
    page: 1,
    limit: 100,
    userId: task.createdBy // Add optional chaining for safety
  });

  // Store members of the selected project
  const [projectMembers, setProjectMembers] = useState<{ id: string; name: string }[]>([]);

  // When project selection changes, update available members
  useEffect(() => {
    if (formData.project && projectsData?.data) {
      const selectedProject = projectsData.data.find(
        (project: IProject) => project._id === formData.project
      );

      if (selectedProject && selectedProject.members) {
        const members = selectedProject.members.map((member: ProjectMember) => ({
          id: member.user._id,
          name: member.user.name,
        }));
        setProjectMembers(members);
      } else {
        setProjectMembers([]);
      }
    }
  }, [formData.project, projectsData]);

  // Set initial project members when component mounts
  useEffect(() => {
    if (projectsData?.data && formData.project) {
      const selectedProject = projectsData.data.find(
        (project: IProject) => project._id === formData.project
      );

      if (selectedProject && selectedProject.members) {
        const members = selectedProject.members.map((member: ProjectMember) => ({
          id: member.user._id,
          name: member.user.name,
        }));
        setProjectMembers(members);
      }
    }
  }, [projectsData]);

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle multi-select change
  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  const selectedUserIds = Array.from(e.target.selectedOptions, (option) => option.value);
  setFormData((prev) => ({ ...prev, assignedTo: selectedUserIds })); // Ensure it's a string[]
};

  // Handle tag add
  const handleTagAdd = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      setTagInput('');
    }
  };

  // Handle tag remove
  const handleTagRemove = (tag: string) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    // Transform the array of user IDs to required IAssignedUser objects
    const assignedToUsers = formData.assignedTo.map(userId => {
      // Find the complete user data from projectMembers
      const userInfo = projectMembers.find(member => member.id === userId);
      
      // Return in IAssignedUser format
      return {
        _id: userId,
        name: userInfo?.name || "",
        email: "" // If you have email data, include it here
      };
    });

    const updatedData = {
      title: formData.title,
      description: formData.description,
      project: formData.project,
      assignedTo: assignedToUsers, // Use the transformed user objects
      status: formData.status,
      priority: formData.priority,
      timeEstimate: formData.timeEstimate,
      tags: formData.tags,
      dueDate: formData.dueDate,
    };
    

    const errors = validateEditTask(updatedData);
      if (errors) {
        setFormErrors(errors);
        setIsSubmitting(false);
        return;
      }

      // Clear errors if validation passes
      setFormErrors({});

      // Using the mutation with onSuccess callback
      editTaskMutation.mutate(
        {
          taskId: task._id,
          updatedData,
        },
        {
          onSuccess: () => {
            toast.success('Task updated successfully');
            onClose(); // Close the modal on success
          },
          onSettled: () => {
            setIsSubmitting(false);
          },
        }
      );
    } catch (error) {
      console.error('Error updating task:', error);
      setIsSubmitting(false);
    }
  };

  // Status and priority color mappings
  const statusColors = {
    backlog: 'bg-gray-100 text-gray-800 border-gray-200',
    todo: 'bg-blue-50 text-blue-700 border-blue-200',
    inProgress: 'bg-purple-50 text-purple-700 border-purple-200',
    review: 'bg-amber-50 text-amber-700 border-amber-200',
    done: 'bg-green-50 text-green-700 border-green-200',
  };

  const priorityColors = {
    low: 'bg-blue-50 text-blue-700 border-blue-200',
    medium: 'bg-amber-50 text-amber-700 border-amber-200',
    high: 'bg-orange-50 text-orange-700 border-orange-200',
    urgent: 'bg-red-50 text-red-700 border-red-200',
  };

  // Format status and priority for display
  const formatStatusName = (status: string) => {
    switch (status) {
      case 'inProgress':
        return 'In Progress';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/75 backdrop-blur-sm z-50 px-4 transition-all duration-300">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg md:max-w-2xl flex flex-col max-h-[90vh] border border-gray-100 animate-fadeIn">
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <h2 className="text-xl font-bold text-gray-800">Edit Task</h2>
            <div className="flex items-center space-x-2">
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                  statusColors[formData.status as keyof typeof statusColors]
                }`}
              >
                {formatStatusName(formData.status || '')}
              </span>
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                  priorityColors[formData.priority as keyof typeof priorityColors]
                }`}
              >
                {formData.priority?.charAt(0).toUpperCase() + formData.priority?.slice(1) || ''}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors duration-200"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 custom-scrollbar">
          {editTaskMutation.isPending ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
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
                  {formErrors.title && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.title}</p>
                  )}
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                    rows={3}
                    placeholder="Enter task description"
                  />
                  {formErrors.description && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.description}</p>
                  )}
                </div>

                {/* Project */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project *</label>
                  <div className="relative">
                    <select
                      name="project"
                      value={formData.project}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none transition-colors duration-200"
                      required
                    >
                      <option value="">Select Project</option>
                      {projectsData?.data?.map((project: IProject) => (
                        <option key={project._id} value={project._id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                   {formErrors.project && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.project}</p>
                  )}
                </div>

                {/* Assigned To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                  <select
                    multiple
                    name="assignedTo"
                    value={formData.assignedTo || []}
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
                  {formErrors.assignedTo && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.assignedTo}</p>
                  )}
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
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                    {formErrors.status  && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.status }</p>
                  )}
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
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 9l-7 7-7-7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  {formErrors.priority   && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.priority  }</p>
                  )}
                </div>

                {/* Due Date & Time Estimate */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Time Estimate (hours)</label>
                    <div className="relative">
                      <input
                        type="number"
                        name="timeEstimate"
                        value={formData.timeEstimate || ''}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        min="0"
                        step="0.5"
                        placeholder="0.0"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <Clock size={18} />
                      </div>
                    </div>
                  </div>
                  {formErrors.timeEstimate    && (
                    <p className="mt-1 text-xs text-red-500">{formErrors.timeEstimate   }</p>
                  )}
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
                  <div className="flex items-center space-x-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200"
                        placeholder="Add a tag"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleTagAdd();
                          }
                        }}
                      />
                      {formErrors.tags    && (
                      <p className="mt-1 text-xs text-red-500">{formErrors.tags   }</p>
                    )}
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                        <Tag size={18} />
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleTagAdd}
                      className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200 flex items-center"
                    >
                      <Plus size={18} className="mr-1" />
                      Add
                    </button>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {formData.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm flex items-center border border-blue-200"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleTagRemove(tag)}
                          className="ml-1.5 text-blue-500 hover:text-blue-700 focus:outline-none"
                          aria-label={`Remove ${tag} tag`}
                        >
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                    {formData.tags?.length === 0 && (
                      <span className="text-sm text-gray-400 italic">No tags added</span>
                    )}
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex flex-col sm:flex-row sm:justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-3 border border-gray-200 rounded-lg text-gray-700 font-medium hover:bg-gray-50 focus:ring-2 focus:ring-gray-200 focus:ring-offset-2 transition-colors duration-200 order-2 sm:order-1 flex items-center justify-center"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting || projectsLoading}
            className={`w-full sm:w-auto px-5 py-3 bg-blue-600 text-white rounded-lg font-medium transition-colors duration-200 order-1 sm:order-2 flex items-center justify-center space-x-2
              ${
                isSubmitting || projectsLoading
                  ? 'opacity-70 cursor-not-allowed'
                  : 'hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }`}
          >
            {isSubmitting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Updating...</span>
              </>
            ) : (
              <>
                <Check size={18} />
                <span>Update Task</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTask;