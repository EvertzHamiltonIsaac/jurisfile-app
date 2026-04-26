import { createRoot } from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

import Layout from '@/components/layout/Layout';
import Login from './pages/Login/Login';
import Dashboard from './pages/Dashboard/Dashboard.jsx';
import Matters from './pages/Matters/Matters.jsx';
import MatterDetail from './pages/Matters/MattersDetail.jsx';
import Clients from './pages/Clients/Clients.jsx';
import Documents from './pages/Documents/Documents.jsx';
import Hearings from './pages/Hearings/Hearings.jsx';
import ClientsDetails from './pages/Clients/ClientsDetails';

const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Navigate to='/dashboard' replace /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'matters', element: <Matters /> },
      { path: 'matters/:id', element: <MatterDetail /> },
      { path: 'documents', element: <Documents /> },
      { path: 'clients', element: <Clients /> },
      { path: 'clients/:id', element: <ClientsDetails /> },
      { path: 'hearings', element: <Hearings /> },
    ],
  },
  {
    path: '*',
    element: <div className='flex items-center justify-center h-screen text-sm text-slate-400'>404 — Page not found</div>,
  },
]);

createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>,
);
