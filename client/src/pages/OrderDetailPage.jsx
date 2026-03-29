// client/src/pages/OrderDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { formatPrice } from '../utils/format';
import { Package, MapPin, Phone, CreditCard, ChevronLeft, Star } from 'lucide-react';

const STATUS_STEPS = ['Pending', 'Processing', 'Shipped', 'Completed'];

const STATUS_CONFIG = {
    Pending:    { color: 'bg-amber-50 text-amber-700 border-amber-200' },
    Processing: { color: 'bg-blue-50 text-blue-700 border-blue-200' },
    Shipped:    { color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    Completed:  { color: 'bg-green-50 text-green-700 border-green-200' },
    Cancelled:  { color: 'bg-red-50 text-red-700 border-red-200' },
};

const StatusBadge = ({ status }) => {
    const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
    return (
        <span className={`inline-block border text-[11px] font-medium tracking-wide uppercase px-3 py-1 rounded-full ${cfg.color}`}>
            {status}
        </span>
    );
};

const OrderTimeline = ({ status }) => {
    if (status === 'Cancelled') return (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="w-3 h-3 bg-red-500 rounded-full flex-shrink-0" />
            <p className="text-sm text-red-700 font-medium">Pesanan dibatalkan</p>
        </div>
    );

    const currentIdx = STATUS_STEPS.indexOf(status);
    return (
        <div className="relative">
            {STATUS_STEPS.map((step, idx) => {
                const isDone    = idx <= currentIdx;
                const isCurrent = idx === currentIdx;
                return (
                    <div key={step} className="flex items-start gap-4 mb-4 last:mb-0">
                        <div className="flex flex-col items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                                isDone
                                    ? 'bg-[#0a0a0a] border-[#0a0a0a]'
                                    : 'bg-white border-[#e8e8e8]'
                            }`}>
                                {isDone ? (
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                                        <polyline points="20 6 9 17 4 12" />
                                    </svg>
                                ) : (
                                    <div className="w-2 h-2 rounded-full bg-[#d0d0d0]" />
                                )}
                            </div>
                            {idx < STATUS_STEPS.length - 1 && (
                                <div className={`w-0.5 h-8 mt-1 ${isDone && idx < currentIdx ? 'bg-[#0a0a0a]' : 'bg-[#e8e8e8]'}`} />
                            )}
                        </div>
                        <div className="pt-1">
                            <p className={`text-[13px] font-medium ${isDone ? 'text-[#0a0a0a]' : 'text-[#a0a0a0]'}`}>
                                {step}
                            </p>
                            {isCurrent && (
                                <p className="text-[11px] text-[#6b6b6b] mt-0.5">Status saat ini</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

const OrderDetailPage = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        api.get(`/orders/${id}`)
            .then(r => { setOrder(r.data.order); setItems(r.data.items); })
            .catch(() => setError('Pesanan tidak ditemukan.'))
            .finally(() => setLoading(false));
    }, [id]);

    if (loading) return (
        <div className="max-w-3xl mx-auto px-6 py-10 space-y-4">
            {[1,2,3].map(i => <div key={i} className="h-24 bg-[#f4f4f4] rounded-xl animate-pulse" />)}
        </div>
    );

    if (error) return (
        <div className="max-w-3xl mx-auto px-6 py-20 text-center">
            <Package size={40} className="text-[#d0d0d0] mx-auto mb-4" strokeWidth={1} />
            <p className="text-[13px] text-[#6b6b6b] mb-5">{error}</p>
            <Link to="/profile" className="btn-black">← Kembali ke profil</Link>
        </div>
    );

    const subtotal     = items.reduce((s, i) => s + Number(i.price) * i.quantity, 0);
    const shippingCost = Number(order.total_amount) - subtotal;

    return (
        <div className="page-enter max-w-3xl mx-auto px-6 py-10">
            {/* Back link */}
            <Link to="/profile" className="inline-flex items-center gap-2 text-[11px] tracking-wide uppercase text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors mb-8">
                <ChevronLeft size={14} strokeWidth={1.5} />
                Kembali ke profil
            </Link>

            {/* Header */}
            <div className="flex items-start justify-between mb-8">
                <div>
                    <h1 className="text-[18px] font-normal text-[#0a0a0a] mb-1">Order #{order.id}</h1>
                    <p className="text-[12px] text-[#a0a0a0]">
                        {new Date(order.order_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                        {order.payment_method && ` · ${order.payment_method}`}
                    </p>
                </div>
                <StatusBadge status={order.status || 'Pending'} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_260px] gap-6">
                {/* Left column */}
                <div className="space-y-5">
                    {/* Order items */}
                    <div className="bg-white border border-[#e8e8e8]">
                        <div className="px-5 py-4 border-b border-[#e8e8e8]">
                            <p className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#0a0a0a]">
                                Item Pesanan ({items.length})
                            </p>
                        </div>
                        <div className="divide-y divide-[#e8e8e8]">
                            {items.map(item => (
                                <div key={item.id} className="flex gap-4 p-5">
                                    <Link to={`/product/${item.productId}`} className="flex-shrink-0">
                                        <div className="w-16 aspect-[3/4] bg-[#f4f4f4] overflow-hidden hover:opacity-80 transition-opacity">
                                            <img src={item.productImage} alt={item.productName}
                                                className="w-full h-full object-cover" />
                                        </div>
                                    </Link>
                                    <div className="flex-1 min-w-0">
                                        <Link to={`/product/${item.productId}`}
                                            className="text-[13px] font-medium text-[#0a0a0a] hover:underline underline-offset-2 block truncate">
                                            {item.productName}
                                        </Link>
                                        <p className="text-[11px] text-[#a0a0a0] mt-0.5">
                                            Size: {item.size} · Qty: {item.quantity}
                                        </p>
                                        <p className="text-[13px] text-[#0a0a0a] mt-2 font-medium">
                                            {formatPrice(item.price * item.quantity)}
                                        </p>
                                    </div>
                                    {order.status === 'Completed' && (
                                        <Link to={`/product/${item.productId}#reviews`}
                                            className="flex-shrink-0 self-center flex items-center gap-1.5 text-[11px] tracking-wide uppercase text-[#6b6b6b] border border-[#e8e8e8] px-3 py-2 hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-all">
                                            <Star size={12} strokeWidth={1.5} />
                                            Review
                                        </Link>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Shipping info */}
                    <div className="bg-white border border-[#e8e8e8] p-5 space-y-4">
                        <p className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#0a0a0a]">Info Pengiriman</p>
                        <div className="flex items-start gap-3">
                            <Package size={15} className="text-[#a0a0a0] mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                            <div>
                                <p className="text-[13px] font-medium text-[#0a0a0a]">{order.customer_name}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <Phone size={15} className="text-[#a0a0a0] mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                            <p className="text-[13px] text-[#6b6b6b]">{order.customer_phone}</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <MapPin size={15} className="text-[#a0a0a0] mt-0.5 flex-shrink-0" strokeWidth={1.5} />
                            <p className="text-[13px] text-[#6b6b6b] leading-relaxed">{order.shipping_address}</p>
                        </div>
                    </div>
                </div>

                {/* Right column */}
                <div className="space-y-5">
                    {/* Order summary */}
                    <div className="bg-white border border-[#e8e8e8] p-5">
                        <p className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#0a0a0a] mb-4">Ringkasan</p>
                        <div className="space-y-2.5 mb-3">
                            <div className="flex justify-between text-[12px]">
                                <span className="text-[#6b6b6b]">Subtotal</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-[12px]">
                                <span className="text-[#6b6b6b]">Ongkos kirim</span>
                                <span>{shippingCost <= 0 ? 'Gratis' : formatPrice(shippingCost)}</span>
                            </div>
                            {order.payment_method && (
                                <div className="flex items-center gap-2 text-[12px]">
                                    <CreditCard size={13} className="text-[#a0a0a0]" strokeWidth={1.5} />
                                    <span className="text-[#6b6b6b] capitalize">{order.payment_method}</span>
                                </div>
                            )}
                        </div>
                        <div className="h-px bg-[#e8e8e8] mb-3" />
                        <div className="flex justify-between text-[14px] font-medium">
                            <span>Total</span>
                            <span>{formatPrice(order.total_amount)}</span>
                        </div>
                    </div>

                    {/* Status timeline */}
                    <div className="bg-white border border-[#e8e8e8] p-5">
                        <p className="text-[11px] font-medium tracking-[0.08em] uppercase text-[#0a0a0a] mb-5">Status Pesanan</p>
                        <OrderTimeline status={order.status || 'Pending'} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailPage;
