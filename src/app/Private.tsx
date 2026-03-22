import { clearTokens, getAccessToken } from '@/core/local/storage';
import { isTokenExpired } from '@/core/utils/jwt';
import { Navigate, useLocation } from 'react-router-dom';
import Layout from './Layout';

interface Props {
  redirect: string;
}

export default function Private({ redirect }: Props) {
  const location = useLocation();
  const token = getAccessToken();
  const isAuthenticated = !isTokenExpired(token);

  if (!isAuthenticated) {
    clearTokens();
    return <Navigate to={redirect} state={{ from: location }} replace />;
  }

  return <Layout />;
}
