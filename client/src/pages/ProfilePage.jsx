// client/src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { formatPrice } from '../utils/format';
import { User, Package, CreditCard, LogOut, ChevronRight, ShoppingBag, Heart } from 'lucide-react';

const STATUS_CONFIG = {
    Pending:    { class: 'bg-amber-50 text-amber-700 border-amber-200' },
    Processing: { class: 'bg-blue-50 text-blue-700 border-blue-200' },
    Shipped:    { class: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    Completed:  { class: 'bg-[#0a0a0a] text-white border-[#0a0a0a]' },
    Cancelled:  { class: 'bg-white text-[#a0a0a0] border-[#e8e8e8]' },
};

const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
    return (
        <span className={`inline-block border text-[10px] font-medium tracking-[0.06em] uppercase px-2.5 py-1 ${cfg.class}`}>
            {status}
        </span>
    );
};

const StatCard = ({ icon: Icon, label, value }) => (
    <div className="bg-[#fafafa] p-5">
        <div className="flex items-center gap-3 mb-2">
            <Icon size={16} className="text-[#a0a0a0]" strokeWidth={1.5} />
            <span className="text-[11px] tracking-[0.06em] uppercase text-[#a0a0a0]">{label}</span>
        </div>
        <p className="text-[22px] font-normal text-[#0a0a0a] tracking-tight">{value}</p>
    </div>
);

const ProfilePage = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [orders, setOrders]   = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/orders/my-orders')
            .then(r => setOrders(r.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleLogout = () => { logout(); navigate('/'); };

    const stats = {
        total:     orders.length,
        completed: orders.filter(o => o.status === 'Completed').length,
        spent:     orders.filter(o => o.status === 'Completed').reduce((s, o) => s + Number(o.total_amount), 0),
    };

    return (
        <div className="page-enter min-h-screen bg-[#fafafa]">
            <div className="max-w-4xl mx-auto px-6 py-10">

                {/* Profile header */}
                <div className="bg-white border border-[#e8e8e8] p-8 mb-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-5">
                            <div className="w-14 h-14 bg-[#0a0a0a] flex items-center justify-center flex-shrink-0">
                                <span className="text-white text-lg font-medium">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h1 className="text-[18px] font-normal text-[#0a0a0a] mb-0.5">{user?.name}</h1>
                                <p className="text-[13px] text-[#6b6b6b]">{user?.email}</p>
                                <span className="inline-block mt-2 text-[10px] font-medium tracking-[0.08em] uppercase px-2 py-0.5 bg-[#f4f4f4] text-[#6b6b6b]">
                                    {user?.role === 'admin' ? 'Administrator' : 'Member'}
                                </span>
                            </div>
                        </div>
                        <button onClick={handleLogout}
                            className="flex items-center gap-2 text-[11px] tracking-wide uppercase text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors">
                            <LogOut size={14} strokeWidth={1.5} />
                            Sign out
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <StatCard icon={Package}     label="Total orders"  value={stats.total} />
                    <StatCard icon={ShoppingBag} label="Completed"     value={stats.completed} />
                    <StatCard icon={CreditCard}  label="Total spent"   value={formatPrice(stats.spent)} />
                </div>

                {/* Quick links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    <Link to="/wishlist"
                        className="flex items-center justify-between bg-white border border-[#e8e8e8] px-6 py-4 hover:bg-[#fafafa] transition-colors">
                        <div className="flex items-center gap-3">
                            <Heart size={16} strokeWidth={1.5} className="text-[#6b6b6b]" />
                            <span className="text-[12px] font-medium tracking-wide uppercase text-[#0a0a0a]">Wishlist saya</span>
                        </div>
                        <ChevronRight size={14} strokeWidth={1.5} className="text-[#a0a0a0]" />
                    </Link>
                    {user?.role === 'admin' && (
                        <Link to="/admin"
                            className="flex items-center justify-between bg-[#0a0a0a] px-6 py-4 hover:opacity-90 transition-opacity">
                            <div className="flex items-center gap-3">
                                <User size={16} strokeWidth={1.5} className="text-white" />
                                <span className="text-[12px] font-medium tracking-wide uppercase text-white">Admin Panel</span>
                            </div>
                            <ChevronRight size={14} strokeWidth={1.5} className="text-white" />
                        </Link>
                    )}
                </div>

                {/* Order history */}
                <div className="mb-2">
                    <p className="label-sm text-[#0a0a0a] mb-4">Order History</p>
                </div>

                {loading ? (
                    <div className="space-y-3">
                        {[1,2,3].map(i => <div key={i} className="h-20 bg-[#f4f4f4] animate-pulse" />)}
                    </div>
                ) : orders.length === 0 ? (
                    <div className="bg-white border border-[#e8e8e8] py-20 text-center">
                        <ShoppingBag size={32} className="text-[#d0d0d0] mx-auto mb-4" strokeWidth={1} />
                        <p className="text-[12px] tracking-wide uppercase text-[#a0a0a0] mb-5">No orders yet</p>
                        <Link to="/" className="btn-black">Start shopping →</Link>
                    </div>
                ) : (
                    <div className="bg-white border border-[#e8e8e8]">
                        {orders.map((order, idx) => (
                            <Link key={order.id} to={`/orders/${order.id}`}
                                className={`flex items-center justify-between px-6 py-5 hover:bg-[#fafafa] transition-colors group ${idx < orders.length - 1 ? 'border-b border-[#e8e8e8]' : ''}`}>
                                <div className="flex items-center gap-5">
                                    <div className="w-9 h-9 bg-[#f4f4f4] flex items-center justify-center flex-shrink-0">
                                        <Package size={14} className="text-[#a0a0a0]" strokeWidth={1.5} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="text-[13px] font-medium text-[#0a0a0a]">Order #{order.id}</span>
                                            <StatusBadge status={order.status || 'Pending'} />
                                        </div>
                                        <p className="text-[11px] text-[#a0a0a0]">
                                            {new Date(order.order_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                            {order.payment_method && ` · ${order.payment_method}`}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <p className="text-[14px] font-medium text-[#0a0a0a]">{formatPrice(order.total_amount)}</p>
                                    <ChevronRight size={14} strokeWidth={1.5} className="text-[#a0a0a0] group-hover:text-[#0a0a0a] transition-colors" />
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
