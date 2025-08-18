import { BrowserRouter, Route, Routes } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import PublicRoute from './PublicRoute';

const AppRouter = () => {
  const PublicRoutes = () => {
    return (
      <Route path="/" element={<PublicRoute dashboardLocation="/dashboard" />}>
        <Route path="/" element={<h1>Public Route</h1>} />
      </Route>
    );
  };

  const PrivateRoutes = () => {
    return (
      <Route path="/" element={<PrivateRoute loginLocation="/" />}>
        <Route path="/dashboard" element={<h1>Private Route</h1>} />
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
};

export default AppRouter;
