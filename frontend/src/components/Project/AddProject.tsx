import { v4 as uuidv4 } from 'uuid';
import { IProject } from "../../types/task.types";
import { useState } from 'react';
import { FiX, FiPlus } from 'react-icons/fi';
import useAddProject from '../../hooks/useAddProject';
import '../../pages/Auth/loadingBody.css'
import useUser from '../../hooks/useUser';
import { validateProject } from '../../validator/projectValidate';

interface AddProjectModalProps {
  onClose: () => void;
  currentUserId: string;
}

// Define a structure for the available users
interface User {
  id: string;
  name: string;
  email: string;
  ProfilePic: string;
}

// Define the response structure from the API
interface UserResponse {
  message: string;
  users: Array<{
    _id: string;
    name: string;
    email: string;
    ProfilePic: string;
  }>;
}

// Define a type for role values that matches IProject's member roles
type ProjectRole = "owner" | "editor" | "viewer";

const AddProjectModal: React.FC<AddProjectModalProps> = ({ onClose, currentUserId }) => {
  const { data, isLoading } = useUser();  
  const [projectName, setProjectName] = useState("");
  const addProjectMutation = useAddProject();
  const [projectDescription, setProjectDescription] = useState("");
  const [members, setMembers] = useState<Array<{ user: string; role: ProjectRole }>>([
    { user: currentUserId, role: "owner" }
  ]);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [selectedRole, setSelectedRole] = useState<ProjectRole>("viewer");
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
      ProfilePic: user.ProfilePic
    };
  });

  // Filter out users who are already added as members
  const filteredUsers = Object.values(availableUsers).filter(
    (user) => !members.some((member) => member.user === user.id)
  );

  const handleAddMember = () => {
    if (selectedUser && selectedRole) {
      setMembers([...members, { user: selectedUser, role: selectedRole }]);
      setSelectedUser("");
      setSelectedRole("viewer");
      setShowMemberForm(false);
    }
  };

  const handleRemoveMember = (userId: string) => {
    // Don't allow removing the owner
    if (userId === currentUserId) return;
    setMembers(members.filter((member) => member.user !== userId));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Generate a unique project ID
    const projectId = uuidv4();

    // Create new project object with the generated ID
    const newProject: IProject = {
      _id: projectId,
      name: projectName,
      description: projectDescription,
      createdBy: currentUserId,
      members: members,
      status: "active",
      createdAt: new Date().toISOString(),
    };

    const errors = validateProject(newProject);
    console.log('This are teh errros :::',errors)
    if (errors) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});

    addProjectMutation.mutate(newProject, {
      onSuccess: () => {
        onClose(); // Close the modal on success
      },
    });
  };

  return (
    <>
      {addProjectMutation.isPending && isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-50 transition-opacity duration-300">
          <div className="loader"></div>
        </div>
      )}
    
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 backdrop-blur-sm z-50 transition-opacity duration-300">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4">
          <div className="p-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800">Add New Project</h2>
          </div>

          <form onSubmit={handleSubmit} className="p-4">
            <div className="mb-4">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Project Name *
              </label>
              <input
                type="text"
                id="name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
              {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="description"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
              />
               {formErrors.description && <p className="text-xs text-red-500 mt-1">{formErrors.description}</p>}
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
                {members.map((member) => (
                  <div key={member.user} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                        {availableUsers[member.user]?.name?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{availableUsers[member.user]?.name || 'Unknown User'}</div>
                        <div className="text-xs text-gray-500">{member.role}</div>
                      </div>
                    </div>
                    {member.user !== currentUserId && (
                      <button
                        type="button"
                        onClick={() => handleRemoveMember(member.user)}
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
                        <option key={user.id} value={user.id}>
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
                      onChange={(e) => setSelectedRole(e.target.value as ProjectRole)}
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
                disabled={!projectName.trim()}
              >
                Create Project
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProjectModal;