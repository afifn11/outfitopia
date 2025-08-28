/* eslint-disable no-unused-vars */
import React from 'react';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, ShoppingBag } from 'lucide-react';

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
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFFFF]">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex items-center mb-8">
            <Link to="/" className="flex items-center text-[#666666] hover:text-[#C0A080] transition-colors mr-4">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Kembali Belanja</span>
            </Link>
          </div>

          {/* Empty Cart */}
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center max-w-md mx-auto border border-[#F0F0F0]">
            <div className="w-24 h-24 bg-[#FAFAFA] rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="w-12 h-12 text-[#C0A080]" />
            </div>
            <h1 className="text-2xl font-bold text-[#333333] mb-4">Keranjang Kosong</h1>
            <p className="text-[#666666] mb-8 leading-relaxed">
              Keranjang belanja Anda masih kosong. Ayo mulai berbelanja dan temukan produk-produk menarik!
            </p>
            <Link 
              to="/" 
              className="inline-flex items-center bg-[#C0A080] text-white px-8 py-4 rounded-xl font-semibold hover:bg-[#B09070] transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Mulai Belanja
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFFFF]">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Link to="/" className="flex items-center text-[#666666] hover:text-[#C0A080] transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Lanjut Belanja</span>
            </Link>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#333333]">Keranjang Belanja</h1>
            <p className="text-[#666666] mt-1">{totalItems} item dalam keranjang</p>
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#F0F0F0]">
              <div className="p-6 border-b border-[#F0F0F0]">
                <h2 className="text-lg font-semibold text-[#333333] flex items-center">
                  <ShoppingCart className="w-5 h-5 mr-2 text-[#C0A080]" />
                  Item Belanja
                </h2>
              </div>
              
              <div className="divide-y divide-[#F0F0F0]">
                {cartItems.map((item, index) => (
                  <div key={item.cartId} className="p-6 hover:bg-[#FAFAFA] transition-colors">
                    <div className="flex flex-col sm:flex-row gap-4">
                      {/* Product Image & Info */}
                      <div className="flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-xl shadow-sm"
                        />
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between h-full">
                          {/* Product Details */}
                          <div className="mb-4 sm:mb-0">
                            <h3 className="text-lg font-semibold text-[#333333] mb-2 line-clamp-2">
                              {item.name}
                            </h3>
                            <div className="space-y-1 mb-3">
                              <div className="inline-flex items-center bg-[#FAFAFA] px-3 py-1 rounded-full text-sm text-[#666666] border border-[#F0F0F0]">
                                Ukuran: <span className="font-medium ml-1">{item.selectedSize}</span>
                              </div>
                            </div>
                            <div className="text-xl font-bold text-[#C0A080]">
                              {formatPrice(item.price)}
                            </div>
                          </div>
                          
                          {/* Quantity & Actions */}
                          <div className="flex flex-col sm:items-end gap-3">
                            {/* Quantity Control */}
                            <div className="flex items-center bg-[#FAFAFA] rounded-xl border border-[#F0F0F0]">
                              <button 
                                onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                                className="p-2 hover:bg-[#F5F5F5] rounded-l-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="w-4 h-4 text-[#666666]" />
                              </button>
                              <span className="px-4 py-2 text-center min-w-[3rem] font-semibold text-[#333333]">
                                {item.quantity}
                              </span>
                              <button 
                                onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                                className="p-2 hover:bg-[#F5F5F5] rounded-r-xl transition-colors"
                              >
                                <Plus className="w-4 h-4 text-[#666666]" />
                              </button>
                            </div>
                            
                            {/* Subtotal */}
                            <div className="text-right">
                              <div className="text-sm text-[#666666]">Subtotal</div>
                              <div className="text-lg font-bold text-[#333333]">
                                {formatPrice(item.price * item.quantity)}
                              </div>
                            </div>
                            
                            {/* Remove Button */}
                            <button 
                              onClick={() => removeFromCart(item.cartId)} 
                              className="inline-flex items-center text-[#A05050] hover:text-[#B06060] hover:bg-[#FDF5F5] px-3 py-2 rounded-lg transition-all duration-200 text-sm font-medium"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Hapus
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="mt-8 lg:mt-0">
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-4 border border-[#F0F0F0]">
              <div className="p-6 bg-[#C0A080] text-white">
                <h2 className="text-xl font-bold">Ringkasan Pesanan</h2>
              </div>
              
              <div className="p-6 space-y-4">
                {/* Items Summary */}
                <div className="flex justify-between text-[#666666]">
                  <span>Subtotal ({totalItems} item)</span>
                  <span className="font-medium">{formatPrice(totalPrice)}</span>
                </div>
                
                <div className="flex justify-between text-[#666666]">
                  <span>Biaya Admin</span>
                  <span className="font-medium">Gratis</span>
                </div>
                
                <div className="border-t border-[#F0F0F0] pt-4">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-[#333333]">Total</span>
                    <span className="text-2xl font-bold text-[#C0A080]">
                      {formatPrice(totalPrice)}
                    </span>
                  </div>
                  <p className="text-sm text-[#666666] mt-2">
                    Pajak dan ongkos kirim dihitung saat checkout
                  </p>
                </div>
                
                {/* Checkout Button */}
                <Link 
                  to="/checkout" 
                  className="block w-full bg-[#C0A080] text-white py-4 rounded-xl font-bold text-center hover:bg-[#B09070] transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md mt-6"
                >
                  Lanjut ke Checkout
                </Link>
                
                {/* Security Badge */}
                <div className="text-center pt-4 border-t border-[#F0F0F0]">
                  <div className="flex items-center justify-center text-sm text-[#666666]">
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    Pembayaran 100% Aman
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;