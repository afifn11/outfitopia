import React, { Suspense, lazy } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Footer from './components/Footer';

// --- Komponen Layout Wrapper ---
const PublicLayout = () => (
    // 1. Tambahkan div pembungkus dengan flexbox untuk sticky footer
    <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
            <Outlet />
        </main>
        <Footer />
    </div>
);

const AdminLayoutWrapper = () => (
    <AdminRoute>
        <AdminLayout />
    </AdminRoute>
);
// ------------------------------


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
const ContactPage = lazy(() => import('./pages/ContactPage'));
const FaqPage = lazy(() => import('./pages/FaqPage'));
const PrivacyPolicyPage = lazy(() => import('./pages/PrivacyPolicyPage'));
const ReturnPolicyPage = lazy(() => import('./pages/ReturnPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));

// Admin Pages
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const ManageProductsPage = lazy(() => import('./pages/admin/ManageProductsPage'));
const ManageOrdersPage = lazy(() => import('./pages/admin/ManageOrdersPage'));
const ProductFormPage = lazy(() => import('./pages/admin/ProductFormPage'));
const ManageReviewsPage = lazy(() => import('./pages/admin/ManageReviewsPage'));

const LoadingFallback = () => (
    <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-gray-900"></div>
    </div>
);

function App() {
  return (
    <div className="bg-slate-50 min-h-screen">
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {/* --- RUTE PUBLIK & USER (menggunakan PublicLayout) --- */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/order-success" element={<OrderSuccessPage />} />
            <Route path="/category/:categoryName" element={<CategoryPage />} />
            <Route path="/products" element={<AllProductsPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/return-policy" element={<ReturnPolicyPage />} />
            <Route path="/terms-of-service" element={<TermsOfServicePage />} />
            
            <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          </Route>

          {/* --- RUTE ADMIN (menggunakan AdminLayout mandiri) --- */}
          <Route path="/admin" element={<AdminLayoutWrapper />}>
            <Route index element={<AdminDashboardPage />} />
            <Route path="products" element={<ManageProductsPage />} />
            <Route path="products/new" element={<ProductFormPage />} />
            <Route path="products/edit/:id" element={<ProductFormPage />} />
            <Route path="orders" element={<ManageOrdersPage />} />
            <Route path="reviews" element={<ManageReviewsPage />} />
          </Route>
        </Routes>
      </Suspense>
    </div>
  )
}

export default App;