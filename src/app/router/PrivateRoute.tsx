import { useSessionStore } from '@/core/stores/session';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  loginLocation: string;
}

export default function PrivateRoute({ loginLocation }: PrivateRouteProps) {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const location = useLocation();

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={loginLocation} state={{ from: location }} replace />
  );
}
