import { SessionStore } from '@/core/stores/session';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface PublicRouteProps {
  homeLocation: string;
}

export default function PublicRoute({ homeLocation }: PublicRouteProps) {
  const { isConnected } = SessionStore();
  const location = useLocation();

  return !isConnected ? (
    <Outlet />
  ) : (
    <Navigate to={homeLocation} state={{ from: location }} replace />
  );
}
