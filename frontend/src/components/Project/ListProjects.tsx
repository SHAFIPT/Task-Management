import React, { useEffect, useState } from 'react';
import Layout from '../Commen/Layout';
import { FiPlus, FiEdit2, FiTrash2, FiUsers, FiArchive, FiCheck } from 'react-icons/fi';
import AddProjectModal from './AddProject';
import EditProjectModal from './EditProjects';
import { IProject } from '../../types/task.types';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import useProjects from '../../hooks/useProject';
import { toast } from 'react-toastify';
import { AxiosError } from 'axios';
import '../../pages/Auth/loadingBody.css'
import useDeleteProject from '../../hooks/useDeleteProject';
import useEditProject from '../../hooks/useEditProject';
import socket from '../../utils/socket';

  interface IUser {
    _id: string;
    name: string;
    email: string;
    role?: string;
    avatar?: string;
  }

  interface ErrorResponse {
    message: string;
  }

  const ListProjects = () => {
    const [projects, setProjects] = useState<IProject[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const deleteProjectMutation = useDeleteProject();
    const [currentProject, setCurrentProject] = useState<IProject | null>(null);
    const [filter, setFilter] = useState("all");
    const { mutate: editProject } = useEditProject();
    const queryClient = useQueryClient(); 
    
    const { data: user } = useQuery<IUser>({
      queryKey: ["authUser"],
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    });

    const userId = user?._id
    
    const { 
      data: fetchedProjects, 
      isLoading, 
      error, 
      isSuccess,
      isError 
    } = useProjects({
      page: 1,
      limit: 10,
      filter,
      userId
    });

    console.log('ths isi the data :::: ',fetchedProjects)

    useEffect(() => {
      if (isSuccess && fetchedProjects) {
        setProjects(fetchedProjects.data || []);
        // toast.success("Projects loaded successfully");
      }
    }, [isSuccess, fetchedProjects]);
    
    useEffect(() => {
      if (isError && error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const errorMessage = axiosError.response?.data?.message || "Failed to load projects";
        toast.error(errorMessage);
      }
    }, [isError, error]);

      // NEW: Socket event listeners for real-time updates
    useEffect(() => {
      // When a new project is added
      socket.on("projectAdded", (newProject: IProject) => {
        // Only update if the current user is a member or creator of the project
        const isUserInvolved = 
          newProject.createdBy === userId || 
          newProject.members?.some(member => 
            (typeof member.user === 'string' && member.user === userId) ||
            (typeof member.user === 'object' && member.user._id === userId)
          );
        
        if (isUserInvolved) {
          // Refresh the projects query data
          queryClient.invalidateQueries({ queryKey: ["projects"] });
          toast.success(`New project added: ${newProject.name}`);
        }
      });

      // When a project is updated
      socket.on("projectUpdated", (updatedProject: IProject) => {
        // Only update if the current user is a member or creator of the project
        const isUserInvolved = 
          updatedProject.createdBy === userId || 
          updatedProject.members?.some(member => 
            (typeof member.user === 'string' && member.user === userId) ||
            (typeof member.user === 'object' && member.user._id === userId)
          );
        
        if (isUserInvolved) {
          // Update the local state immediately for a smoother UI experience
          setProjects(currentProjects => 
            currentProjects.map(project => 
              project._id === updatedProject._id ? updatedProject : project
            )
          );
          
          // Also refresh the query data to ensure consistency
          queryClient.invalidateQueries({ queryKey: ["projects"] });
          toast.info(`Project updated: ${updatedProject.name}`);
        }
      });

      // When a project is deleted
      socket.on("projectDeleted", (deletedProjectId: string) => {
        // Update the local state immediately
        setProjects(currentProjects => 
          currentProjects.filter(project => project._id !== deletedProjectId)
        );
        
        // Also refresh the query data
        queryClient.invalidateQueries({ queryKey: ["projects"] });
        toast.info(`A project has been deleted`);
      });

      return () => {
        // Clean up listeners
        socket.off("projectAdded");
        socket.off("projectUpdated");
        socket.off("projectDeleted");
      };
    }, [userId, queryClient]);

    
    // Filter projects based on status
    const filteredProjects: IProject[] = filter === "all" 
    ? projects 
    : projects.filter((project: IProject) => project.status === filter);


  // Handle opening the edit modal
  const handleEditClick = (project: IProject) => {
    setCurrentProject(project);
    setShowEditModal(true);
  };

  // Handle deleting a project
   const handleDeleteProject = (projectId: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      deleteProjectMutation.mutate(projectId);
    }
  };

  // Handle changing project status
  const handleStatusChange = (projectId: string, newStatus: "active" | "completed" | "archived") => {
    // Find the project being updated
    const projectToUpdate = projects.find(project => project._id === projectId);
    if (!projectToUpdate) return;

    // Create updated project object
    const updatedProject = { ...projectToUpdate, status: newStatus };

    editProject(
      { projectId, updatedData: updatedProject },
      {
        onSuccess: () => {
          toast.success(`Project marked as ${newStatus}`);
        },
        onError: (error) => {
          console.error(error);
          toast.error("Failed to update project status. Please try again.");
        },
      }
    );
};

  return (
    <Layout>
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-50 transition-opacity duration-300">
          <div className="loader"></div>
        </div>
      )}
      <div className="w-full px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
            <p className="text-gray-600 mt-1">Manage your team projects</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-4">
            {/* Filter Buttons */}
            <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
              <button 
                onClick={() => setFilter("all")}
                className={`px-3 py-1 rounded-md text-sm ${filter === "all" ? "bg-white shadow-sm" : "text-gray-600"}`}
              >
                All
              </button>
              <button 
                onClick={() => setFilter("active")}
                className={`px-3 py-1 rounded-md text-sm ${filter === "active" ? "bg-white shadow-sm" : "text-gray-600"}`}
              >
                Active
              </button>
              <button 
                onClick={() => setFilter("completed")}
                className={`px-3 py-1 rounded-md text-sm ${filter === "completed" ? "bg-white shadow-sm" : "text-gray-600"}`}
              >
                Completed
              </button>
              <button 
                onClick={() => setFilter("archived")}
                className={`px-3 py-1 rounded-md text-sm ${filter === "archived" ? "bg-white shadow-sm" : "text-gray-600"}`}
              >
                Archived
              </button>
            </div>
            
            {/* Add Project Button */}
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
            >
              <FiPlus size={16} />
              <span>Add Project</span>
            </button>
          </div>
        </div>
        
        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <div 
                key={project._id} 
                className="bg-white rounded-lg shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Project Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex justify-between items-start">
                    <h2 className="font-bold text-lg text-gray-800 mb-2">{project.name}</h2>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleEditClick(project)}
                        className="text-gray-500 hover:text-blue-600 cursor-pointer"
                      >
                        <FiEdit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteProject(project._id)}
                        className="text-gray-500 hover:text-red-600 cursor-pointer"
                      >
                        <FiTrash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  {/* Project Status */}
                  <div className="flex items-center gap-2 mb-2">
                    <span 
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        project.status === "active" ? "bg-green-100 text-green-800" : 
                        project.status === "completed" ? "bg-blue-100 text-blue-800" : 
                        "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                    </span>
                    <span className="text-xs text-gray-500">
                      Created {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                
                {/* Project Body */}
                <div className="p-4">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>
                  
                  {/* Project Members */}
                  <div className="mb-4">
                    <div className="flex items-center mb-2">
                      <FiUsers size={16} className="text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">Team Members</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.members && project.members.map((member, index) => (
                        <div key={index} className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-md">
                          <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-medium">
                            {member.user && typeof member.user === 'object' && member.user.name ? 
                              member.user.name.charAt(0) : 
                              '?'}
                          </div>
                          <span className="text-xs text-gray-700">
                            {member.role || 'member'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Project Actions */}
                  <div className="flex justify-between border-t border-gray-100 pt-3 mt-2">
                    {project.status === "active" && (
                      <button 
                        onClick={() => handleStatusChange(project._id, "completed")}
                        className="text-sm flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      >
                        <FiCheck size={14} />
                        Mark as Complete
                      </button>
                    )}
                    {project.status !== "archived" && (
                      <button 
                        onClick={() => handleStatusChange(project._id, "archived")}
                        className="text-sm flex items-center gap-1 text-gray-600 hover:text-gray-800 ml-auto"
                      >
                        <FiArchive size={14} />
                        Archive
                      </button>
                    )}
                    {project.status === "archived" && (
                      <button 
                        onClick={() => handleStatusChange(project._id, "active")}
                        className="text-sm flex items-center gap-1 text-green-600 hover:text-green-800"
                      >
                        Restore
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-12 bg-gray-50 rounded-lg">
              <div className="text-gray-500">No projects found</div>
              <button 
                onClick={() => setShowAddModal(true)}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors mx-auto"
              >
                <FiPlus size={16} />
                <span>Create your first project</span>
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Add Project Modal */}
      {showAddModal && (
        <AddProjectModal 
          onClose={() => setShowAddModal(false)} 
          currentUserId={user?._id || ""}
        />
      )}
      
      {/* Edit Project Modal */}
      {showEditModal && currentProject && (
        <EditProjectModal 
          project={currentProject}
          onClose={() => setShowEditModal(false)} 
        />
      )}
    </Layout>
  );
};

export default ListProjects;