import { getAccessToken } from '@/core/local/storage';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface Props {
  redirect: string;
}

export default function Public({ redirect }: Props) {
  const location = useLocation();
  const isAuthenticated = !!getAccessToken();

  return !isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to={redirect} state={{ from: location }} replace />
  );
}
