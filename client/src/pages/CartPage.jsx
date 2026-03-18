import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';
import { X } from 'lucide-react';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity } = useCart();

  const totalPrice = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = totalPrice >= 500000 ? 0 : 30000;

  if (cartItems.length === 0) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-5 page-enter">
      <p className="label-sm text-[#a0a0a0]">Your bag is empty</p>
      <Link to="/" className="btn-black">Continue shopping →</Link>
    </div>
  );

  return (
    <div className="page-enter max-w-5xl mx-auto px-6 py-10">
      <h1 className="label-sm text-[#0a0a0a] mb-8">Shopping bag ({cartItems.length})</h1>

      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-12">
        {/* Items */}
        <div>
          {cartItems.map((item, idx) => (
            <div key={item.cartId}>
              <div className="flex gap-5 py-6">
                <Link to={`/product/${item.id}`} className="flex-shrink-0">
                  <div className="w-24 aspect-[3/4] bg-[#f4f4f4] overflow-hidden">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                  </div>
                </Link>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-[13px] text-[#0a0a0a] mb-1">{item.name}</p>
                      <p className="text-[11px] text-[#a0a0a0]">Size: {item.selectedSize}</p>
                    </div>
                    <button onClick={() => removeFromCart(item.cartId)} className="text-[#a0a0a0] hover:text-[#0a0a0a] transition-colors p-1">
                      <X size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3 border border-[#e8e8e8]">
                      <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-[#6b6b6b] hover:text-[#0a0a0a] hover:bg-[#fafafa] transition-colors text-sm">−</button>
                      <span className="text-[12px] w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-[#6b6b6b] hover:text-[#0a0a0a] hover:bg-[#fafafa] transition-colors text-sm">+</button>
                    </div>
                    <p className="text-[13px] text-[#0a0a0a]">{formatPrice(item.price * item.quantity)}</p>
                  </div>
                </div>
              </div>
              {idx < cartItems.length - 1 && <div className="h-px bg-[#e8e8e8]" />}
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="md:border-l md:border-[#e8e8e8] md:pl-10">
          <h2 className="label-sm text-[#0a0a0a] mb-6">Order summary</h2>
          <div className="space-y-3 mb-5">
            <div className="flex justify-between text-[13px]">
              <span className="text-[#6b6b6b]">Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex justify-between text-[13px]">
              <span className="text-[#6b6b6b]">Shipping</span>
              <span>{shipping === 0 ? 'Free' : formatPrice(shipping)}</span>
            </div>
          </div>
          <div className="h-px bg-[#e8e8e8] mb-4" />
          <div className="flex justify-between text-[13px] font-medium mb-8">
            <span>Total</span>
            <span>{formatPrice(totalPrice + shipping)}</span>
          </div>
          <Link to="/checkout" className="btn-black w-full justify-center block text-center">Proceed to checkout →</Link>
          <Link to="/" className="btn-ghost-dark mt-4 mx-auto flex justify-center">← Continue shopping</Link>
          {totalPrice < 500000 && (
            <p className="text-[11px] text-[#a0a0a0] text-center mt-5 leading-relaxed">
              Add {formatPrice(500000 - totalPrice)} more for free shipping
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartPage;
