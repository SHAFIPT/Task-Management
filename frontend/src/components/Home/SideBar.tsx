import { Link, useLocation } from "react-router-dom";

interface SidebarItemProps {
  icon: React.ReactNode;
  text: string;
  expanded: boolean;
  path: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, text, expanded, path }) => {
  const location = useLocation(); // Get current route
  const isActive = location.pathname === path; // Check if this item is active

  return (
    <Link 
      to={path} 
      className={`flex items-center py-3 px-4 rounded-lg transition-colors duration-200
        ${isActive ? 'bg-indigo-700 text-white font-bold' : 'text-gray-300 hover:bg-indigo-700 hover:text-white'}`}
    >
      <div className="mr-3">{icon}</div>
      {expanded && <span>{text}</span>}
    </Link>
  );
};

export default SidebarItem;
