import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

// Fungsi helper untuk memformat harga agar konsisten
const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
};

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();
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
          <div key={item.cartId} className="flex flex-col sm:flex-row items-center justify-between border-b py-4 last:border-b-0">
            <div className="flex items-center mb-4 sm:mb-0 w-full sm:w-1/2">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded mr-4" />
              <div>
                <h2 className="font-semibold text-gray-800">{item.name}</h2>
                <p className="text-sm text-gray-500">Ukuran: {item.selectedSize}</p>
                {/* --- PERBAIKAN FORMAT HARGA PER ITEM --- */}
                <p className="text-sm text-gray-600">{formatPrice(item.price)}</p>
              </div>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-1/2">
              <div className="flex items-center border rounded-md">
                <button 
                  onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-l-md transition-colors"
                  disabled={item.quantity <= 1}
                >
                    -
                </button>
                <span className="px-4 py-1 text-center w-12">{item.quantity}</span>
                <button 
                  onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                  className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-r-md transition-colors"
                >
                    +
                </button>
              </div>
              
              <button onClick={() => removeFromCart(item.cartId)} className="bg-red-100 text-red-600 px-3 py-1 text-sm rounded-md hover:bg-red-200 transition-colors">
                Hapus
              </button>
            </div>
          </div>
        ))}
        <div className="mt-6 pt-4 border-t flex flex-col items-end">
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-800">
                Total:
                {/* --- PERBAIKAN FORMAT TOTAL HARGA --- */}
                <span className="ml-2 text-2xl">{formatPrice(totalPrice)}</span>
            </h2>
            <p className="text-sm text-gray-500">Pajak dan ongkos kirim dihitung saat checkout.</p>
          </div>
          <Link to="/checkout" className="mt-4 inline-block w-full sm:w-auto text-center bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition-colors">
            Lanjut ke Checkout
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;