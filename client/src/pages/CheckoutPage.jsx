import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ name: '', address: '', phone: '' });
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleInputChange = (e) => {
    setUserDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    try {
        await api.post('/orders', {
            userDetails,
            cartItems,
            totalPrice,
        });
        clearCart();
        MySwal.fire({
            title: 'Pesanan Diterima!',
            text: 'Terima kasih, pesanan Anda akan segera kami proses.',
            icon: 'success'
        }).then(() => {
            navigate('/order-success');
        });
    } catch (error) {
        console.error('Error placing order:', error);
        MySwal.fire({
            title: 'Gagal Membuat Pesanan',
            text: error.response?.data?.message || 'Terjadi kesalahan pada server.',
            icon: 'error'
        });
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>
      <form onSubmit={handlePlaceOrder}>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-2/3">
            <h2 className="text-2xl font-semibold mb-4">Detail Pengiriman</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nama Lengkap</label>
                <input type="text" id="name" name="name" onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
              </div>
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700">Alamat Lengkap</label>
                <textarea id="address" name="address" rows="3" onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Nomor Telepon</label>
                <input type="tel" id="phone" name="phone" onChange={handleInputChange} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" required />
              </div>
            </div>
          </div>
          <div className="md:w-1/3">
            <h2 className="text-2xl font-semibold mb-4">Ringkasan Pesanan</h2>
            <div className="bg-white p-6 rounded-lg shadow-md">
              {cartItems.map(item => (
                <div key={item.id} className="flex justify-between mb-2">
                  <span>{item.name} x {item.quantity}</span>
                  <span>Rp {(item.price * item.quantity).toLocaleString('id-ID')}</span>
                </div>
              ))}
              <hr className="my-4" />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
              </div>
              <button type="submit" className="w-full mt-6 bg-gray-800 text-white py-3 rounded-lg font-bold hover:bg-gray-900">
                Buat Pesanan (Pembayaran Manual)
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;