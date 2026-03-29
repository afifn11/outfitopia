import React, { Suspense, lazy } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import AIChatWidget from './components/AIChatWidget';

const PublicLayout = () => (
    <div className="flex flex-col min-h-screen bg-white">
        <Navbar />
        <main className="flex-grow"><Outlet /></main>
        <Footer />
        <AIChatWidget />
    </div>
);
const AdminLayoutWrapper = () => (
    <AdminRoute><AdminLayout /></AdminRoute>
);

// Public pages
const HomePage           = lazy(() => import('./pages/HomePage'));
const ProductDetailPage  = lazy(() => import('./pages/ProductDetailPage'));
const CartPage           = lazy(() => import('./pages/CartPage'));
const CheckoutPage       = lazy(() => import('./pages/CheckoutPage'));
const OrderSuccessPage   = lazy(() => import('./pages/OrderSuccessPage'));
const OrderDetailPage    = lazy(() => import('./pages/OrderDetailPage'));
const LoginPage          = lazy(() => import('./pages/LoginPage'));
const RegisterPage       = lazy(() => import('./pages/RegisterPage'));
const ProfilePage        = lazy(() => import('./pages/ProfilePage'));
const WishlistPage       = lazy(() => import('./pages/WishlistPage'));
const CategoryPage       = lazy(() => import('./pages/CategoryPage'));
const AllProductsPage    = lazy(() => import('./pages/AllProductsPage'));
const ContactPage        = lazy(() => import('./pages/ContactPage'));
const FaqPage            = lazy(() => import('./pages/FaqPage'));
const PrivacyPolicyPage  = lazy(() => import('./pages/PrivacyPolicyPage'));
const ReturnPolicyPage   = lazy(() => import('./pages/ReturnPolicyPage'));
const TermsOfServicePage = lazy(() => import('./pages/TermsOfServicePage'));
const GoogleAuthSuccess  = lazy(() => import('./pages/GoogleAuthSuccess'));

// Admin pages
const AdminLayout        = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const ManageProductsPage = lazy(() => import('./pages/admin/ManageProductsPage'));
const ManageOrdersPage   = lazy(() => import('./pages/admin/ManageOrdersPage'));
const ProductFormPage    = lazy(() => import('./pages/admin/ProductFormPage'));
const ManageReviewsPage  = lazy(() => import('./pages/admin/ManageReviewsPage'));

const LoadingFallback = () => (
    <div className="flex justify-center items-center min-h-[60vh]">
        <div className="w-6 h-6 border-2 border-[#0a0a0a] border-t-transparent rounded-full animate-spin" />
    </div>
);

function App() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />

                <Route element={<PublicLayout />}>
                    <Route path="/"                   element={<HomePage />} />
                    <Route path="/product/:id"        element={<ProductDetailPage />} />
                    <Route path="/cart"               element={<CartPage />} />
                    <Route path="/login"              element={<LoginPage />} />
                    <Route path="/register"           element={<RegisterPage />} />
                    <Route path="/order-success"      element={<OrderSuccessPage />} />
                    <Route path="/category/:categoryName" element={<CategoryPage />} />
                    <Route path="/products"           element={<AllProductsPage />} />
                    <Route path="/contact"            element={<ContactPage />} />
                    <Route path="/faq"                element={<FaqPage />} />
                    <Route path="/privacy-policy"     element={<PrivacyPolicyPage />} />
                    <Route path="/return-policy"      element={<ReturnPolicyPage />} />
                    <Route path="/terms-of-service"   element={<TermsOfServicePage />} />
                    {/* Protected routes */}
                    <Route path="/checkout"   element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
                    <Route path="/profile"    element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                    <Route path="/orders/:id" element={<ProtectedRoute><OrderDetailPage /></ProtectedRoute>} />
                    <Route path="/wishlist"   element={<ProtectedRoute><WishlistPage /></ProtectedRoute>} />
                </Route>

                <Route path="/admin" element={<AdminLayoutWrapper />}>
                    <Route index                    element={<AdminDashboardPage />} />
                    <Route path="products"          element={<ManageProductsPage />} />
                    <Route path="products/new"      element={<ProductFormPage />} />
                    <Route path="products/edit/:id" element={<ProductFormPage />} />
                    <Route path="orders"            element={<ManageOrdersPage />} />
                    <Route path="reviews"           element={<ManageReviewsPage />} />
                </Route>
            </Routes>
        </Suspense>
    );
}

export default App;
