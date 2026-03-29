import React, { useState, useEffect } from 'react';
import WishlistButton from '../components/WishlistButton';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';

const Star = ({ filled }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api.get(`/products/${id}`)
      .then(r => setProduct(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    const size = product.sizes?.length === 1 ? product.sizes[0] : selectedSize;
    if (!size) return;
    addToCart(product, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-[500px]">
      <div className="bg-[#f4f4f4] animate-pulse" />
      <div className="p-12 space-y-4">
        <div className="h-4 bg-[#f4f4f4] rounded animate-pulse w-1/2" />
        <div className="h-8 bg-[#f4f4f4] rounded animate-pulse w-3/4" />
      </div>
    </div>
  );

  if (!product) return (
    <div className="flex flex-col items-center justify-center py-32 gap-6">
      <p className="text-[12px] tracking-wide uppercase text-[#a0a0a0]">Product not found</p>
      <Link to="/" className="btn-outline-dark">Continue shopping</Link>
    </div>
  );

  const sizes = product.sizes || [];
  const isSingleSize = sizes.length === 1 && sizes[0] === 'ONE SIZE';
  const canAdd = isSingleSize || selectedSize !== null;
  const rating = parseFloat(product.average_rating) || 0;

  return (
    <div className="page-enter">
      {/* Breadcrumb */}
      <div className="px-6 py-3 border-b border-[#e8e8e8] flex items-center gap-2">
        <Link to="/" className="text-[11px] tracking-wide uppercase text-[#a0a0a0] hover:text-[#0a0a0a] transition-colors">Home</Link>
        <span className="text-[#d0d0d0] text-[11px]">—</span>
        <span className="text-[11px] tracking-wide uppercase text-[#0a0a0a]">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Image */}
        <div className="aspect-[3/4] md:aspect-auto md:min-h-[600px] bg-[#fafafa] overflow-hidden">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover block" />
        </div>

        {/* Info */}
        <div className="px-10 py-12 flex flex-col">
          <div className="flex-1">
            {product.categories?.[0] && (
              <p className="label-sm text-[#a0a0a0] mb-3">{product.categories[0].name}</p>
            )}
            <div className="flex items-start justify-between gap-4 mb-2">
            <h1 className="text-[24px] font-normal tracking-tight text-[#0a0a0a]">{product.name}</h1>
            <WishlistButton productId={product.id} size={18} className="flex-shrink-0 mt-1" />
          </div>
            <p className="text-[18px] text-[#6b6b6b] mb-6">{formatPrice(product.price)}</p>

            {product.num_reviews > 0 && (
              <div className="flex items-center gap-2 mb-8">
                <div className="flex gap-0.5 text-[#0a0a0a]">
                  {Array.from({ length: 5 }).map((_, i) => <Star key={i} filled={i < Math.round(rating)} />)}
                </div>
                <span className="text-[11px] text-[#a0a0a0]">{rating.toFixed(1)} ({product.num_reviews})</span>
              </div>
            )}

            <div className="h-px bg-[#e8e8e8] mb-8" />

            {/* Size selector */}
            {!isSingleSize && (
              <div className="mb-8">
                <div className="flex items-baseline justify-between mb-3">
                  <span className="label-sm text-[#0a0a0a]">Size</span>
                  <button className="text-[11px] text-[#a0a0a0] underline underline-offset-2 hover:text-[#0a0a0a] transition-colors">Size guide</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map(size => (
                    <button key={size} onClick={() => setSelectedSize(size)}
                      className={`size-btn ${selectedSize === size ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]' : ''}`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <button onClick={handleAddToCart} disabled={!canAdd}
              className={`w-full py-3.5 text-[11px] font-medium tracking-wider uppercase mb-3 transition-all duration-150 ${
                canAdd ? 'bg-[#0a0a0a] text-white hover:opacity-80' : 'bg-[#f4f4f4] text-[#a0a0a0] cursor-not-allowed'
              }`}>
              {added ? 'Added to bag ✓' : canAdd ? 'Add to bag' : 'Select a size'}
            </button>

            <div className="h-px bg-[#e8e8e8] my-8" />

            {/* Description accordion */}
            <button onClick={() => setDetailOpen(!detailOpen)} className="w-full flex items-center justify-between py-1 text-left">
              <span className="label-sm text-[#0a0a0a]">Product details</span>
              <span className="text-[#a0a0a0] text-lg leading-none">{detailOpen ? '−' : '+'}</span>
            </button>
            {detailOpen && (
              <p className="text-[13px] text-[#6b6b6b] leading-relaxed mt-4">{product.description}</p>
            )}

            <div className="h-px bg-[#e8e8e8] mt-4 mb-6" />

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3 text-[12px] text-[#6b6b6b]">
                <span>→</span><span>Free shipping on orders above Rp 500,000</span>
              </div>
              <div className="flex items-center gap-3 text-[12px] text-[#6b6b6b]">
                <span>→</span><span>Free returns within 30 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
