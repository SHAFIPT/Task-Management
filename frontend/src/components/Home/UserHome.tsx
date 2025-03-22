import React, { useState, useEffect } from 'react';
import { 
 Home, Briefcase, Users, CheckSquare, Clock, 
  Repeat, Bell, Menu, ChevronRight, 
   ArrowRight, 
} from 'lucide-react';
import SidebarItem from './SideBar';
import MetricCard from './MetricCard';
import Navbar from '../Commen/NavBaar';
import useProjects from '../../hooks/useProject';
import useTasks from '../../hooks/useTask';

// TypeScript interfaces
interface TaskData {
  _id: string;
  id: string;
  title: string;
  description: string;
  project: ProjectInfo;
  status: string;
  priority: string;
  timeEstimate: number;
  createdAt: string;
  updatedAt: string;
  assignedTo: UserInfo[];
  createdBy: UserInfo;
  tags: string[];
  attachments: string[];
}

interface ProjectInfo {
  _id: string;
  name: string;
}

interface UserInfo {
  _id: string;
  name: string;
  email: string;
}

interface ProjectData {
  _id: string;
  id: string;
  name: string;
  description: string;
  status: string;
  createdBy: UserInfo;
  members: ProjectMember[];
  createdAt: string;
  updatedAt: string;
}

interface ProjectMember {
  _id: string;
  user: UserInfo;
  role: string;
}


interface DraggableTaskProps {
  task: TaskData;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
}

// Draggable Task Component
const DraggableTask: React.FC<DraggableTaskProps> = ({ task, onDragStart }) => {
  // Calculate days remaining
  const dueDate = new Date(task.updatedAt);
  const today = new Date();
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  // Priority color mapping
  const priorityColors = {
    high: 'bg-red-100 text-red-800',
    medium: 'bg-yellow-100 text-yellow-800',
    low: 'bg-green-100 text-green-800'
  };
  
  const priorityColor = priorityColors[task.priority as keyof typeof priorityColors] || 'bg-gray-100 text-gray-800';

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg p-4 cursor-move hover:shadow-md transition-shadow"
      draggable
      onDragStart={(e) => onDragStart(e, task.id)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-gray-800 text-base">{task.title}</h3>
        <div className={`text-xs px-2 py-1 rounded-full ${priorityColor}`}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
        </div>
      </div>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">
            {task.project.name}
          </span>
        </div>
        <div className="text-xs text-gray-500 flex items-center">
          <Clock size={14} className="mr-1" /> 
          {diffDays === 0 ? "Today" : diffDays > 0 ? `${diffDays} days left` : `${Math.abs(diffDays)} days overdue`}
        </div>
      </div>
      {task.assignedTo.length > 0 && (
        <div className="mt-3 flex -space-x-2">
          {task.assignedTo.slice(0, 3).map((user, index) => (
            <div key={index} className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs border-2 border-white">
              {user.name.charAt(0)}
            </div>
          ))}
          {task.assignedTo.length > 3 && (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs border-2 border-white">
              +{task.assignedTo.length - 3}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Project Card Component
const ProjectCard: React.FC<{ project: ProjectData }> = ({ project }) => {
  // Status color mapping
  const statusColors = {
    completed: 'bg-green-100 text-green-800',
    inProgress: 'bg-yellow-100 text-yellow-800',
    planned: 'bg-blue-100 text-blue-800',
    onHold: 'bg-red-100 text-red-800'
  };
  
  const statusColor = statusColors[project.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-800';
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between">
        <h3 className="font-bold text-gray-800">{project.name}</h3>
        <div className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>
          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </div>
      </div>
      <p className="text-sm text-gray-600 mt-2 line-clamp-2">{project.description}</p>
      <div className="mt-4 flex justify-between items-center">
        <div className="flex -space-x-2">
          {project.members.slice(0, 3).map((member, index) => (
            <div key={index} className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs border-2 border-white">
              {member.user.name.charAt(0)}
            </div>
          ))}
          {project.members.length > 3 && (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-xs border-2 border-white">
              +{project.members.length - 3}
            </div>
          )}
        </div>
        <button className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center">
          View <ArrowRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

// Main Dashboard Component
const UserHome: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Fetch tasks and projects data
  const { data: tasksResponse, isLoading: tasksLoading } = useTasks({ page: 1, limit: 10 });
  const { data: projectsResponse, isLoading: projectsLoading } = useProjects({ page: 1, limit: 10 });
  
  const [tasks, setTasks] = useState<TaskData[]>([]);
  const [projects, setProjects] = useState<ProjectData[]>([]);

  useEffect(() => {
    if (tasksResponse && tasksResponse.success) {
      setTasks(tasksResponse.data);
    }
  }, [tasksResponse]);

  useEffect(() => {
    if (projectsResponse && projectsResponse.success) {
      setProjects(projectsResponse.data);
    }
  }, [projectsResponse]);

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetStatus: string) => {
    const taskId = e.dataTransfer.getData('taskId');
    
    // In a real app, you would update the task status via API
    // For now, we'll just update the local state
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: targetStatus } : task
    ));
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  // Calculate task metrics
  const getTaskMetrics = () => {
    const metrics = {
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'inProgress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      dueToday: 0
    };
    
    // Calculate due today
    const today = new Date().toISOString().split('T')[0];
    tasks.forEach(task => {
      const dueDate = new Date(task.updatedAt).toISOString().split('T')[0];
      if (dueDate === today) {
        metrics.dueToday++;
      }
    });
    
    return metrics;
  };

  const metrics = getTaskMetrics();

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-indigo-800 text-white transition-all duration-300 shadow-lg`}>
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <div className="flex items-center justify-center bg-white rounded-lg w-10 h-10 mr-2">
              <span className="text-indigo-800 font-bold text-xl">TM</span>
            </div>
            {sidebarOpen && <span className="font-bold text-xl">TaskMaster</span>}
          </div>
          <button onClick={toggleSidebar} className="text-white p-1 rounded-full hover:bg-indigo-700">
            {sidebarOpen ? <ChevronRight size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <div className="mt-6">
          <nav>
            <SidebarItem icon={<Home size={20} />} text="Home" path="/" expanded={sidebarOpen} />
            <SidebarItem icon={<Briefcase size={20} />} text="Projects" path="/Project-list" expanded={sidebarOpen} />
            <SidebarItem icon={<Users size={20} />} text="Collaborations" path="/collaborations" expanded={sidebarOpen} />
            <SidebarItem icon={<CheckSquare size={20} />} text="Tasks" path="/task-list" expanded={sidebarOpen} />
            <SidebarItem icon={<Clock size={20} />} text="Time Sheets" path="/timesheets" expanded={sidebarOpen} />
            <SidebarItem icon={<Repeat size={20} />} text="Reset Projects" path="/reset-projects" expanded={sidebarOpen} />
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} toggleUserMenu={toggleUserMenu} userMenuOpen={userMenuOpen} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 md:p-6">
          {/* Welcome Section */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Welcome, Ayaan Pt</h1>
            <p className="text-gray-600">Company: ptayaan5@gmail.com</p>
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <MetricCard title="To Do" value={metrics.todo.toString()} icon={<CheckSquare size={24} />} color="bg-blue-500" />
            <MetricCard title="In Progress" value={metrics.inProgress.toString()} icon={<Clock size={24} />} color="bg-yellow-500" />
            <MetricCard title="Completed" value={metrics.completed.toString()} icon={<CheckSquare size={24} />} color="bg-green-500" />
            <MetricCard title="Due Today" value={metrics.dueToday.toString()} icon={<Bell size={24} />} color="bg-red-500" />
          </div>

          {/* Projects Section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">My Projects</h2>
              <a href="/Project-list" className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center">
                View All <ArrowRight size={16} className="ml-1" />
              </a>
            </div>
            
            {projectsLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {projects.slice(0, 3).map(project => (
                  <ProjectCard key={project._id} project={project} />
                ))}
              </div>
            )}
          </div>

          {/* Task Management Section */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">My Tasks</h2>
              <div className="flex space-x-2">
                <button 
                  className={`px-3 py-1 rounded-full text-sm ${activeFilter === 'all' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
                  onClick={() => setActiveFilter('all')}
                >
                  All
                </button>
                <button 
                  className={`px-3 py-1 rounded-full text-sm ${activeFilter === 'todo' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
                  onClick={() => setActiveFilter('todo')}
                >
                  To Do
                </button>
                <button 
                  className={`px-3 py-1 rounded-full text-sm ${activeFilter === 'inProgress' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700'}`}
                  onClick={() => setActiveFilter('inProgress')}
                >
                  In Progress
                </button>
                <a href="/task-list" className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center ml-2">
                  View All <ArrowRight size={16} className="ml-1" />
                </a>
              </div>
            </div>
            
            {tasksLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {tasks
                  .filter(task => activeFilter === 'all' || task.status === activeFilter)
                  .map(task => (
                    <DraggableTask key={task._id} task={task} onDragStart={handleDragStart} />
                  ))
                }
                {tasks.filter(task => activeFilter === 'all' || task.status === activeFilter).length === 0 && (
                  <div className="col-span-full py-10 text-center text-gray-500">
                    No tasks found in this category
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Task Boards */}
          <div className="mt-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Task Boards</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* To Do Column */}
              <div
                className="bg-white rounded-lg shadow-md p-4 h-full"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'todo')}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    To Do
                  </h2>
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium rounded-full px-2 py-1">
                    {tasks.filter(task => task.status === 'todo').length}
                  </span>
                </div>
                <div className="space-y-3">
                  {tasks.filter(task => task.status === 'todo').map(task => (
                    <DraggableTask key={task._id} task={task} onDragStart={handleDragStart} />
                  ))}
                  {tasks.filter(task => task.status === 'todo').length === 0 && (
                    <div className="py-8 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                      No tasks in this column
                    </div>
                  )}
                </div>
              </div>

              {/* In Progress Column */}
              <div
                className="bg-white rounded-lg shadow-md p-4 h-full"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'inProgress')}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    In Progress
                  </h2>
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium rounded-full px-2 py-1">
                    {tasks.filter(task => task.status === 'inProgress').length}
                  </span>
                </div>
                <div className="space-y-3">
                  {tasks.filter(task => task.status === 'inProgress').map(task => (
                    <DraggableTask key={task._id} task={task} onDragStart={handleDragStart} />
                  ))}
                  {tasks.filter(task => task.status === 'inProgress').length === 0 && (
                    <div className="py-8 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                      No tasks in this column
                    </div>
                  )}
                </div>
              </div>

              {/* Completed Column */}
              <div
                className="bg-white rounded-lg shadow-md p-4 h-full"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, 'completed')}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-800 flex items-center">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    Completed
                  </h2>
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium rounded-full px-2 py-1">
                    {tasks.filter(task => task.status === 'completed').length}
                  </span>
                </div>
                <div className="space-y-3">
                  {tasks.filter(task => task.status === 'completed').map(task => (
                    <DraggableTask key={task._id} task={task} onDragStart={handleDragStart} />
                  ))}
                  {tasks.filter(task => task.status === 'completed').length === 0 && (
                    <div className="py-8 text-center text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
                      No tasks in this column
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserHome;