import React from "react";
import { Menu, Search, Bell, Settings, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

interface NavbarProps {
  toggleSidebar: () => void;
  toggleUserMenu: () => void;
  userMenuOpen: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, toggleUserMenu, userMenuOpen }) => {

    const navigate = useNavigate();
    const { logout } = useAuth()
    const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        navigate("/auth/login"); 
      },
      onError: (error) => {
        console.error("Logout failed:", error);
      }
    });
  };

  return (
    <header className="bg-white shadow-md">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center">
          <button onClick={toggleSidebar} className="p-1 rounded-full text-gray-500 hover:bg-gray-100 md:hidden">
            <Menu size={20} />
          </button>
          <div className="relative ml-4 md:ml-0">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={18} className="text-gray-400" />
            </span>
            <input
              type="text"
              className="pl-10 pr-4 py-2 w-64 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Search..."
            />
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-1 rounded-full text-gray-500 hover:bg-gray-100">
            <Bell size={20} />
          </button>
          <button className="p-1 rounded-full text-gray-500 hover:bg-gray-100">
            <Settings size={20} />
          </button>
          <div className="relative">
            <button 
              onClick={toggleUserMenu} 
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-100"
            >
              <div className="w-8 h-8 rounded-full bg-indigo-700 flex items-center justify-center text-white">
                <span>AP</span>
              </div>
            </button>
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                <div className="py-1">
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User size={16} className="mr-2" />
                    Profile
                  </a>
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings size={16} className="mr-2" />
                    Settings
                  </a>
                  <button className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                   onClick={handleLogout}
                  >
                    <LogOut size={16} className="mr-2" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
