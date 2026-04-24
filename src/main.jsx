import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Dashboard from '../src/pages/Dashboard/Dashboard.jsx';
import Matters from './pages/Matters/Matters.jsx';
import Clients from '../src/pages/Clients/Clients.jsx';
import Documents from '../src/pages/Documents/Documents.jsx';
import Hearings from '../src/pages/Hearings/Hearings.jsx';
import Layout from '@/components/layout/Layout';
import MatterDetail from '@/pages/Matters/MattersDetail';
import { RouterProvider } from 'react-router/dom';
import { createBrowserRouter, Navigate } from 'react-router';
import Login from './pages/Login/Login';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to='/dashboard' replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'matters', element: <Matters /> },
      { path: 'matters/:id', element: <MatterDetail /> },
      { path: 'documents', element: <Documents /> },
      { path: 'clients', element: <Clients /> },
      { path: 'hearings', element: <Hearings /> },
    ],
  },
  {
    path: '*',
    element: (
      <div className='flex items-center justify-center h-screen text-sm text-slate-400'>
        404 — Page not found
      </div>
    ),
  },
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />,
);
