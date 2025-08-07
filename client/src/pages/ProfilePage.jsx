// /client/src/pages/ProfilePage.jsx (Versi Final)
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import OrderHistoryItem from '../components/OrderHistoryItem'; // Import komponen baru

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
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Profil Saya</h1>
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <p><strong>Nama:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
            </div>

            <h2 className="text-2xl font-bold mb-4">Riwayat Pesanan</h2>
            <div className="space-y-4">
                {loading ? <p>Loading riwayat pesanan...</p> :
                 orders.length > 0 ? (
                    orders.map(order => (
                        <OrderHistoryItem key={order.id} order={order} onRefresh={fetchOrders} />
                    ))
                 ) : <p>Anda belum memiliki riwayat pesanan.</p>
                }
            </div>
        </div>
    );
};

export default ProfilePage;