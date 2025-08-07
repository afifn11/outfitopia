// /client/src/components/OrderHistoryItem.jsx
import React, { useState, useEffect } from 'react';
import api from '../services/api';
import ReviewModal from './ReviewModal';

const OrderHistoryItem = ({ order, onRefresh }) => {
    const [details, setDetails] = useState(null);
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [loadingDetails, setLoadingDetails] = useState(false);

    const fetchOrderDetails = async () => {
        if (isOpen && !details) { // Hanya fetch jika dibuka dan belum ada data
            setLoadingDetails(true);
            try {
                const response = await api.get(`/orders/${order.id}`);
                setDetails(response.data);
            } catch (error) {
                console.error('Failed to fetch order details', error);
            } finally {
                setLoadingDetails(false);
            }
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, [isOpen]);

    const handleOpenReviewModal = (product) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    return (
        <div className="border p-4 rounded-md bg-white shadow-sm">
            <div className="flex justify-between items-center cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
                <div>
                    <p className="font-semibold">Order ID: <span className="font-mono">#{order.id}</span></p>
                    <p className="text-sm text-gray-600">Tanggal: {new Date(order.order_date).toLocaleDateString('id-ID')}</p>
                    <p className="text-sm text-gray-600">Total: Rp {order.total_amount.toLocaleString('id-ID')}</p>
                </div>
                <div className="flex items-center gap-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : (order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800')}`}>
                        {order.status}
                    </span>
                    <span className="text-xl">{isOpen ? '−' : '+'}</span>
                </div>
            </div>

            {isOpen && (
                <div className="mt-4 pt-4 border-t">
                    {loadingDetails ? <p>Loading detail...</p> : details ? (
                        <div className="space-y-4">
                            {details.items.map(item => (
                                <div key={item.id} className="flex justify-between items-center">
                                    <div className="flex items-center gap-4">
                                        <img src={item.productImage} alt={item.productName} className="w-16 h-16 object-cover rounded"/>
                                        <div>
                                            <p className="font-semibold">{item.productName}</p>
                                            <p className="text-sm text-gray-500">Jumlah: {item.quantity}</p>
                                        </div>
                                    </div>
                                    {(order.status === 'Shipped' || order.status === 'Completed') && (
                                        <button onClick={() => handleOpenReviewModal(item)} className="text-sm font-medium text-blue-600 hover:underline px-3 py-1 bg-blue-50 rounded-md">
                                            Beri Ulasan
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : null}
                </div>
            )}

            {isModalOpen && (
                <ReviewModal 
                    product={selectedProduct} 
                    orderId={order.id}
                    onClose={() => setIsModalOpen(false)}
                    onReviewSubmitted={onRefresh}
                />
            )}
        </div>
    );
};

export default OrderHistoryItem;