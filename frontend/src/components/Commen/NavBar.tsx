import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt } from "react-icons/fa";
import useAuth from "../../hooks/useAuth";
import '../../pages/Auth/loadingBody.css'
import useIsAuthenticated from "../../hooks/useIsAuthenticated";

const NavBar = () => {
  const { isAuthenticated } = useIsAuthenticated();
  console.log('This is authenticated User :::',isAuthenticated)
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
    <>
    {logout.isPending && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="loader "></div>
        </div>
      )}
    <nav className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or Brand Name */}
        <h1 className="text-2xl font-bold tracking-wide">Task Manager</h1>

        {/* Logout Button */}
          {isAuthenticated ? (
            <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-400 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-500 transition"
          >
            <FaSignOutAlt className="text-lg" />
            <span className="font-semibold">Logout</span>
          </button>
          ): (
              
        <Link to='/auth/login'
          className="flex items-center gap-2 bg-white text-blue-600 px-4 py-2 rounded-lg shadow-md hover:bg-gray-200 transition"
        >
          <FaSignOutAlt className="text-lg" />
          <span className="font-semibold">Login</span>
        </Link>
        )}
        
      </div>
    </nav>
    </>
  );
};

export default NavBar;
