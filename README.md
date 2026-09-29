# 🍯 Madhuvan Honey (honey-shop)

> **100% Pure, Raw & Organic Forest Honey Platform**  
> Direct from indigenous apiaries across India's pristine biospheres to conscious homes.

---

## 🌟 Overview & Architecture

Madhuvan Honey is an artisanal, enterprise-grade e-commerce application crafted in **React 19 + TypeScript + Vite**. It implements an end-to-end customer shopping journey and a dedicated administrative portal for honey inventory, batch lab reports, and fulfillment tracking.

### 🌐 Access URLs
- **Storefront (Customer):** `https://yourhoney.com/` (Local: `http://localhost:5173/`)
- **Admin Portal:** `https://yourhoney.com/admin` (Local: `http://localhost:5173/admin/login`)

> **Security Note:** In production, while you may customize the admin route (e.g. `/apiary-ops-auth`), robust security relies on token-based authentication, role-based access control (RBAC), and session expiration rather than security through obscurity.

---

## 📁 Project Structure

```
honey-shop/
│
├── public/
│   ├── images/
│   │   ├── products/
│   │   ├── banners/
│   │   ├── brand/
│   │   ├── farmers/
│   │   └── recipes/
│   │
│   ├── icons/
│   │   └── bee.svg
│   └── favicon.ico
│
├── src/
│   ├── assets/
│   │   ├── images/
│   │   ├── icons/
│   │   └── fonts/
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Loader.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Pagination.tsx
│   │   │   └── SectionTitle.tsx
│   │   │
│   │   ├── customer/
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── MobileMenu.tsx
│   │   │   │   └── AnnouncementBar.tsx
│   │   │   │
│   │   │   ├── home/
│   │   │   │   ├── Hero.tsx
│   │   │   │   ├── FeaturedProducts.tsx
│   │   │   │   ├── HoneyJourney.tsx
│   │   │   │   ├── WhyChooseUs.tsx
│   │   │   │   ├── OurStory.tsx
│   │   │   │   ├── Testimonials.tsx
│   │   │   │   └── Newsletter.tsx
│   │   │   │
│   │   │   ├── product/
│   │   │   │   ├── ProductCard.tsx
│   │   │   │   ├── ProductGrid.tsx
│   │   │   │   ├── ProductGallery.tsx
│   │   │   │   ├── ProductInfo.tsx
│   │   │   │   ├── QuantitySelector.tsx
│   │   │   │   ├── ProductReviews.tsx
│   │   │   │   └── RelatedProducts.tsx
│   │   │   │
│   │   │   ├── cart/
│   │   │   │   ├── CartItem.tsx
│   │   │   │   ├── CartSummary.tsx
│   │   │   │   └── EmptyCart.tsx
│   │   │   │
│   │   │   └── checkout/
│   │   │       ├── CheckoutSteps.tsx
│   │   │       ├── AddressForm.tsx
│   │   │       ├── OrderSummary.tsx
│   │   │       └── PaymentMethod.tsx
│   │   │
│   │   └── admin/
│   │       ├── layout/
│   │       │   ├── AdminSidebar.tsx
│   │       │   ├── AdminHeader.tsx
│   │       │   ├── AdminLayout.tsx
│   │       │   └── AdminMobileMenu.tsx
│   │       │
│   │       ├── dashboard/
│   │       │   ├── StatsCard.tsx
│   │       │   ├── SalesChart.tsx
│   │       │   ├── RecentOrders.tsx
│   │       │   └── TopProducts.tsx
│   │       │
│   │       ├── products/
│   │       │   ├── ProductTable.tsx
│   │       │   ├── ProductForm.tsx
│   │       │   ├── ProductImageUpload.tsx
│   │       │   └── ProductActions.tsx
│   │       │
│   │       ├── orders/
│   │       │   ├── OrderTable.tsx
│   │       │   ├── OrderDetails.tsx
│   │       │   └── OrderStatus.tsx
│   │       │
│   │       ├── customers/
│   │       │   ├── CustomerTable.tsx
│   │       │   └── CustomerDetails.tsx
│   │       │
│   │       ├── categories/
│   │       │   ├── CategoryTable.tsx
│   │       │   └── CategoryForm.tsx
│   │       │
│   │       └── settings/
│   │           └── SettingsForm.tsx
│   │
│   ├── pages/
│   │   ├── customer/
│   │   │   ├── Home/Home.tsx
│   │   │   ├── Shop/Shop.tsx
│   │   │   ├── Product/ProductDetails.tsx
│   │   │   ├── Cart/Cart.tsx
│   │   │   ├── Checkout/Checkout.tsx
│   │   │   ├── Auth/Login.tsx & Register.tsx
│   │   │   ├── Orders/Orders.tsx, OrderDetails.tsx & TrackOrder.tsx
│   │   │   ├── About/About.tsx
│   │   │   ├── Story/OurStory.tsx
│   │   │   ├── Blog/Blog.tsx & BlogDetails.tsx
│   │   │   └── Contact/Contact.tsx
│   │   │
│   │   └── admin/
│   │       ├── Auth/AdminLogin.tsx
│   │       ├── Dashboard/Dashboard.tsx
│   │       ├── Products/Products.tsx, AddProduct.tsx & EditProduct.tsx
│   │       ├── Orders/Orders.tsx & OrderDetails.tsx
│   │       ├── Customers/Customers.tsx
│   │       ├── Categories/Categories.tsx
│   │       └── Settings/Settings.tsx
│   │
│   ├── layouts/
│   │   ├── CustomerLayout.tsx
│   │   └── AdminLayout.tsx
│   │
│   ├── routes/
│   │   ├── AppRoutes.tsx
│   │   ├── CustomerRoutes.tsx
│   │   ├── AdminRoutes.tsx
│   │   └── ProtectedRoute.tsx
│   │
│   ├── store/
│   │   ├── store.ts
│   │   └── slices/
│   │       ├── authSlice.ts
│   │       ├── cartSlice.ts
│   │       ├── productSlice.ts
│   │       ├── orderSlice.ts
│   │       └── wishlistSlice.ts
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── authApi.ts
│   │   ├── productApi.ts
│   │   ├── orderApi.ts
│   │   ├── customerApi.ts
│   │   └── paymentApi.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useCart.ts
│   │   ├── useProducts.ts
│   │   └── useOrders.ts
│   │
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── product.types.ts
│   │   ├── order.types.ts
│   │   └── customer.types.ts
│   │
│   ├── data/
│   │   ├── products.ts
│   │   ├── categories.ts
│   │   └── testimonials.ts
│   │
│   ├── utils/
│   │   ├── constants.ts
│   │   ├── formatPrice.ts
│   │   ├── validators.ts
│   │   └── storage.ts
│   │
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
│
├── .env
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

---

## 🔑 Admin Credentials

| Role | Email | Password |
|---|---|---|
| **Super Admin** | `admin@madhuvanhoney.com` | `adminhoney123` |

*A "1-Click Demo Login" button is also provided on `/admin/login` for instant testing.*

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Launch local development server
npm run dev

# 3. Build production bundle
npm run build
```

---

## 🍯 Key Features

- **100% Raw Unfiltered Honey Catalog:** Multiple jar sizes (250g, 500g, 1kg), price recalculations, and harvest origin stories.
- **NMR Purity Score Visualizer:** Clear verification seals, moisture content, and diastase enzyme preservation guarantees.
- **Smooth E-Commerce Checkout:** Delivery address form, promo code validation (`MADHUVAN10`), multi-payment options (UPI/Card/COD), and celebratory confetti animation upon completion.
- **Live Dispatch Tracker:** Real-time consignment timeline tracker with order number search.
- **Full Admin Control Suite:** Add/Edit/Delete products with image uploads, status management (Pending ➔ Processing ➔ Shipped ➔ Delivered), patron CRM, and sales analytics charts.
