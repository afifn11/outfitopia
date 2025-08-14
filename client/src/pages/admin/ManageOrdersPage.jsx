import React, { useState, useEffect } from 'react';
import { Calendar, User, DollarSign, Package, Clock, Truck, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// Status badge component
const StatusBadge = ({ status }) => {
    const statusConfig = {
        'Pending': {
            icon: Clock,
            className: 'bg-amber-50 text-amber-700 border-amber-200',
            iconClassName: 'text-amber-500'
        },
        'Shipped': {
            icon: Truck,
            className: 'bg-blue-50 text-blue-700 border-blue-200',
            iconClassName: 'text-blue-500'
        },
        'Completed': {
            icon: CheckCircle,
            className: 'bg-green-50 text-green-700 border-green-200',
            iconClassName: 'text-green-500'
        },
        'Cancelled': {
            icon: XCircle,
            className: 'bg-red-50 text-red-700 border-red-200',
            iconClassName: 'text-red-500'
        }
    };

    const config = statusConfig[status] || statusConfig['Pending'];
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}>
            <Icon className={`w-3 h-3 mr-1 ${config.iconClassName}`} />
            {status}
        </span>
    );
};

// Order skeleton loader
const OrderSkeleton = () => (
    <tr className="border-b border-slate-100 animate-pulse">
        <td className="px-6 py-4">
            <div className="h-4 bg-slate-200 rounded w-20"></div>
        </td>
        <td className="px-6 py-4">
            <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-32"></div>
                <div className="h-3 bg-slate-200 rounded w-48"></div>
            </div>
        </td>
        <td className="px-6 py-4">
            <div className="h-4 bg-slate-200 rounded w-24"></div>
        </td>
        <td className="px-6 py-4">
            <div className="h-4 bg-slate-200 rounded w-28"></div>
        </td>
        <td className="px-6 py-4">
            <div className="h-6 bg-slate-200 rounded-full w-20"></div>
        </td>
    </tr>
);

const ManageOrdersPage = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    const fetchOrders = async () => {
        try {
            const response = await api.get('/admin/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Failed to fetch orders', error);
            MySwal.fire({
                title: 'Gagal!',
                text: 'Gagal memuat data pesanan.',
                icon: 'error',
                confirmButtonColor: '#6366f1'
            });
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
            setOrders(prevOrders => 
                prevOrders.map(order => 
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
            MySwal.fire({
                title: 'Berhasil',
                text: 'Status pesanan telah diperbarui.',
                icon: 'success',
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 2000,
                background: '#ffffff',
                color: '#1f2937'
            });
        } catch (error) {
            console.error('Failed to update order status', error);
            MySwal.fire({
                title: 'Gagal!',
                text: 'Gagal memperbarui status pesanan.',
                icon: 'error',
                confirmButtonColor: '#6366f1'
            });
        }
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        return order.status.toLowerCase() === filter.toLowerCase();
    });

    const orderStats = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'Pending').length,
        shipped: orders.filter(o => o.status === 'Shipped').length,
        completed: orders.filter(o => o.status === 'Completed').length,
        cancelled: orders.filter(o => o.status === 'Cancelled').length
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Kelola Pesanan</h1>
                    <p className="text-slate-600 mt-1">Pantau dan kelola semua pesanan pelanggan</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-slate-100 rounded-lg">
                            <Package className="w-5 h-5 text-slate-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-slate-600">Total</p>
                            <p className="text-2xl font-bold text-slate-900">{orderStats.total}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-amber-100 rounded-lg">
                            <Clock className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-slate-600">Pending</p>
                            <p className="text-2xl font-bold text-amber-600">{orderStats.pending}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <Truck className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-slate-600">Shipped</p>
                            <p className="text-2xl font-bold text-blue-600">{orderStats.shipped}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-slate-600">Completed</p>
                            <p className="text-2xl font-bold text-green-600">{orderStats.completed}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <XCircle className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-slate-600">Cancelled</p>
                            <p className="text-2xl font-bold text-red-600">{orderStats.cancelled}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex flex-wrap gap-2">
                    {[
                        { key: 'all', label: 'Semua' },
                        { key: 'pending', label: 'Pending' },
                        { key: 'shipped', label: 'Shipped' },
                        { key: 'completed', label: 'Completed' },
                        { key: 'cancelled', label: 'Cancelled' }
                    ].map(filterOption => (
                        <button
                            key={filterOption.key}
                            onClick={() => setFilter(filterOption.key)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                filter === filterOption.key
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}
                        >
                            {filterOption.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                                    Order ID
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                                    <div className="flex items-center">
                                        <User className="w-4 h-4 mr-2" />
                                        Pelanggan
                                    </div>
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 mr-2" />
                                        Tanggal
                                    </div>
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                                    <div className="flex items-center">
                                        <DollarSign className="w-4 h-4 mr-2" />
                                        Total
                                    </div>
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <OrderSkeleton key={index} />
                                ))
                            ) : filteredOrders.length > 0 ? (
                                filteredOrders.map(order => (
                                    <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <span className="font-mono text-sm font-medium text-slate-900">
                                                #{order.id}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div>
                                                <div className="font-medium text-slate-900">
                                                    {order.userName}
                                                </div>
                                                <div className="text-sm text-slate-500">
                                                    {order.userEmail}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-sm text-slate-900">
                                                {new Date(order.order_date).toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-slate-900">
                                                Rp {order.total_amount.toLocaleString('id-ID')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <StatusBadge status={order.status} />
                                                <select 
                                                    value={order.status} 
                                                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                    className="text-sm border border-slate-300 rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                                >
                                                    <option value="Pending">Pending</option>
                                                    <option value="Shipped">Shipped</option>
                                                    <option value="Completed">Completed</option>
                                                    <option value="Cancelled">Cancelled</option>
                                                </select>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="text-slate-400">
                                            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p className="text-lg font-medium">
                                                {filter === 'all' ? 'Belum ada pesanan' : `Tidak ada pesanan ${filter}`}
                                            </p>
                                            <p className="text-sm mt-1">
                                                {filter === 'all' 
                                                    ? 'Pesanan akan muncul di sini ketika pelanggan melakukan pembelian.'
                                                    : `Tidak ditemukan pesanan dengan status ${filter}.`
                                                }
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageOrdersPage;