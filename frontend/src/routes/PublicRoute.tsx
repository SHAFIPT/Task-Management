import { Navigate, Outlet } from "react-router-dom";
import { useIsAuthenticated } from "../hooks/useIsAuthenticated";
import '../pages/Auth/loadingBody.css'

interface PublicRouteProps {
  redirectTo: string;
}
 
const PublicRoute = ({ redirectTo }: PublicRouteProps) => {
  const { isAuthenticated, isLoading } = useIsAuthenticated();

  if (isLoading) {
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="loader "></div>
    </div> // Or a loading spinner/component
  }

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default PublicRoute;