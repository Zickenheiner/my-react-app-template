import { getAccessToken } from '@/core/stores/accessToken.store';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface PublicRouteProps {
  homeLocation: string;
}

export default function PublicRoute({ homeLocation }: PublicRouteProps) {
  const location = useLocation();
  const isAuthenticated = !!getAccessToken();

  return !isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={homeLocation} state={{ from: location }} replace />
  );
}
