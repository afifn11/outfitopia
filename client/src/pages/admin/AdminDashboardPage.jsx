import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
    Package, 
    ShoppingCart, 
    MessageSquare, 
    Users, 
    TrendingUp, 
    DollarSign,
    Star,
    Clock,
    Truck,
    CheckCircle,
    XCircle,
    ArrowUpRight,
    ArrowDownRight,
    Calendar,
    Eye
} from 'lucide-react';
import api from '../../services/api';

const AdminDashboardPage = () => {
    const [loading, setLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState({
        totalProducts: 0,
        totalOrders: 0,
        totalReviews: 0,
        totalRevenue: 0,
        recentOrders: [],
        orderStats: {
            pending: 0,
            shipped: 0,
            completed: 0,
            cancelled: 0
        },
        topProducts: [],
        recentReviews: []
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            
            // Fetch all required data
            const [productsRes, ordersRes, reviewsRes] = await Promise.all([
                api.get('/products?limit=9999'), 
                api.get('/admin/orders'),
                api.get('/admin/reviews')
            ]);

            const products = productsRes.data.products || [];
            const orders = ordersRes.data || [];
            const reviews = reviewsRes.data || [];

            const totalRevenue = orders
                .filter(order => order.status === 'Completed')
                .reduce((sum, order) => sum + parseFloat(order.total_amount), 0);

            const orderStats = {
                pending: orders.filter(o => o.status === 'Pending').length,
                shipped: orders.filter(o => o.status === 'Shipped').length,
                completed: orders.filter(o => o.status === 'Completed').length,
                cancelled: orders.filter(o => o.status === 'Cancelled').length
            };

            const recentOrders = orders
                .sort((a, b) => new Date(b.order_date) - new Date(a.order_date))
                .slice(0, 5);

            const recentReviews = reviews
                .sort((a, b) => new Date(b.created_at || Date.now()) - new Date(a.created_at || Date.now()))
                .slice(0, 3);

            setDashboardData({
                totalProducts: productsRes.data.totalProducts || 0, 
                totalOrders: orders.length,
                totalReviews: reviews.length,
                totalRevenue,
                recentOrders,
                orderStats,
                topProducts: products.slice(0, 3),
                recentReviews
            });
        } catch (error) {
            console.error('Failed to fetch dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    };

    const getStatusIcon = (status) => {
        const icons = {
            'Pending': Clock,
            'Shipped': Truck,
            'Completed': CheckCircle,
            'Cancelled': XCircle
        };
        return icons[status] || Clock;
    };

    const getStatusColor = (status) => {
        const colors = {
            'Pending': 'text-amber-600 bg-amber-100',
            'Shipped': 'text-blue-600 bg-blue-100',
            'Completed': 'text-green-600 bg-green-100',
            'Cancelled': 'text-red-600 bg-red-100'
        };
        return colors[status] || 'text-gray-600 bg-gray-100';
    };

    if (loading) {
        return (
            <div className="space-y-6">
                {/* Loading skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-pulse">
                            <div className="h-4 bg-slate-200 rounded w-1/2 mb-4"></div>
                            <div className="h-8 bg-slate-200 rounded w-1/3"></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Dashboard Admin</h1>
                        <p className="text-slate-600 mt-1">Selamat datang kembali! Berikut ringkasan toko Anda.</p>
                    </div>
                    <div className="text-sm text-slate-500 hidden sm:flex items-center">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        {new Date().toLocaleDateString('id-ID', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                        })}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Total Produk</p>
                            <p className="text-3xl font-bold text-slate-900 mt-2">{dashboardData.totalProducts}</p>
                        </div>
                        <div className="p-3 bg-indigo-100 rounded-lg">
                            <Package className="w-6 h-6 text-indigo-600" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <Link to="/admin/products" className="text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center">
                            Kelola Produk
                            <ArrowUpRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Total Pesanan</p>
                            <p className="text-3xl font-bold text-slate-900 mt-2">{dashboardData.totalOrders}</p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-lg">
                            <ShoppingCart className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <Link to="/admin/orders" className="text-green-600 text-sm font-medium hover:text-green-700 flex items-center">
                            Kelola Pesanan
                            <ArrowUpRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Total Ulasan</p>
                            <p className="text-3xl font-bold text-slate-900 mt-2">{dashboardData.totalReviews}</p>
                        </div>
                        <div className="p-3 bg-yellow-100 rounded-lg">
                            <MessageSquare className="w-6 h-6 text-yellow-600" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <Link to="/admin/reviews" className="text-yellow-600 text-sm font-medium hover:text-yellow-700 flex items-center">
                            Kelola Ulasan
                            <ArrowUpRight className="w-4 h-4 ml-1" />
                        </Link>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-600">Total Pendapatan</p>
                            <p className="text-2xl font-bold text-slate-900 mt-2">{formatPrice(dashboardData.totalRevenue)}</p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-lg">
                            <DollarSign className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="mt-4">
                        <span className="text-purple-600 text-sm font-medium flex items-center">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            Dari pesanan selesai
                        </span>
                    </div>
                </div>
            </div>

            {/* Order Status Overview */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <h2 className="text-lg font-semibold text-slate-900 mb-6">Status Pesanan</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {Object.entries(dashboardData.orderStats).map(([status, count]) => {
                        const Icon = getStatusIcon(status.charAt(0).toUpperCase() + status.slice(1));
                        const colorClass = getStatusColor(status.charAt(0).toUpperCase() + status.slice(1));
                        
                        return (
                            <div key={status} className="flex items-center space-x-3 p-4 bg-slate-50 rounded-lg">
                                <div className={`p-2 rounded-lg ${colorClass}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-2xl font-bold text-slate-900">{count}</p>
                                    <p className="text-sm text-slate-600 capitalize">{status}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-900">Pesanan Terbaru</h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {dashboardData.recentOrders.length > 0 ? (
                            dashboardData.recentOrders.map((order) => (
                                <div key={order.id} className="p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-slate-900">#{order.id}</p>
                                            <p className="text-sm text-slate-600">{order.userName}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium text-slate-900">{formatPrice(order.total_amount)}</p>
                                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                {order.status}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-slate-400">
                                <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Belum ada pesanan</p>
                            </div>
                        )}
                    </div>
                    {dashboardData.recentOrders.length > 0 && (
                        <div className="p-4 bg-slate-50 border-t border-slate-200">
                            <Link to="/admin/orders" className="text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center justify-center">
                                Lihat Semua Pesanan
                                <Eye className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                    )}
                </div>

                {/* Recent Reviews */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-6 border-b border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-900">Ulasan Terbaru</h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {dashboardData.recentReviews.length > 0 ? (
                            dashboardData.recentReviews.map((review) => (
                                <div key={review.id} className="p-4 hover:bg-slate-50 transition-colors">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1 mr-4">
                                            <p className="font-medium text-slate-900">{review.productName}</p>
                                            <p className="text-sm text-slate-600 mb-2">{review.userName}</p>
                                            <p className="text-sm text-slate-700 italic line-clamp-2">"{review.comment}"</p>
                                        </div>
                                        <div className="flex items-center shrink-0">
                                            <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                            <span className="text-sm font-medium text-slate-700 ml-1">{review.rating}</span>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-8 text-center text-slate-400">
                                <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                <p>Belum ada ulasan</p>
                            </div>
                        )}
                    </div>
                    {dashboardData.recentReviews.length > 0 && (
                        <div className="p-4 bg-slate-50 border-t border-slate-200">
                            <Link to="/admin/reviews" className="text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center justify-center">
                                Lihat Semua Ulasan
                                <Eye className="w-4 h-4 ml-1" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;