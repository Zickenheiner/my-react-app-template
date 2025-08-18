import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface PublicRouteProps {
  dashboardLocation: string;
}

const PublicRoute = ({ dashboardLocation }: PublicRouteProps) => {
  const isConnected = false; // Replace with actual connection logic
  const location = useLocation();
  console.log(location);

  return !isConnected ? (
    <Outlet />
  ) : (
    <Navigate to={dashboardLocation} state={{ from: location }} replace />
  );
};

export default PublicRoute;
