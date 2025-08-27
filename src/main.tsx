import './index.css';
import { createRoot } from 'react-dom/client';
import AppRouter from './app/router/AppRouter';
import AppProvider from './app/AppProvider';

createRoot(document.getElementById('root')!).render(
  <AppProvider>
    <AppRouter />
  </AppProvider>,
);
