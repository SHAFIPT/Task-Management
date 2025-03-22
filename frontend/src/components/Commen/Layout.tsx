import React, { ReactNode, useState } from 'react';
import { ChevronRight, Menu, Home, Briefcase, Users, CheckSquare, Clock, Repeat } from 'lucide-react';
import Navbar from '../Commen/NavBaar';
import SidebarItem from '../Home/SideBar';
interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
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
            <SidebarItem icon={<Home size={20} />} text="Home" path="/"  expanded={sidebarOpen} />
            <SidebarItem icon={<Briefcase size={20} />} text="Projects" path="/Project-list" expanded={sidebarOpen} />
            <SidebarItem icon={<Users size={20} />} text="Collaborations" path="/collaborations" expanded={sidebarOpen} />
            <SidebarItem icon={<CheckSquare size={20} />} text="Tasks" path="/Task-list" expanded={sidebarOpen} />
            <SidebarItem icon={<Clock size={20} />} text="Time Sheets" path="/timesheets" expanded={sidebarOpen} />
            <SidebarItem icon={<Repeat size={20} />} text="Reset Projects" path="/reset-projects" expanded={sidebarOpen} />
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} toggleUserMenu={toggleUserMenu} userMenuOpen={userMenuOpen} />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
