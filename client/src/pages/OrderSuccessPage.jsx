// client/src/pages/OrderSuccessPage.jsx
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';

const OrderSuccessPage = () => {
    const location  = useLocation();
    const [searchParams] = useSearchParams();
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        // Dari state (onSuccess callback Snap)
        if (location.state?.orderId) {
            setOrderId(location.state.orderId);
            return;
        }
        // Dari URL param (redirect Midtrans)
        const urlOrderId = searchParams.get('order_id');
        if (urlOrderId) setOrderId(urlOrderId);
    }, [location, searchParams]);

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-6 py-16 page-enter">
            <div className="text-center max-w-sm">
                <div className="w-12 h-12 border border-[#0a0a0a] rounded-full flex items-center justify-center mx-auto mb-8">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
                <h1 className="text-[20px] font-normal tracking-tight text-[#0a0a0a] mb-3">
                    Pesanan dikonfirmasi
                </h1>
                {orderId && (
                    <p className="text-[13px] text-[#6b6b6b] mb-2">Order #{orderId}</p>
                )}
                <p className="text-[13px] text-[#6b6b6b] mb-10 leading-relaxed">
                    Terima kasih atas pembelianmu. Kami akan segera memproses pesananmu.
                </p>
                <div className="flex flex-col gap-3">
                    <Link to="/profile" className="btn-black w-full justify-center">
                        Lihat pesanan saya →
                    </Link>
                    <Link to="/" className="btn-ghost-dark justify-center">
                        Lanjut belanja
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessPage;
