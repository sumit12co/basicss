import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/common/Toast';
import Layout from './components/layout/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Approvals from './pages/Approvals';
import ItemCodePriceList from './pages/ItemCodePriceList';
import FinanceReview from './pages/FinanceReview';
import ERPIntegration from './pages/ERPIntegration';
import Notifications from './pages/Notifications';
import AdminPanel from './pages/admin/AdminPanel';
import UserManagement from './pages/admin/UserManagement';
import ApprovalMatrixConfig from './pages/admin/ApprovalMatrix';
import SystemSettings from './pages/admin/SystemSettings';

const ProtectedRoute: React.FC<{ children: React.ReactNode; allowedRoles?: string[] }> = ({
  children,
  allowedRoles,
}) => {
  const { isAuthenticated, currentUser } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && currentUser && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <Layout>{children}</Layout>;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />

      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={['business', 'approver', 'finance', 'admin']}>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route path="/approvals" element={
        <ProtectedRoute allowedRoles={['approver', 'finance']}>
          <Approvals />
        </ProtectedRoute>
      } />

      <Route path="/item-code-price-list" element={
        <ProtectedRoute allowedRoles={['business', 'finance']}>
          <ItemCodePriceList />
        </ProtectedRoute>
      } />

      <Route path="/finance-review" element={
        <ProtectedRoute allowedRoles={['finance']}>
          <FinanceReview />
        </ProtectedRoute>
      } />

      <Route path="/erp-integration" element={
        <ProtectedRoute allowedRoles={['finance', 'admin']}>
          <ERPIntegration />
        </ProtectedRoute>
      } />

      <Route path="/notifications" element={
        <ProtectedRoute>
          <Notifications />
        </ProtectedRoute>
      } />

      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminPanel />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="/admin/users" replace />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="approval-matrix" element={<ApprovalMatrixConfig />} />
        <Route path="integration" element={<ERPIntegration />} />
        <Route path="settings" element={<SystemSettings />} />
      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;

