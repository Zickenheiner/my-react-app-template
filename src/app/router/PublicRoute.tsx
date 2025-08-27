import { useSessionStore } from '@/core/stores/session';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface PublicRouteProps {
  homeLocation: string;
}

export default function PublicRoute({ homeLocation }: PublicRouteProps) {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const location = useLocation();

  return !isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={homeLocation} state={{ from: location }} replace />
  );
}
