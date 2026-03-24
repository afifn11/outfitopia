import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, ShoppingCart, MessageSquare, TrendingUp, DollarSign, Star,
         Clock, Truck, CheckCircle, XCircle, ArrowUpRight, Calendar, Eye,
         Sparkles, RefreshCw, AlertCircle } from 'lucide-react';
import api from '../../services/api';
import { formatPrice } from '../../utils/format';

// ─── Sub-components ────────────────────────────────────────────────────────────

const StatCard = ({ title, value, icon: Icon, color, link, linkLabel }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
            <div>
                <p className="text-sm text-slate-500 mb-1">{title}</p>
                <p className="text-3xl font-bold text-slate-900">{value}</p>
            </div>
            <div className={`p-3 rounded-xl ${color}`}>
                <Icon className="w-6 h-6" />
            </div>
        </div>
        {link && (
            <Link to={link} className="text-sm font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
                {linkLabel} <ArrowUpRight className="w-4 h-4" />
            </Link>
        )}
    </div>
);

const StatusBadge = ({ status }) => {
    const map = {
        Pending:   'bg-amber-50 text-amber-700',
        Processing:'bg-blue-50 text-blue-700',
        Shipped:   'bg-indigo-50 text-indigo-700',
        Completed: 'bg-green-50 text-green-700',
        Cancelled: 'bg-red-50 text-red-700',
    };
    return (
        <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${map[status] || map.Pending}`}>
            {status}
        </span>
    );
};

const OrderStatusStat = ({ label, count, Icon, iconClass }) => (
    <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl">
        <div className={`p-2 rounded-lg ${iconClass}`}><Icon className="w-5 h-5" /></div>
        <div>
            <p className="text-2xl font-bold text-slate-900">{count}</p>
            <p className="text-sm text-slate-500 capitalize">{label}</p>
        </div>
    </div>
);

const AIInsightCard = ({ insight }) => {
    const typeStyle = {
        success: 'border-l-green-500 bg-green-50',
        warning: 'border-l-amber-500 bg-amber-50',
        info:    'border-l-blue-500 bg-blue-50',
    };
    const titleStyle = {
        success: 'text-green-800',
        warning: 'text-amber-800',
        info:    'text-blue-800',
    };
    const bodyStyle = {
        success: 'text-green-700',
        warning: 'text-amber-700',
        info:    'text-blue-700',
    };
    const style = typeStyle[insight.type] || typeStyle.info;
    return (
        <div className={`border-l-4 p-4 rounded-r-xl ${style}`}>
            <p className={`font-semibold text-sm mb-1 ${titleStyle[insight.type] || titleStyle.info}`}>{insight.title}</p>
            <p className={`text-sm mb-2 ${bodyStyle[insight.type] || bodyStyle.info}`}>{insight.insight}</p>
            <p className={`text-xs font-medium ${bodyStyle[insight.type] || bodyStyle.info}`}>→ {insight.action}</p>
        </div>
    );
};

// ─── Main component ────────────────────────────────────────────────────────────

const AdminDashboardPage = () => {
    const [loading, setLoading]       = useState(true);
    const [aiLoading, setAiLoading]   = useState(false);
    const [aiInsights, setAiInsights] = useState([]);
    const [aiError, setAiError]       = useState('');
    const [data, setData] = useState({
        totalProducts: 0, totalOrders: 0, totalReviews: 0, totalRevenue: 0,
        recentOrders: [], orderStats: { pending:0, processing:0, shipped:0, completed:0, cancelled:0 },
        recentReviews: [],
    });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsRes, ordersRes, reviewsRes] = await Promise.all([
                api.get('/products?limit=9999'),
                api.get('/admin/orders'),
                api.get('/admin/reviews'),
            ]);
            const products = productsRes.data.products || [];
            const orders   = ordersRes.data  || [];
            const reviews  = reviewsRes.data || [];

            const totalRevenue = orders
                .filter(o => o.status === 'Completed')
                .reduce((s, o) => s + parseFloat(o.total_amount || 0), 0);

            const orderStats = {
                pending:    orders.filter(o => o.status === 'Pending').length,
                processing: orders.filter(o => o.status === 'Processing').length,
                shipped:    orders.filter(o => o.status === 'Shipped').length,
                completed:  orders.filter(o => o.status === 'Completed').length,
                cancelled:  orders.filter(o => o.status === 'Cancelled').length,
            };

            setData({
                totalProducts: productsRes.data.totalProducts || products.length,
                totalOrders:   orders.length,
                totalReviews:  reviews.length,
                totalRevenue,
                recentOrders:  [...orders].sort((a,b) => new Date(b.order_date)-new Date(a.order_date)).slice(0,5),
                orderStats,
                recentReviews: [...reviews].sort((a,b) => new Date(b.created_at||0)-new Date(a.created_at||0)).slice(0,3),
            });
        } catch (err) {
            console.error('Dashboard fetch error:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchAiAnalysis = async () => {
        setAiLoading(true);
        setAiError('');
        try {
            const res = await api.get('/ai/analyze');
            setAiInsights(res.data.insights || []);
        } catch (err) {
            setAiError(err.response?.data?.message || 'AI tidak tersedia. Pastikan GEMINI_API_KEY sudah diisi di .env');
        } finally {
            setAiLoading(false);
        }
    };

    const orderStatusConfig = [
        { key:'pending',    label:'Pending',    Icon:Clock,        iconClass:'bg-amber-100 text-amber-600' },
        { key:'processing', label:'Processing', Icon:TrendingUp,   iconClass:'bg-blue-100 text-blue-600' },
        { key:'shipped',    label:'Shipped',    Icon:Truck,        iconClass:'bg-indigo-100 text-indigo-600' },
        { key:'completed',  label:'Completed',  Icon:CheckCircle,  iconClass:'bg-green-100 text-green-600' },
        { key:'cancelled',  label:'Cancelled',  Icon:XCircle,      iconClass:'bg-red-100 text-red-600' },
    ];

    if (loading) return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1,2,3,4].map(i => (
                    <div key={i} className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse">
                        <div className="h-4 bg-slate-200 rounded w-1/2 mb-4" />
                        <div className="h-8 bg-slate-200 rounded w-1/3" />
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
                        <p className="text-slate-500 mt-1 text-sm">Ringkasan performa toko Outfitopia</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-slate-500 hidden sm:flex items-center gap-1.5">
                            <Calendar className="w-4 h-4" />
                            {new Date().toLocaleDateString('id-ID', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
                        </span>
                        <button onClick={fetchData} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
                            <RefreshCw className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Total Produk"    value={data.totalProducts} icon={Package}      color="bg-indigo-100 text-indigo-600" link="/admin/products" linkLabel="Kelola Produk" />
                <StatCard title="Total Pesanan"   value={data.totalOrders}   icon={ShoppingCart}  color="bg-green-100 text-green-600"   link="/admin/orders"  linkLabel="Kelola Pesanan" />
                <StatCard title="Total Ulasan"    value={data.totalReviews}  icon={MessageSquare} color="bg-yellow-100 text-yellow-600" link="/admin/reviews" linkLabel="Kelola Ulasan" />
                <StatCard title="Revenue (Selesai)" value={formatPrice(data.totalRevenue)} icon={DollarSign} color="bg-purple-100 text-purple-600" />
            </div>

            {/* Order status overview */}
            <div className="bg-white rounded-xl border border-slate-200 p-6">
                <h2 className="text-base font-semibold text-slate-900 mb-5">Status Pesanan</h2>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {orderStatusConfig.map(({ key, label, Icon, iconClass }) => (
                        <OrderStatusStat key={key} label={label} count={data.orderStats[key]} Icon={Icon} iconClass={iconClass} />
                    ))}
                </div>
            </div>

            {/* AI Analysis section */}
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="p-6 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-indigo-500" />
                        <h2 className="text-base font-semibold text-slate-900">AI Business Insights</h2>
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-medium">Gemini AI</span>
                    </div>
                    <button onClick={fetchAiAnalysis} disabled={aiLoading}
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-60 transition-colors">
                        {aiLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                        {aiLoading ? 'Menganalisis...' : 'Analisis Sekarang'}
                    </button>
                </div>
                <div className="p-6">
                    {aiError ? (
                        <div className="flex items-start gap-3 p-4 bg-red-50 rounded-xl border border-red-200">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-700">{aiError}</p>
                        </div>
                    ) : aiInsights.length > 0 ? (
                        <div className="space-y-3">
                            {aiInsights.map((insight, i) => <AIInsightCard key={i} insight={insight} />)}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Sparkles className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                            <p className="text-slate-500 text-sm mb-1">Dapatkan insight bisnis bertenaga AI</p>
                            <p className="text-slate-400 text-xs">Klik "Analisis Sekarang" untuk mendapatkan rekomendasi dari Gemini AI</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Orders & Reviews */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="p-5 border-b border-slate-200">
                        <h2 className="text-base font-semibold text-slate-900">Pesanan Terbaru</h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {data.recentOrders.length > 0 ? data.recentOrders.map(order => (
                            <div key={order.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-slate-900">#{order.id} · {order.userName}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">
                                        {new Date(order.order_date).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })}
                                    </p>
                                </div>
                                <div className="text-right flex flex-col items-end gap-1">
                                    <span className="text-sm font-medium text-slate-900">{formatPrice(order.total_amount)}</span>
                                    <StatusBadge status={order.status} />
                                </div>
                            </div>
                        )) : (
                            <div className="p-12 text-center text-slate-400">
                                <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-40" />
                                <p className="text-sm">Belum ada pesanan</p>
                            </div>
                        )}
                    </div>
                    {data.recentOrders.length > 0 && (
                        <div className="p-4 bg-slate-50 border-t border-slate-200">
                            <Link to="/admin/orders" className="text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center justify-center gap-1">
                                Lihat Semua <Eye className="w-4 h-4" />
                            </Link>
                        </div>
                    )}
                </div>

                <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                    <div className="p-5 border-b border-slate-200">
                        <h2 className="text-base font-semibold text-slate-900">Ulasan Terbaru</h2>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {data.recentReviews.length > 0 ? data.recentReviews.map(review => (
                            <div key={review.id} className="p-4 hover:bg-slate-50 transition-colors">
                                <div className="flex justify-between items-start gap-3">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-900 truncate">{review.productName}</p>
                                        <p className="text-xs text-slate-500 mb-1">{review.userName}</p>
                                        <p className="text-sm text-slate-600 line-clamp-1 italic">"{review.comment}"</p>
                                    </div>
                                    <div className="flex items-center gap-1 flex-shrink-0">
                                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                        <span className="text-sm font-semibold text-slate-700">{review.rating}</span>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="p-12 text-center text-slate-400">
                                <MessageSquare className="w-10 h-10 mx-auto mb-3 opacity-40" />
                                <p className="text-sm">Belum ada ulasan</p>
                            </div>
                        )}
                    </div>
                    {data.recentReviews.length > 0 && (
                        <div className="p-4 bg-slate-50 border-t border-slate-200">
                            <Link to="/admin/reviews" className="text-indigo-600 text-sm font-medium hover:text-indigo-700 flex items-center justify-center gap-1">
                                Lihat Semua <Eye className="w-4 h-4" />
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboardPage;
