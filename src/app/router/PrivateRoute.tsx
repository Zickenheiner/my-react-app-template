import { getAccessToken } from '@/core/stores/accessToken.store';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  loginLocation: string;
}

export default function PrivateRoute({ loginLocation }: PrivateRouteProps) {
  const location = useLocation();
  const isAuthenticated = !!getAccessToken();

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={loginLocation} state={{ from: location }} replace />
  );
}
