import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { formatPrice } from '../utils/format';
import { ArrowRight } from 'lucide-react';

const SORT_OPTIONS = [
  { label: 'Featured',        value: '' },
  { label: 'Price: Low–High', value: 'price_asc' },
  { label: 'Price: High–Low', value: 'price_desc' },
];

const ProductCard = ({ product }) => {
  const [sizes] = useState(product.sizes || []);
  const isSingleSize = sizes.length === 1 && sizes[0] === 'ONE SIZE';

  return (
    <Link to={`/product/${product.id}`} className="product-card-wrap block bg-white cursor-pointer">
      <div className="product-img-wrap aspect-[3/4] bg-[#f4f4f4] relative overflow-hidden">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover block" loading="lazy" />
        {product.is_featured && (
          <span className="absolute top-3 left-3 bg-white text-[9px] font-medium tracking-[0.08em] uppercase px-2 py-1 text-[#0a0a0a]">Featured</span>
        )}
        <div className="product-overlay absolute bottom-0 left-0 right-0 bg-white p-3 border-t border-[#e8e8e8]">
          <div className="w-full bg-[#0a0a0a] text-white text-[10px] tracking-[0.1em] uppercase py-2.5 text-center font-medium">
            {isSingleSize ? 'Add to bag' : 'Select size'}
          </div>
        </div>
      </div>
      <div className="px-3.5 pt-3.5 pb-4">
        <div className="text-[13px] text-[#0a0a0a] mb-1 leading-tight">{product.name}</div>
        <div className="text-[13px] text-[#6b6b6b]">{formatPrice(product.price)}</div>
      </div>
    </Link>
  );
};

const SkeletonCard = () => (
  <div className="bg-white">
    <div className="aspect-[3/4] bg-[#f4f4f4] animate-pulse" />
    <div className="px-3.5 pt-3.5 pb-4 space-y-2">
      <div className="h-3 bg-[#f4f4f4] rounded animate-pulse w-3/4" />
      <div className="h-3 bg-[#f4f4f4] rounded animate-pulse w-1/3" />
    </div>
  </div>
);

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/categories')
      .then(r => setCategories(r.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '8' });
    if (activeCategory) params.set('category', activeCategory);
    if (sort === 'price_asc')  { params.set('sortBy', 'price'); params.set('order', 'ASC'); }
    if (sort === 'price_desc') { params.set('sortBy', 'price'); params.set('order', 'DESC'); }

    api.get(`/products?${params}`)
      .then(r => {
        setProducts(r.data.products);
        setTotalPages(r.data.totalPages);
        setTotalProducts(r.data.totalProducts);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [activeCategory, sort, page]);

  const handleCategory = (slug) => { setActiveCategory(slug); setPage(1); };

  return (
    <div className="page-enter">
      {/* Hero */}
      <section className="grid grid-cols-1 md:grid-cols-2 min-h-[400px]">
        <div className="bg-[#e8e4df] relative overflow-hidden min-h-[320px]">
          <img
            src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80"
            alt="New collection"
            className="w-full h-full object-cover absolute inset-0"
          />
          <div className="absolute bottom-8 left-8">
            <span className="inline-block bg-white text-[#0a0a0a] text-[10px] font-medium tracking-[0.1em] uppercase px-3.5 py-1.5">
              New collection
            </span>
          </div>
        </div>
        <div className="flex flex-col justify-center px-10 py-14 bg-[#fafafa]">
          <p className="text-[10px] tracking-[0.22em] uppercase text-[#a0a0a0] mb-4">Summer / Fall 2025</p>
          <h1 className="text-[32px] font-normal tracking-[-0.02em] text-[#0a0a0a] mb-4 leading-[1.15]">
            Effortless<br />Minimalism
          </h1>
          <p className="text-[14px] text-[#6b6b6b] leading-relaxed mb-8 max-w-xs">
            Pakaian yang dirancang untuk kehidupan modern. Bersih, abadi, dan selalu relevan.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link to="/products" className="btn-black">Shop now <ArrowRight size={13} /></Link>
            <Link to="/category/Outerwear" className="btn-outline-dark">View all</Link>
          </div>
        </div>
      </section>

      <div className="h-px bg-[#e8e8e8]" />

      {/* Products */}
      <section className="px-6 pt-10 pb-16">
        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button onClick={() => handleCategory('')} className={`cat-chip ${activeCategory === '' ? 'active' : ''}`}>All</button>
          {categories.map(cat => (
            <button key={cat.id} onClick={() => handleCategory(cat.name)} className={`cat-chip ${activeCategory === cat.name ? 'active' : ''}`}>
              {cat.name}
            </button>
          ))}
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between py-3.5 border-y border-[#e8e8e8] mb-0">
          <span className="text-[12px] text-[#a0a0a0] tracking-wide">{totalProducts} items</span>
          <select value={sort} onChange={e => setSort(e.target.value)} className="text-[11px] tracking-wide text-[#6b6b6b] bg-transparent border-none outline-none cursor-pointer uppercase">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>Sort: {o.label}</option>)}
          </select>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#e8e8e8]">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 text-[#a0a0a0]">
            <p className="text-[12px] tracking-wide uppercase">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#e8e8e8]">
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-12">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button key={i} onClick={() => setPage(i + 1)}
                className={`w-8 h-8 text-[11px] transition-all duration-150 ${
                  page === i + 1 ? 'bg-[#0a0a0a] text-white' : 'border border-[#e8e8e8] text-[#6b6b6b] hover:border-[#0a0a0a] hover:text-[#0a0a0a]'
                }`}>
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default HomePage;
