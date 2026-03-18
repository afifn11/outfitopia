import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatPrice } from '../utils/format';
import Swal from 'sweetalert2';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', phone: '', address: '' });

  const totalPrice = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = totalPrice >= 500000 ? 0 : 30000;

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone || !form.address) {
      Swal.fire({ title: 'Incomplete', text: 'Please fill all fields.', icon: 'warning', confirmButtonColor: '#0a0a0a' });
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/orders', {
        userDetails: form,
        cartItems: cartItems.map(i => ({ id: i.id, quantity: i.quantity, price: i.price, selectedSize: i.selectedSize })),
        totalPrice: totalPrice + shipping,
      });
      clearCart();
      navigate('/order-success', { state: { orderId: res.data.orderId } });
    } catch (err) {
      Swal.fire({ title: 'Error', text: err.response?.data?.message || 'Failed to place order.', icon: 'error', confirmButtonColor: '#0a0a0a' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
      if (cartItems.length === 0) {
          navigate('/cart');
      }
  }, [cartItems, navigate]);

  if (cartItems.length === 0) return null;

  return (
    <div className="page-enter max-w-4xl mx-auto px-6 py-10">
      <h1 className="label-sm text-[#0a0a0a] mb-8">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_320px] gap-12">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-7">
          <div>
            <h2 className="label-sm text-[#0a0a0a] mb-6">Shipping information</h2>
            <div className="space-y-6">
              <div>
                <label className="block label-sm text-[#6b6b6b] mb-2">Full name</label>
                <input name="name" value={form.name} onChange={handleChange} required className="input-minimal" placeholder="Your full name" />
              </div>
              <div>
                <label className="block label-sm text-[#6b6b6b] mb-2">Phone number</label>
                <input name="phone" value={form.phone} onChange={handleChange} required className="input-minimal" placeholder="08xxxxxxxxxx" />
              </div>
              <div>
                <label className="block label-sm text-[#6b6b6b] mb-2">Shipping address</label>
                <textarea name="address" value={form.address} onChange={handleChange} required rows={3} className="input-minimal resize-none" placeholder="Full address including city and postal code" />
              </div>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn-black w-full justify-center">
            {loading
              ? <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : `Place order — ${formatPrice(totalPrice + shipping)}`}
          </button>
        </form>

        {/* Order summary */}
        <div className="md:border-l md:border-[#e8e8e8] md:pl-10">
          <h2 className="label-sm text-[#0a0a0a] mb-5">Order summary</h2>
          <div className="space-y-4 mb-5">
            {cartItems.map(item => (
              <div key={item.cartId} className="flex items-center gap-3">
                <div className="w-14 aspect-[3/4] bg-[#f4f4f4] flex-shrink-0 overflow-hidden">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] text-[#0a0a0a] truncate">{item.name}</p>
                  <p className="text-[11px] text-[#a0a0a0]">Size: {item.selectedSize} · Qty: {item.quantity}</p>
                </div>
                <p className="text-[12px] text-[#0a0a0a] flex-shrink-0">{formatPrice(item.price * item.quantity)}</p>
              </div>
            ))}
          </div>
          <div className="h-px bg-[#e8e8e8] mb-4" />
          <div className="space-y-2.5 mb-4">
            <div className="flex justify-between text-[12px]">
              <span className="text-[#6b6b6b]">Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-[12px]">
              <span className="text-[#6b6b6b]">Shipping</span>
              <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
            </div>
          </div>
          <div className="h-px bg-[#e8e8e8] mb-4" />
          <div className="flex justify-between text-[13px] font-medium">
            <span>Total</span>
            <span>{formatPrice(totalPrice + shipping)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
