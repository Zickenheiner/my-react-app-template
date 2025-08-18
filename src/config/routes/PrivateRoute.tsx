import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  loginLocation: string;
}

const PrivateRoute = ({ loginLocation }: PrivateRouteProps) => {
  const isConnected = false; // Replace with actual connection logic
  const location = useLocation();

  return isConnected ? (
    <Outlet />
  ) : (
    <Navigate to={loginLocation} state={{ from: location }} replace />
  );
};

export default PrivateRoute;
