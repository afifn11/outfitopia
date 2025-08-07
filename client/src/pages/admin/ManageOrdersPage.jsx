// /client/src/pages/admin/ManageOrdersPage.jsx

import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ManageOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const response = await api.get('/admin/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch orders', error);
            alert('Gagal memuat data pesanan.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await api.put(`/admin/orders/${orderId}/status`, { status: newStatus });
            
            // Update status di state secara lokal untuk responsivitas UI
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
            alert('Status pesanan berhasil diperbarui.');
        } catch (error) {
            console.error('Failed to update order status', error);
            alert('Gagal memperbarui status pesanan.');
        }
    };

    if (loading) {
        return <p>Loading data pesanan...</p>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Kelola Pesanan</h1>
            <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full min-w-[600px]">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left p-3">Order ID</th>
                            <th className="text-left p-3">Pelanggan</th>
                            <th className="text-left p-3">Tanggal</th>
                            <th className="text-left p-3">Total</th>
                            <th className="text-left p-3">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-mono">#{order.id}</td>
                                <td className="p-3">
                                    <div>{order.userName}</div>
                                    <div className="text-sm text-gray-500">{order.userEmail}</div>
                                </td>
                                <td className="p-3">{new Date(order.order_date).toLocaleDateString('id-ID')}</td>
                                <td className="p-3">Rp {order.total_amount.toLocaleString('id-ID')}</td>
                                <td className="p-3">
                                    <select 
                                        value={order.status} 
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className="border rounded p-1"
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Shipped">Shipped</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                 {orders.length === 0 && <p className="text-center p-4">Belum ada pesanan.</p>}
            </div>
        </div>
    );
};

export default ManageOrdersPage;