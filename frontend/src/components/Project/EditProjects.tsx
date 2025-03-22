import { useState } from "react";
import { IProject } from "../../types/task.types";
import useEditProject from "../../hooks/useEditProject";
import { toast } from "react-toastify";
import { FiX, FiPlus } from 'react-icons/fi';
import useUser from '../../hooks/useUser';
import { validateProject } from "../../validator/projectValidate";

// Updated interface for member structure
export interface IMember {
  _id?: string;
  role: "owner" | "editor" | "viewer";
  user: {
    _id: string;
    name: string;
    email: string;
  } | string;
}

// Define the response structure from the API
interface UserResponse {
  message: string;
  users: Array<{
    _id: string;
    name: string;
    email: string;
    ProfilePic?: string;
  }>;
}

interface User {
  id: string;
  name: string;
  email: string;
  ProfilePic: string;
}

// Edit Project Modal Component
interface EditProjectModalProps {
  project: IProject;
  onClose: () => void;
}

const EditProjectModal: React.FC<EditProjectModalProps> = ({ project, onClose }) => {
  const [projectName, setProjectName] = useState(project.name);
  const [projectDescription, setProjectDescription] = useState(project.description || "");
  const [projectStatus, setProjectStatus] = useState(project.status);
  
  // Initialize members properly with the correct structure
  const [projectMembers, setProjectMembers] = useState<IMember[]>([...project.members]);
  
  // Add member form state
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState<"owner" | "editor" | "viewer">("viewer");
  
  // Fetch users data
  const { data, isLoading: isLoadingUsers } = useUser();
  const { mutate: editProject, isPending: isLoading } = useEditProject();
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  
  // Extract users array from the response
  const userResponse = data as UserResponse | undefined;
  const usersList = userResponse?.users || [];
  
  // Create a record of users by their ID
  const availableUsers: Record<string, User> = {};
  
  // Fill the availableUsers record
  usersList.forEach(user => {
    availableUsers[user._id] = {
      id: user._id,
      name: user.name,
      email: user.email,
      ProfilePic: user.ProfilePic || ""
    };
  });
  
  // Get existing member IDs
  const existingMemberIds = projectMembers.map(member => 
    typeof member.user === 'object' ? member.user._id : member.user
  );
  
  // Filter out users who are already added as members
  const filteredUsers = usersList.filter(
    (user) => !existingMemberIds.includes(user._id)
  );

  // Handler for adding new member
  const handleAddMember = () => {
    if (selectedUser && selectedRole) {
      setProjectMembers([...projectMembers, { user: selectedUser, role: selectedRole }]);
      setSelectedUser("");
      setSelectedRole("viewer");
      setShowMemberForm(false);
    }
  };


  const handleRemoveMember = (index: number) => {
    const updatedMembers = projectMembers.filter((_, i) => i !== index);
    setProjectMembers(updatedMembers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prepare data for the API
    const updatedProject: IProject = {
      ...project,
      name: projectName,
      description: projectDescription,
      status: projectStatus,
      members: projectMembers.map(member => {
        // For existing members with complete user data
        if (typeof member.user === 'object') {
          return {
            _id: member._id,
            role: member.role,
            user: member.user._id
          };
        }
        // For new members
        return {
          role: member.role,
          user: member.user
        };
      }),
    };

    const errors = validateProject(updatedProject);
        if (errors) {
          setFormErrors(errors);
          return;
    }
    
    setFormErrors({});

    editProject(
      { projectId: project._id, updatedData: updatedProject },
      {
        onSuccess: () => {
          toast.success("Project updated successfully!");
          onClose();
        },
        onError: (error) => {
          console.error(error);
          toast.error("Failed to update project. Please try again.");
        },
      }
    );
  };

  // Check if a member is an owner
  const isOwnerMember = (member: IMember) => {
    return member.role === "owner";
  };

  return (
    <>
    {isLoading || isLoadingUsers &&(
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-50 transition-opacity duration-300">
          <div className="loader"></div>
        </div>
    )}
    
    <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-50 transition-opacity duration-300">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Edit Project</h2>
        </div>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name *</label>
            <input
              type="text"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              required
            />
             {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 h-24 resize-none"
            />
             {formErrors.description && <p className="text-xs text-red-500 mt-1">{formErrors.description}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={projectStatus}
              onChange={(e) => setProjectStatus(e.target.value as "active" | "completed" | "archived")}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Project Members Section */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Team Members
              </label>
              {!showMemberForm && (
                <button
                  type="button"
                  onClick={() => setShowMemberForm(true)}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  <FiPlus size={14} />
                  Add Member
                </button>
              )}
            </div>

            {/* List of current members */}
            <div className="space-y-2 mb-3">
              {projectMembers.map((member, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      {typeof member.user === 'object' 
                        ? member.user.name.charAt(0) 
                        : availableUsers[member.user]?.name?.charAt(0) || '?'}
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        {typeof member.user === 'object' 
                          ? member.user.name 
                          : availableUsers[member.user]?.name || 'Unknown User'}
                      </div>
                      <div className="text-xs text-gray-500">{member.role}</div>
                    </div>
                  </div>
                  {!isOwnerMember(member) && (
                    <button
                      type="button"
                      onClick={() => handleRemoveMember(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <FiX size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Form to add new members */}
            {showMemberForm && (
              <div className="border border-gray-200 rounded-md p-3 bg-gray-50 mb-3">
                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Select User
                  </label>
                  <select
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a user</option>
                    {filteredUsers.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.name} ({user.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Select Role
                  </label>
                  <select
                    value={selectedRole}
                    onChange={(e) => setSelectedRole(e.target.value as "owner" | "editor" | "viewer")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="editor">Editor</option>
                    <option value="viewer">Viewer</option>
                  </select>
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowMemberForm(false)}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleAddMember}
                    disabled={!selectedUser}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
                  >
                    Add
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              disabled={!projectName.trim() || isLoading}
            >
              {isLoading ? "Updating..." : "Update Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default EditProjectModal;