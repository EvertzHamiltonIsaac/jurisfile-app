import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Dashboard from '../src/pages/Dashboard/Dashboard.jsx';
import Cases from '../src/pages/Cases/Cases.jsx';
import Clients from '../src/pages/Clients/Clients.jsx';
import Documents from '../src/pages/Documents/Documents.jsx';
import Hearings from '../src/pages/Hearings/Hearings.jsx';
import { RouterProvider } from 'react-router/dom';
import { createBrowserRouter } from 'react-router';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, path: 'dashboard', element: <Dashboard /> },
      { path: 'cases', element: <Cases /> },
      { path: 'clients', element: <Clients /> },
      { path: 'documents', element: <Documents /> },
      { path: 'hearings', element: <Hearings /> },
    ],
  },
  {
    path: '*',
    element: <div>Not Found Page</div>,
  },
]);

createRoot(document.getElementById('root')).render(
  <RouterProvider router={router} />,
);
