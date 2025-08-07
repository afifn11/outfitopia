// /client/src/pages/ProfilePage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const ProfilePage = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await api.get('/orders/myorders');
                setOrders(response.data);
            } catch (error) {
                console.error('Failed to fetch orders', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Profil Saya</h1>
            <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                <p><strong>Nama:</strong> {user?.name}</p>
                <p><strong>Email:</strong> {user?.email}</p>
            </div>

            <h2 className="text-2xl font-bold mb-4">Riwayat Pesanan</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
                {loading ? <p>Loading riwayat pesanan...</p> :
                 orders.length > 0 ? (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div key={order.id} className="border p-4 rounded-md">
                                <p><strong>Order ID:</strong> #{order.id}</p>
                                <p><strong>Tanggal:</strong> {new Date(order.order_date).toLocaleDateString('id-ID')}</p>
                                <p><strong>Total:</strong> Rp {order.total_amount.toLocaleString('id-ID')}</p>
                                <p><strong>Status:</strong> {order.status}</p>
                            </div>
                        ))}
                    </div>
                 ) : <p>Anda belum memiliki riwayat pesanan.</p>
                }
            </div>
        </div>
    );
};

export default ProfilePage;