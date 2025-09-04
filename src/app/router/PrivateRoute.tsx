import { SessionStore } from '@/core/stores/session';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface PrivateRouteProps {
  loginLocation: string;
}

export default function PrivateRoute({ loginLocation }: PrivateRouteProps) {
  const { isConnected } = SessionStore();
  const location = useLocation();

  return isConnected ? (
    <Outlet />
  ) : (
    <Navigate to={loginLocation} state={{ from: location }} replace />
  );
}
