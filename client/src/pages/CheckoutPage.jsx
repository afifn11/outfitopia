import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { ArrowLeft, User, MapPin, Phone, CreditCard, ShoppingBag, Check, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';

const MySwal = withReactContent(Swal);

// Fungsi helper untuk memformat harga agar konsisten
const formatPrice = (price) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price);
};

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({ name: '', address: '', phone: '' });
  const [isLoading, setIsLoading] = useState(false);
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleInputChange = (e) => {
    setUserDetails(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
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
        icon: 'success',
        confirmButtonColor: '#C0A080',
        confirmButtonText: 'OK'
      }).then(() => {
        navigate('/order-success');
      });
    } catch (error) {
      console.error('Error placing order:', error);
      MySwal.fire({
        title: 'Gagal Membuat Pesanan',
        text: error.response?.data?.message || 'Terjadi kesalahan pada server.',
        icon: 'error',
        confirmButtonColor: '#A05050',
        confirmButtonText: 'Coba Lagi'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FFFFFF]">
        <div className="container mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center max-w-md mx-auto border border-[#F0F0F0]">
            <div className="w-24 h-24 bg-[#FAFAFA] rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-12 h-12 text-[#C0A080]" />
            </div>
            <h1 className="text-2xl font-bold text-[#333333] mb-4">Keranjang Kosong</h1>
            <p className="text-[#666666] mb-8">
              Tidak ada item untuk checkout. Silakan tambahkan produk ke keranjang terlebih dahulu.
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
            <Link to="/cart" className="flex items-center text-[#666666] hover:text-[#C0A080] transition-colors">
              <ArrowLeft className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Kembali ke Keranjang</span>
            </Link>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#333333]">Checkout</h1>
            <p className="text-[#666666] mt-1">Lengkapi data pengiriman untuk menyelesaikan pesanan</p>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder}>
          <div className="lg:grid lg:grid-cols-3 lg:gap-8">
            {/* Shipping Details */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-[#F0F0F0]">
                <div className="p-6 border-b border-[#F0F0F0] bg-[#C0A080] text-white">
                  <h2 className="text-xl font-bold flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Detail Pengiriman
                  </h2>
                </div>
                
                <div className="p-6 space-y-6">
                  {/* Name Field */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="flex items-center text-sm font-semibold text-[#333333]">
                      <User className="w-4 h-4 mr-2 text-[#C0A080]" />
                      Nama Lengkap
                    </label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={userDetails.name}
                      onChange={handleInputChange} 
                      className="w-full px-4 py-3 border border-[#F0F0F0] rounded-xl focus:ring-2 focus:ring-[#C0A080] focus:border-[#C0A080] transition-colors bg-[#FAFAFA] focus:bg-white"
                      placeholder="Masukkan nama lengkap Anda"
                      required 
                    />
                  </div>

                  {/* Address Field */}
                  <div className="space-y-2">
                    <label htmlFor="address" className="flex items-center text-sm font-semibold text-[#333333]">
                      <MapPin className="w-4 h-4 mr-2 text-[#C0A080]" />
                      Alamat Lengkap
                    </label>
                    <textarea 
                      id="address" 
                      name="address" 
                      rows="4" 
                      value={userDetails.address}
                      onChange={handleInputChange} 
                      className="w-full px-4 py-3 border border-[#F0F0F0] rounded-xl focus:ring-2 focus:ring-[#C0A080] focus:border-[#C0A080] transition-colors bg-[#FAFAFA] focus:bg-white resize-none"
                      placeholder="Masukkan alamat lengkap termasuk kode pos"
                      required
                    />
                  </div>

                  {/* Phone Field */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="flex items-center text-sm font-semibold text-[#333333]">
                      <Phone className="w-4 h-4 mr-2 text-[#C0A080]" />
                      Nomor Telepon
                    </label>
                    <input 
                      type="tel" 
                      id="phone" 
                      name="phone" 
                      value={userDetails.phone}
                      onChange={handleInputChange} 
                      className="w-full px-4 py-3 border border-[#F0F0F0] rounded-xl focus:ring-2 focus:ring-[#C0A080] focus:border-[#C0A080] transition-colors bg-[#FAFAFA] focus:bg-white"
                      placeholder="Contoh: 08123456789"
                      required 
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method Info */}
              <div className="mt-6 bg-[#FAFAFA] border border-[#F0F0F0] rounded-2xl p-6">
                <div className="flex items-start">
                  <CreditCard className="w-6 h-6 text-[#C0A080] mt-1 mr-3" />
                  <div>
                    <h3 className="font-semibold text-[#333333] mb-2">Metode Pembayaran</h3>
                    <p className="text-[#666666] text-sm leading-relaxed">
                      Pesanan ini menggunakan sistem pembayaran manual. Setelah pesanan dikonfirmasi, 
                      Anda akan dihubungi melalui WhatsApp untuk proses pembayaran dan pengiriman.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="mt-8 lg:mt-0">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-4 border border-[#F0F0F0]">
                <div className="p-6 bg-[#C0A080] text-white">
                  <h2 className="text-xl font-bold flex items-center">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Ringkasan Pesanan
                  </h2>
                </div>
                
                <div className="p-6">
                  {/* Items List */}
                  <div className="space-y-4 mb-6">
                    {cartItems.map(item => (
                      <div key={item.cartId} className="flex items-center justify-between p-3 bg-[#FAFAFA] rounded-xl">
                        <div className="flex items-center">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-12 h-12 object-cover rounded-lg mr-3"
                          />
                          <div>
                            <h4 className="font-medium text-[#333333] text-sm line-clamp-1">{item.name}</h4>
                            <div className="flex items-center text-xs text-[#666666] mt-1">
                              <span>{item.selectedSize}</span>
                              <span className="mx-2">•</span>
                              <span>Qty: {item.quantity}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-[#333333]">
                            {formatPrice(item.price * item.quantity)}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="space-y-3 border-t border-[#F0F0F0] pt-4">
                    <div className="flex justify-between text-[#666666]">
                      <span>Subtotal ({totalItems} item)</span>
                      <span className="font-medium">{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-[#666666]">
                      <span>Ongkos Kirim</span>
                      <span className="font-medium text-[#C0A080]">Gratis</span>
                    </div>
                    <div className="flex justify-between text-[#666666]">
                      <span>Biaya Admin</span>
                      <span className="font-medium text-[#C0A080]">Gratis</span>
                    </div>
                    <div className="border-t border-[#F0F0F0] pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-[#333333]">Total Pembayaran</span>
                        <span className="text-2xl font-bold text-[#C0A080]">
                          {formatPrice(totalPrice)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full mt-6 bg-[#C0A080] text-white py-4 rounded-xl font-bold hover:bg-[#B09070] transform hover:scale-105 transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Memproses...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Check className="w-5 h-5 mr-2" />
                        Buat Pesanan
                      </div>
                    )}
                  </button>

                  {/* Security Badge */}
                  <div className="text-center pt-4 border-t border-[#F0F0F0] mt-6">
                    <div className="flex items-center justify-center text-sm text-[#666666]">
                      <Lock className="w-4 h-4 mr-1" />
                      Data Anda Aman & Terlindungi
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;