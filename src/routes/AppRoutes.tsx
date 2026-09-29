import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CustomerLayout } from '../layouts/CustomerLayout';
import { CustomerRoutes } from './CustomerRoutes';
import { AdminLayout } from '../layouts/AdminLayout';
import { AdminRoutes } from './AdminRoutes';
import { AdminLogin } from '../pages/admin/Auth/AdminLogin';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Customer Storefront Routes */}
      <Route path="/" element={<CustomerLayout />}>
        {CustomerRoutes}
      </Route>

      {/* Admin Auth Route (Unwrapped) */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Protected Console Routes */}
      <Route path="/admin" element={<AdminLayout />}>
        {AdminRoutes}
      </Route>

      {/* Fallback to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
