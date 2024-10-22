import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import styles from './App.module.css'

import { Welcome } from './Onboarding/Welcome/WelcomePage';
import { SignIn } from './AdminSide/Pages/SignIn/SignIn';
import { FinSignIn } from './FinancialSide/Pages/FinSignIn/FinSignIn';

import { DashboardLayout } from './AdminSide/Pages/DashboardLayout';
import { Overview } from './AdminSide//Pages/Overview/Overview';
import { Banking } from './AdminSide//Pages/Banking/Banking';
import { Telcos } from './AdminSide//Pages/Telcos/Telcos';
import { Invoicing } from './AdminSide//Pages/Invoicing/Invoicing';
import { AuditLogs } from './AdminSide//Pages/AuditLogs/AuditLogs';
import { Reports } from './AdminSide//Pages/Reports/Reports';

import { FinDashboardLayout } from './FinancialSide/Pages/FinDashboardLayout';
import { FinOverview } from './FinancialSide/Pages/FinOverview/FinOverview';
import { FinBanking } from './FinancialSide/Pages/FinBanking/FinBanking';
import { FinReconciliation } from './FinancialSide/Pages/FinReconciliation/FinReconciliation';
import { FinReports } from './FinancialSide/Pages/FinReports/FinReports';



function App() {

  const router = createBrowserRouter([
    { path: '/', element: <Welcome /> },
    { path: '/admin-signin', element: <SignIn /> },
    { path: '/fin-signin', element: <FinSignIn /> },
    {
      path: '/admin', element: <DashboardLayout />,
      children: [
        { path: '/admin', element: <Navigate to="overview" /> },
        { path: 'overview', element: <Overview /> },
        { path: 'banking', element: <Banking /> },
        { path: 'telcos', element: <Telcos /> },
        { path: 'invoicing', element: <Invoicing /> },
        { path: 'auditlogs', element: <AuditLogs /> },
        { path: 'reports', element: <Reports /> },
      ]
    },

    {
      path: '/dashboard', element: <FinDashboardLayout />,
      children: [
        { path: '/dashboard', element: <Navigate to="overview" /> },
        { path: 'overview', element: <FinOverview /> },
        { path: 'banking', element: <FinBanking /> },
        { path: 'reconciliation', element: <FinReconciliation /> },
        { path: 'reports', element: <FinReports /> },
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
