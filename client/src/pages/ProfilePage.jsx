// /client/src/pages/ProfilePage.jsx (Semantic & Elegant Version)
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import api from '../services/api';
import OrderHistoryItem from '../components/OrderHistoryItem';
import { ArrowLeft, User, Mail, Package, ShoppingBag } from 'lucide-react';

const ProfilePage = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = useCallback(async () => {
        try {
            const response = await api.get('/orders/myorders');
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch orders', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        setLoading(true);
        fetchOrders();
    }, [fetchOrders]);

    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-4 py-8 max-w-4xl">
                {/* Navigation */}
                <nav className="mb-8">
                    <Link 
                        to="/" 
                        className="inline-flex items-center text-gray-600 hover:text-[#C0A080] transition-colors duration-200 text-sm"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Kembali ke Beranda
                    </Link>
                </nav>

                {/* Header Section */}
                <header className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-[#FAFAFA] rounded-full mb-4 border">
                        <User className="w-8 h-8 text-[#C0A080]" />
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                        Profil Saya
                    </h1>
                    <p className="text-gray-600">Kelola informasi akun dan riwayat belanja</p>
                </header>

                <main className="space-y-8">
                    {/* Profile Information Section */}
                    <section className="bg-white rounded-lg border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <User className="w-5 h-5 mr-2 text-[#C0A080]" />
                            Informasi Profil
                        </h2>
                        
                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <div className="flex items-center text-gray-700">
                                    <User className="w-4 h-4 mr-2 text-[#C0A080]" />
                                    <span className="text-sm font-medium">Nama Lengkap</span>
                                </div>
                                <p className="text-gray-900 font-medium pl-6">{user?.name}</p>
                            </div>
                            
                            <div className="space-y-2">
                                <div className="flex items-center text-gray-700">
                                    <Mail className="w-4 h-4 mr-2 text-[#C0A080]" />
                                    <span className="text-sm font-medium">Email</span>
                                </div>
                                <p className="text-gray-900 font-medium pl-6">{user?.email}</p>
                            </div>
                        </div>
                    </section>

                    {/* Order History Section */}
                    <section className="bg-white rounded-lg border p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
                            <Package className="w-5 h-5 mr-2 text-[#C0A080]" />
                            Riwayat Pesanan
                        </h2>
                        
                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-[#C0A080] mb-4"></div>
                                <p className="text-gray-600 text-sm">Memuat riwayat pesanan...</p>
                            </div>
                        ) : orders.length > 0 ? (
                            <div className="space-y-4">
                                {orders.map(order => (
                                    <OrderHistoryItem key={order.id} order={order} onRefresh={fetchOrders} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12">
                                <div className="w-16 h-16 bg-[#FAFAFA] rounded-full flex items-center justify-center mx-auto mb-4 border">
                                    <ShoppingBag className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-gray-900 font-medium mb-2">Belum Ada Pesanan</h3>
                                <p className="text-gray-600 text-sm mb-6">Mulai berbelanja untuk melihat riwayat pesanan Anda</p>
                                <Link
                                    to="/"
                                    className="inline-flex items-center bg-[#C0A080] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#B09070] transition-colors duration-200"
                                >
                                    <ShoppingBag className="w-4 h-4 mr-2" />
                                    Mulai Berbelanja
                                </Link>
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
};

export default ProfilePage;