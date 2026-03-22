// client/src/pages/CheckoutPage.jsx
// Midtrans Snap — payment popup langsung di halaman checkout

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatPrice } from '../utils/format';
import Swal from 'sweetalert2';

// Load Midtrans Snap script secara dinamis
const loadSnapScript = (clientKey) => {
    return new Promise((resolve) => {
        if (window.snap) { resolve(); return; }
        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', clientKey);
        script.onload = resolve;
        document.head.appendChild(script);
    });
};

const MIDTRANS_CLIENT_KEY = import.meta.env.VITE_MIDTRANS_CLIENT_KEY || 'Mid-client-2Q_1X5xKhr2F9sQ1';

const CheckoutPage = () => {
    const { cartItems, clearCart } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [snapReady, setSnapReady] = useState(false);
    const [form, setForm] = useState({
        name:    user?.name || '',
        phone:   '',
        address: '',
    });

    const totalPrice  = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
    const shipping    = totalPrice >= 500000 ? 0 : 30000;
    const grandTotal  = totalPrice + shipping;

    // Redirect ke cart jika kosong
    useEffect(() => {
        if (cartItems.length === 0) navigate('/cart');
    }, [cartItems, navigate]);

    // Load Midtrans Snap script saat komponen mount
    useEffect(() => {
        loadSnapScript(MIDTRANS_CLIENT_KEY).then(() => setSnapReady(true));
    }, []);

    const handleChange = (e) =>
        setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name || !form.phone || !form.address) {
            Swal.fire({ title: 'Lengkapi Data', text: 'Semua field harus diisi.', icon: 'warning', confirmButtonColor: '#0a0a0a' });
            return;
        }

        if (!snapReady) {
            Swal.fire({ title: 'Mohon Tunggu', text: 'Sistem pembayaran sedang dimuat.', icon: 'info', confirmButtonColor: '#0a0a0a' });
            return;
        }

        setLoading(true);

        try {
            // 1. Buat order di backend & dapatkan snap_token
            const res = await api.post('/orders', {
                userDetails: form,
                cartItems: cartItems.map(i => ({
                    id:           i.id,
                    name:         i.name,
                    quantity:     i.quantity,
                    price:        i.price,
                    selectedSize: i.selectedSize || i.size || 'ONE SIZE',
                })),
                totalPrice: grandTotal,
            });

            const { snap_token, orderId } = res.data;
            setLoading(false);

            // 2. Buka Midtrans Snap popup
            window.snap.pay(snap_token, {
                onSuccess: (result) => {
                    console.log('[Midtrans] Payment success:', result);
                    clearCart();
                    navigate('/order-success', { state: { orderId } });
                },
                onPending: (result) => {
                    console.log('[Midtrans] Payment pending:', result);
                    clearCart();
                    Swal.fire({
                        title: 'Pembayaran Pending',
                        text:  'Selesaikan pembayaranmu sesuai instruksi yang dikirim.',
                        icon:  'info',
                        confirmButtonColor: '#0a0a0a',
                    }).then(() => navigate('/order-success', { state: { orderId } }));
                },
                onError: (result) => {
                    console.error('[Midtrans] Payment error:', result);
                    Swal.fire({
                        title: 'Pembayaran Gagal',
                        text:  'Terjadi kesalahan saat pembayaran. Silakan coba lagi.',
                        icon:  'error',
                        confirmButtonColor: '#0a0a0a',
                    });
                },
                onClose: () => {
                    console.log('[Midtrans] Popup ditutup tanpa menyelesaikan pembayaran');
                    Swal.fire({
                        title: 'Pembayaran Dibatalkan',
                        text:  'Kamu menutup halaman pembayaran. Pesananmu masih tersimpan.',
                        icon:  'warning',
                        confirmButtonColor: '#0a0a0a',
                    });
                },
            });

        } catch (err) {
            setLoading(false);
            console.error('Create order error:', err);
            Swal.fire({
                title: 'Gagal Membuat Pesanan',
                text:  err.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.',
                icon:  'error',
                confirmButtonColor: '#0a0a0a',
            });
        }
    };

    if (cartItems.length === 0) return null;

    return (
        <div className="page-enter max-w-4xl mx-auto px-6 py-10">
            <h1 className="label-sm text-[#0a0a0a] mb-8">Checkout</h1>

            <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-12">
                {/* Form pengiriman */}
                <form onSubmit={handleSubmit} className="space-y-7">
                    <div>
                        <h2 className="label-sm text-[#0a0a0a] mb-6">Informasi pengiriman</h2>
                        <div className="space-y-6">
                            <div>
                                <label className="block label-sm text-[#6b6b6b] mb-2">Nama lengkap</label>
                                <input
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    required
                                    className="input-minimal"
                                    placeholder="Nama penerima"
                                />
                            </div>
                            <div>
                                <label className="block label-sm text-[#6b6b6b] mb-2">Nomor telepon</label>
                                <input
                                    name="phone"
                                    value={form.phone}
                                    onChange={handleChange}
                                    required
                                    className="input-minimal"
                                    placeholder="08xxxxxxxxxx"
                                />
                            </div>
                            <div>
                                <label className="block label-sm text-[#6b6b6b] mb-2">Alamat pengiriman</label>
                                <textarea
                                    name="address"
                                    value={form.address}
                                    onChange={handleChange}
                                    required
                                    rows={3}
                                    className="input-minimal resize-none"
                                    placeholder="Alamat lengkap termasuk kota dan kode pos"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Midtrans badge */}
                    <div className="flex items-center gap-2 py-3 border-y border-[#e8e8e8]">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#a0a0a0" strokeWidth="1.5">
                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                        </svg>
                        <span className="text-[11px] text-[#a0a0a0]">
                            Pembayaran aman diproses oleh Midtrans
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !snapReady}
                        className={`w-full py-3.5 text-[11px] font-medium tracking-wider uppercase transition-all duration-150 flex items-center justify-center gap-2
                            ${loading || !snapReady
                                ? 'bg-[#f4f4f4] text-[#a0a0a0] cursor-not-allowed'
                                : 'bg-[#0a0a0a] text-white hover:opacity-80'
                            }`}
                    >
                        {loading ? (
                            <>
                                <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Memproses...
                            </>
                        ) : (
                            `Bayar — ${formatPrice(grandTotal)}`
                        )}
                    </button>
                </form>

                {/* Order summary */}
                <div className="md:border-l md:border-[#e8e8e8] md:pl-10">
                    <h2 className="label-sm text-[#0a0a0a] mb-5">Ringkasan pesanan</h2>

                    <div className="space-y-4 mb-5">
                        {cartItems.map(item => (
                            <div key={item.cartId} className="flex items-center gap-3">
                                <div className="w-14 aspect-[3/4] bg-[#f4f4f4] flex-shrink-0 overflow-hidden">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-[12px] text-[#0a0a0a] truncate">{item.name}</p>
                                    <p className="text-[11px] text-[#a0a0a0]">
                                        Size: {item.selectedSize} · Qty: {item.quantity}
                                    </p>
                                </div>
                                <p className="text-[12px] text-[#0a0a0a] flex-shrink-0">
                                    {formatPrice(item.price * item.quantity)}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="h-px bg-[#e8e8e8] mb-4" />

                    <div className="space-y-2.5 mb-4">
                        <div className="flex justify-between text-[12px]">
                            <span className="text-[#6b6b6b]">Subtotal</span>
                            <span>{formatPrice(totalPrice)}</span>
                        </div>
                        <div className="flex justify-between text-[12px]">
                            <span className="text-[#6b6b6b]">Ongkos kirim</span>
                            <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
                        </div>
                    </div>

                    <div className="h-px bg-[#e8e8e8] mb-4" />

                    <div className="flex justify-between text-[13px] font-medium">
                        <span>Total</span>
                        <span>{formatPrice(grandTotal)}</span>
                    </div>

                    {totalPrice < 500000 && (
                        <p className="text-[11px] text-[#a0a0a0] mt-4 leading-relaxed">
                            Tambah {formatPrice(500000 - totalPrice)} lagi untuk gratis ongkos kirim
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage;
