// client/src/pages/CartPage.jsx
import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

const CartPage = () => {
  const { cartItems, removeFromCart } = useCart();
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Keranjang Belanja</h1>
        <p>Keranjang Anda masih kosong.</p>
        <Link to="/" className="mt-4 inline-block bg-gray-800 text-white px-6 py-2 rounded">
          Mulai Belanja
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Keranjang Belanja</h1>
      <div className="bg-white shadow-md rounded-lg p-6">
        {cartItems.map(item => (
          <div key={item.id} className="flex items-center justify-between border-b py-4">
            <div className="flex items-center">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded mr-4" />
              <div>
                <h2 className="font-semibold">{item.name}</h2>
                <p className="text-sm text-gray-500">Ukuran: {item.selectedSize}</p>
                <p className="text-sm text-gray-600">Rp {item.price.toLocaleString('id-ID')}</p>
              </div>
            </div>
            <div className="flex items-center">
              <p className="mx-4">Qty: {item.quantity}</p>
              <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700">
                Hapus
              </button>
            </div>
          </div>
        ))}
        <div className="mt-6 text-right">
          <h2 className="text-2xl font-bold">Total: Rp {totalPrice.toLocaleString('id-ID')}</h2>
          <Link to="/checkout" className="mt-4 inline-block bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700">
            Lanjut ke Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;