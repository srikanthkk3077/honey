import React from 'react';
import { Route } from 'react-router-dom';
import { Home } from '../pages/customer/Home/Home';
import { Shop } from '../pages/customer/Shop/Shop';
import { ProductDetails } from '../pages/customer/Product/ProductDetails';
import { Cart } from '../pages/customer/Cart/Cart';
import { Checkout } from '../pages/customer/Checkout/Checkout';
import { Login } from '../pages/customer/Auth/Login';
import { Register } from '../pages/customer/Auth/Register';
import { Orders } from '../pages/customer/Orders/Orders';
import { OrderDetails } from '../pages/customer/Orders/OrderDetails';
import { TrackOrder } from '../pages/customer/Orders/TrackOrder';
import { About } from '../pages/customer/About/About';
import { OurStory } from '../pages/customer/Story/OurStory';
import { Blog } from '../pages/customer/Blog/Blog';
import { BlogDetails } from '../pages/customer/Blog/BlogDetails';
import { Contact } from '../pages/customer/Contact/Contact';
import { Videos } from '../pages/customer/Videos/Videos';

export const CustomerRoutes = (
  <>
    <Route index element={<Home />} />
    <Route path="shop" element={<Shop />} />
    <Route path="product/:slug" element={<ProductDetails />} />
    <Route path="cart" element={<Cart />} />
    <Route path="checkout" element={<Checkout />} />
    <Route path="login" element={<Login />} />
    <Route path="register" element={<Register />} />
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
