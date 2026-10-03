import React, { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';

// Lazy load admin pages for modular administration code splitting
const Dashboard = lazy(() => import('../pages/admin/Dashboard/Dashboard').then(m => ({ default: m.Dashboard })));
const Products = lazy(() => import('../pages/admin/Products/Products').then(m => ({ default: m.Products })));
const AddProduct = lazy(() => import('../pages/admin/Products/AddProduct').then(m => ({ default: m.AddProduct })));
const EditProduct = lazy(() => import('../pages/admin/Products/EditProduct').then(m => ({ default: m.EditProduct })));
const Orders = lazy(() => import('../pages/admin/Orders/Orders').then(m => ({ default: m.Orders })));
const AdminOrderDetails = lazy(() => import('../pages/admin/Orders/OrderDetails').then(m => ({ default: m.AdminOrderDetails })));
const Transactions = lazy(() => import('../pages/admin/Transactions/Transactions').then(m => ({ default: m.Transactions })));
const Sliders = lazy(() => import('../pages/admin/Sliders/Sliders').then(m => ({ default: m.Sliders })));
const AdminVideos = lazy(() => import('../pages/admin/Videos/Videos').then(m => ({ default: m.AdminVideos })));
const Customers = lazy(() => import('../pages/admin/Customers/Customers').then(m => ({ default: m.Customers })));
const Categories = lazy(() => import('../pages/admin/Categories/Categories').then(m => ({ default: m.Categories })));
const Reviews = lazy(() => import('../pages/admin/Reviews/Reviews').then(m => ({ default: m.Reviews })));
const Settings = lazy(() => import('../pages/admin/Settings/Settings').then(m => ({ default: m.Settings })));

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
      path="sliders"
      element={
        <ProtectedRoute>
          <Sliders />
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
      path="reviews"
      element={
        <ProtectedRoute>
          <Reviews />
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
