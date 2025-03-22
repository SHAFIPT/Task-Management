import { Navigate, Outlet } from "react-router-dom";
import { FC } from "react";
import useIsAuthenticated from "../hooks/useIsAuthenticated";

interface PrivateRouteProps {
  redirectTo?: string;
}

const PrivateRoute: FC<PrivateRouteProps> = ({ redirectTo = "/auth/login" }) => {
  const { isAuthenticated } = useIsAuthenticated();


  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Render the protected route
  return <Outlet />;
};

export default PrivateRoute;