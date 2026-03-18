import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { formatPrice } from '../utils/format';

const CategoryPage = () => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get(`/products?category=${encodeURIComponent(categoryName)}&limit=20`)
      .then(r => setProducts(r.data.products || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [categoryName]);

  return (
    <div className="page-enter">
      <div className="px-6 py-8 border-b border-[#e8e8e8]">
        <h1 className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#0a0a0a] mb-1">{categoryName}</h1>
        <p className="text-[12px] text-[#a0a0a0]">{products.length} items</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#e8e8e8]">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white">
              <div className="aspect-[3/4] bg-[#f4f4f4] animate-pulse" />
              <div className="px-3.5 pt-3.5 pb-4 space-y-2">
                <div className="h-3 bg-[#f4f4f4] rounded animate-pulse w-3/4" />
                <div className="h-3 bg-[#f4f4f4] rounded animate-pulse w-1/3" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <p className="text-[12px] tracking-wide uppercase text-[#a0a0a0]">No products in this category</p>
          <Link to="/products" className="btn-ghost-dark">View all products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#e8e8e8]">
          {products.map(p => (
            <Link key={p.id} to={`/product/${p.id}`} className="product-card-wrap block bg-white cursor-pointer">
              <div className="product-img-wrap aspect-[3/4] bg-[#f4f4f4] relative">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover block" loading="lazy" />
                <div className="product-overlay absolute bottom-0 left-0 right-0 bg-white p-3 border-t border-[#e8e8e8]">
                  <div className="w-full bg-[#0a0a0a] text-white text-[10px] tracking-[0.1em] uppercase py-2.5 text-center font-medium">View product</div>
                </div>
              </div>
              <div className="px-3.5 pt-3.5 pb-4">
                <div className="text-[13px] text-[#0a0a0a] mb-1 leading-tight">{p.name}</div>
                <div className="text-[13px] text-[#6b6b6b]">{formatPrice(p.price)}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
