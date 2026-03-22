import { clearTokens, getAccessToken } from '@/core/local/storage';
import { isTokenExpired } from '@/core/utils/jwt';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

interface Props {
  redirect: string;
}

export default function Public({ redirect }: Props) {
  const location = useLocation();
  const token = getAccessToken();
  const isAuthenticated = !isTokenExpired(token);

  if (!isAuthenticated) {
    clearTokens();
    return <Outlet />;
  }

  return <Navigate to={redirect} state={{ from: location }} replace />;
}
