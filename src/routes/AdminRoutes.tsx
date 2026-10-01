import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { Dashboard } from '../pages/admin/Dashboard/Dashboard';
import { Products } from '../pages/admin/Products/Products';
import { AddProduct } from '../pages/admin/Products/AddProduct';
import { EditProduct } from '../pages/admin/Products/EditProduct';
import { Orders } from '../pages/admin/Orders/Orders';
import { AdminOrderDetails } from '../pages/admin/Orders/OrderDetails';
import { Transactions } from '../pages/admin/Transactions/Transactions';
import { AdminVideos } from '../pages/admin/Videos/Videos';
import { Customers } from '../pages/admin/Customers/Customers';
import { Categories } from '../pages/admin/Categories/Categories';
import { Settings } from '../pages/admin/Settings/Settings';

export const AdminRoutes = (
  <>
    <Route index element={<Navigate to="/admin/dashboard" replace />} />
    <Route
      path="dashboard"
      element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      }
    />
    <Route
      path="products"
      element={
        <ProtectedRoute>
          <Products />
        </ProtectedRoute>
      }
    />
    <Route
      path="products/add"
      element={
        <ProtectedRoute>
          <AddProduct />
        </ProtectedRoute>
      }
    />
    <Route
      path="products/edit/:id"
      element={
        <ProtectedRoute>
          <EditProduct />
        </ProtectedRoute>
      }
    />
    <Route
      path="orders"
      element={
        <ProtectedRoute>
          <Orders />
        </ProtectedRoute>
      }
    />
    <Route
      path="orders/:id"
      element={
        <ProtectedRoute>
          <AdminOrderDetails />
        </ProtectedRoute>
      }
    />
    <Route
      path="transactions"
      element={
        <ProtectedRoute>
          <Transactions />
        </ProtectedRoute>
      }
    />
    <Route
      path="videos"
      element={
        <ProtectedRoute>
          <AdminVideos />
        </ProtectedRoute>
      }
    />
    <Route
      path="customers"
      element={
        <ProtectedRoute>
          <Customers />
        </ProtectedRoute>
      }
    />
    <Route
      path="categories"
      element={
        <ProtectedRoute>
          <Categories />
        </ProtectedRoute>
      }
    />
    <Route
      path="settings"
      element={
        <ProtectedRoute>
          <Settings />
        </ProtectedRoute>
      }
    />
  </>
);
