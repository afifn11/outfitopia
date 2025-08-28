/* eslint-disable no-unused-vars */
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Home } from 'lucide-react';

const OrderSuccessPage = () => {
    const location = useLocation();
    // Ambil orderId dari state yang dikirim oleh halaman Checkout
    const orderId = location.state?.orderId;

    return (
        <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-4">
            <motion.div
                className="max-w-lg w-full bg-white rounded-xl shadow-sm border border-[#F0F0F0]"
                initial={{ opacity: 0, y: 50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
                {/* Header Card */}
                <div className="p-6 sm:p-8 text-center border-b border-[#F0F0F0]">
                    <motion.div
                        className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-[#C0A080] rounded-full mb-4 sm:mb-5"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20, delay: 0.5 }}
                    >
                        <Check className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                    </motion.div>
                    
                    <h1 className="text-2xl sm:text-3xl font-bold text-[#333333] mb-2">
                        Pesanan Berhasil Dibuat!
                    </h1>
                    
                    <p className="text-[#666666] leading-relaxed text-sm sm:text-base">
                        Terima kasih telah berbelanja di Outfitopia. Kami telah menerima pesanan Anda dan akan segera memprosesnya.
                    </p>
                </div>

                {/* Detail Pesanan */}
                <div className="p-6 sm:p-8 space-y-6">
                    {orderId && (
                        <div className="bg-[#FAFAFA] rounded-lg p-4 text-center border border-[#F0F0F0]">
                            <p className="text-sm text-[#666666] mb-1">Nomor Pesanan Anda:</p>
                            <p className="text-lg font-bold font-mono text-[#C0A080] tracking-wider">#{orderId}</p>
                        </div>
                    )}
                    
                    <p className="text-sm text-center text-[#666666]">
                        Anda akan menerima email konfirmasi beserta detail pesanan dalam beberapa menit.
                    </p>

                    {/* Tombol Aksi */}
                    <div className="flex justify-center mt-6">
                        <Link 
                            to="/" 
                            className="flex items-center justify-center gap-2 bg-[#C0A080] hover:bg-[#B09070] text-white font-medium py-3 px-6 rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
                        >
                            <Home size={18} />
                            Kembali ke Beranda
                        </Link>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default OrderSuccessPage;