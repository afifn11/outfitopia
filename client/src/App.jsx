// /client/src/App.jsx (Versi Akhir)
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute'; // Import
import HomePage from './pages/HomePage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import LoginPage from './pages/LoginPage'; // Import
import RegisterPage from './pages/RegisterPage'; // Import
import ProfilePage from './pages/ProfilePage'; // Import
import AdminRoute from './components/AdminRoute';
import AdminLayout from './pages/admin/AdminLayout';
import ManageProductsPage from './pages/admin/ManageProductsPage';
import ManageOrdersPage from './pages/admin/ManageOrdersPage';
import ProductFormPage from './pages/admin/ProductFormPage';
import ManageReviewsPage from './pages/admin/ManageReviewsPage';

function App() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <main>
        <Routes>
          {/* Rute Publik */}
          <Route path="/" element={<HomePage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/order-success" element={<OrderSuccessPage />} />

          {/* Rute Terproteksi */}
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

          {/* Rute Admin */}
          <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
            {/* Halaman default bisa diarahkan ke kelola produk */}
            <Route index element={<ManageProductsPage />} /> 
            <Route path="products" element={<ManageProductsPage />} />
            <Route path="products/new" element={<ProductFormPage />} />
            <Route path="products/edit/:id" element={<ProductFormPage />} />
            <Route path="orders" element={<ManageOrdersPage />} />
            <Route path="reviews" element={<ManageReviewsPage />} />
          </Route>
        </Routes>
      </main>
    </div>
  )
}

export default App;