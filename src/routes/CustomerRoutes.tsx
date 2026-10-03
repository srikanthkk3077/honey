import React, { lazy } from 'react';
import { Route } from 'react-router-dom';

// Lazy load customer pages for fast initial page load & code splitting
const Home = lazy(() => import('../pages/customer/Home/Home').then(m => ({ default: m.Home })));
const Shop = lazy(() => import('../pages/customer/Shop/Shop').then(m => ({ default: m.Shop })));
const ProductDetails = lazy(() => import('../pages/customer/Product/ProductDetails').then(m => ({ default: m.ProductDetails })));
const Cart = lazy(() => import('../pages/customer/Cart/Cart').then(m => ({ default: m.Cart })));
const Checkout = lazy(() => import('../pages/customer/Checkout/Checkout').then(m => ({ default: m.Checkout })));
const Login = lazy(() => import('../pages/customer/Auth/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('../pages/customer/Auth/Register').then(m => ({ default: m.Register })));
const ForgotPassword = lazy(() => import('../pages/customer/Auth/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('../pages/customer/Auth/ResetPassword').then(m => ({ default: m.ResetPassword })));
const Orders = lazy(() => import('../pages/customer/Orders/Orders').then(m => ({ default: m.Orders })));
const OrderDetails = lazy(() => import('../pages/customer/Orders/OrderDetails').then(m => ({ default: m.OrderDetails })));
const TrackOrder = lazy(() => import('../pages/customer/Orders/TrackOrder').then(m => ({ default: m.TrackOrder })));
const Videos = lazy(() => import('../pages/customer/Videos/Videos').then(m => ({ default: m.Videos })));
const About = lazy(() => import('../pages/customer/About/About').then(m => ({ default: m.About })));
const OurStory = lazy(() => import('../pages/customer/Story/OurStory').then(m => ({ default: m.OurStory })));
const Blog = lazy(() => import('../pages/customer/Blog/Blog').then(m => ({ default: m.Blog })));
const BlogDetails = lazy(() => import('../pages/customer/Blog/BlogDetails').then(m => ({ default: m.BlogDetails })));
const Contact = lazy(() => import('../pages/customer/Contact/Contact').then(m => ({ default: m.Contact })));

export const CustomerRoutes = (
  <>
    <Route index element={<Home />} />
    <Route path="shop" element={<Shop />} />
    <Route path="product/:slug" element={<ProductDetails />} />
    <Route path="cart" element={<Cart />} />
    <Route path="checkout" element={<Checkout />} />
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
    <Route path="forgot-password" element={<ForgotPassword />} />
    <Route path="reset-password" element={<ResetPassword />} />
    <Route path="orders" element={<Orders />} />
    <Route path="orders/:id" element={<OrderDetails />} />
    <Route path="track-order" element={<TrackOrder />} />
    <Route path="videos" element={<Videos />} />
    <Route path="about" element={<About />} />
    <Route path="story" element={<OurStory />} />
    <Route path="blog" element={<Blog />} />
    <Route path="blog/:slug" element={<BlogDetails />} />
    <Route path="contact" element={<Contact />} />
  </>
);
