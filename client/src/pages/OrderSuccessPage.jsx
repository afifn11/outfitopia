// client/src/pages/OrderSuccessPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const OrderSuccessPage = () => {
  return (
    <div className="container mx-auto p-6 text-center">
      <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 rounded-md inline-block">
        <h1 className="text-3xl font-bold">Pesanan Berhasil!</h1>
        <p className="mt-2">Terima kasih telah berbelanja. Kami akan segera memproses pesanan Anda.</p>
      </div>
      <Link to="/" className="mt-6 inline-block bg-gray-800 text-white px-8 py-3 rounded-lg font-bold">
        Kembali ke Beranda
      </Link>
    </div>
  );
};

export default OrderSuccessPage;