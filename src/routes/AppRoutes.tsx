import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CustomerLayout } from '../layouts/CustomerLayout';
import { CustomerRoutes } from './CustomerRoutes';
import { AdminLayout } from '../layouts/AdminLayout';
import { AdminRoutes } from './AdminRoutes';
import { PageLoader } from '../components/common/PageLoader';

// Lazy load admin login portal
const AdminLogin = lazy(() => import('../pages/admin/Auth/AdminLogin').then(m => ({ default: m.AdminLogin })));

export const AppRoutes: React.FC = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Customer Storefront Routes */}
        <Route path="/" element={<CustomerLayout />}>
          {CustomerRoutes}
        </Route>

        {/* Admin Auth Route (Unwrapped) */}
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<PageLoader message="Loading admin portal..." minHeight="100vh" />}>
              <AdminLogin />
            </Suspense>
          }
        />

        {/* Admin Protected Console Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          {AdminRoutes}
        </Route>

        {/* Fallback to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
};
