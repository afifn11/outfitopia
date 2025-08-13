import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Dynamic Imports (Code Splitting)
const HomePage = lazy(() => import('./pages/HomePage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage = lazy(() => import('./pages/CartPage'));
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage = lazy(() => import('./pages/OrderSuccessPage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const RegisterPage = lazy(() => import('./pages/RegisterPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const CategoryPage = lazy(() => import('./pages/CategoryPage'));
const AllProductsPage = lazy(() => import('./pages/AllProductsPage')); 

// Admin Pages
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const ManageProductsPage = lazy(() => import('./pages/admin/ManageProductsPage'));
const ManageOrdersPage = lazy(() => import('./pages/admin/ManageOrdersPage'));
const ProductFormPage = lazy(() => import('./pages/admin/ProductFormPage'));
const ManageReviewsPage = lazy(() => import('./pages/admin/ManageReviewsPage'));

const LoadingFallback = () => <div className="text-center mt-20">Loading...</div>;

function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main>
        <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/products" element={<AllProductsPage />} /> {/* Pastikan Anda membuat file AllProductsPage.jsx */}

            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

            <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route index element={<ManageProductsPage />} /> 
              <Route path="products" element={<ManageProductsPage />} />
              <Route path="products/new" element={<ProductFormPage />} />
              <Route path="products/edit/:id" element={<ProductFormPage />} />
              <Route path="orders" element={<ManageOrdersPage />} />
              <Route path="reviews" element={<ManageReviewsPage />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}

export default App;