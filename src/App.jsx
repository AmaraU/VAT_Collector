import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import styles from './App.module.css'

import { DashboardLayout } from './Pages/DashboardLayout';
import { SignIn } from './Pages/SignIn/SignIn';
import { Overview } from './Pages/Overview/Overview';
import { AuditLogs } from './Pages/AuditLogs/AuditLogs';
import { Reports } from './Pages/Reports/Reports';
import { Banking } from './Pages/Banking/Banking';
import { Telcos } from './Pages/Telcos/Telcos';
import { Invoicing } from './Pages/Invoicing/Invoicing';



function App() {

  const router = createBrowserRouter([
    { path: '/', element: <Navigate to='signin' /> },
    { path: '/signin', element: <SignIn /> },
    {
      path: '/dashboard', element: <DashboardLayout />,
      children: [
        { path: '/dashboard', element: <Navigate to="overview" /> },
        { path: 'overview', element: <Overview /> },
        { path: 'banking', element: <Banking /> },
        { path: 'telcos', element: <Telcos /> },
        { path: 'invoicing', element: <Invoicing /> },
        { path: 'auditlogs', element: <AuditLogs /> },
        { path: 'reports', element: <Reports /> },
      ]
    },
  ]);

  return (
    <div className={styles.App}>
      <RouterProvider router={router} />
    </div>
  );
}

export default App
