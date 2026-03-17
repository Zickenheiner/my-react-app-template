import { getAccessToken } from '@/core/local/storage';
import { Navigate, useLocation } from 'react-router-dom';
import Layout from './Layout';

interface Props {
  redirect: string;
}

export default function Private({ redirect }: Props) {
  const location = useLocation();
  const isAuthenticated = !!getAccessToken();

  return isAuthenticated ? (
    <Layout />
  ) : (
    <Navigate to={redirect} state={{ from: location }} replace />
  );
}
