import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

export default function AppRouter() {
  const PublicRoutes = () => {
    return (
      <Route path="/" element={<PublicRoute homeLocation="/" />}>
        <Route path="/login" element={<h1>Public Route</h1>} />
      </Route>
    );
  };

  const PrivateRoutes = () => {
    return (
      <Route path="/" element={<PrivateRoute loginLocation="/login" />}>
        <Route index element={<h1>Private Route</h1>} />
      </Route>
    );
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route>
          {PublicRoutes()}
          {PrivateRoutes()}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
