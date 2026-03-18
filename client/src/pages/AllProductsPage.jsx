import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../services/api';
import { formatPrice } from '../utils/format';

const SORT_OPTIONS = [
  { label: 'Featured',        value: '' },
  { label: 'Price: Low–High', value: 'price_asc' },
  { label: 'Price: High–Low', value: 'price_desc' },
];

const ProductCard = ({ product }) => (
  <Link to={`/product/${product.id}`} className="product-card-wrap block bg-white cursor-pointer">
    <div className="product-img-wrap aspect-[3/4] bg-[#f4f4f4] relative">
      <img src={product.image} alt={product.name} className="w-full h-full object-cover block" loading="lazy" />
      {product.is_featured && (
        <span className="absolute top-3 left-3 bg-white text-[9px] font-medium tracking-[0.08em] uppercase px-2 py-1 text-[#0a0a0a]">Featured</span>
      )}
      <div className="product-overlay absolute bottom-0 left-0 right-0 bg-white p-3 border-t border-[#e8e8e8]">
        <div className="w-full bg-[#0a0a0a] text-white text-[10px] tracking-[0.1em] uppercase py-2.5 text-center font-medium">View product</div>
      </div>
    </div>
    <div className="px-3.5 pt-3.5 pb-4">
      <div className="text-[13px] text-[#0a0a0a] mb-1 leading-tight">{product.name}</div>
      <div className="text-[13px] text-[#6b6b6b]">{formatPrice(product.price)}</div>
    </div>
  </Link>
);

const AllProductsPage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    api.get('/categories').then(r => setCategories(r.data)).catch(console.error);
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '12' });
    if (activeCategory) params.set('category', activeCategory);
    if (searchQuery)    params.set('search', searchQuery);
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
  }, [activeCategory, sort, page, searchQuery]);

  return (
    <div className="page-enter">
      {/* Header */}
      <div className="px-6 py-8 border-b border-[#e8e8e8]">
        <div className="flex items-baseline justify-between">
          <div>
            <h1 className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#0a0a0a] mb-1">
              {searchQuery ? `Results for "${searchQuery}"` : 'All products'}
            </h1>
            <p className="text-[12px] text-[#a0a0a0]">{totalProducts} items</p>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar filters */}
        <aside className="hidden md:block w-48 flex-shrink-0 px-6 py-8 border-r border-[#e8e8e8]">
          <p className="label-sm text-[#0a0a0a] mb-5">Category</p>
          <div className="flex flex-col gap-1">
            <button onClick={() => { setActiveCategory(''); setPage(1); }}
              className={`text-left text-[12px] py-1.5 transition-colors duration-150 ${
                activeCategory === '' ? 'text-[#0a0a0a] font-medium' : 'text-[#6b6b6b] hover:text-[#0a0a0a]'
              }`}>
              All
            </button>
            {categories.map(cat => (
              <button key={cat.id} onClick={() => { setActiveCategory(cat.name); setPage(1); }}
                className={`text-left text-[12px] py-1.5 transition-colors duration-150 ${
                  activeCategory === cat.name ? 'text-[#0a0a0a] font-medium' : 'text-[#6b6b6b] hover:text-[#0a0a0a]'
                }`}>
                {cat.name}
              </button>
            ))}
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1 min-w-0">
          {/* Sort bar */}
          <div className="flex items-center justify-between px-6 py-3.5 border-b border-[#e8e8e8]">
            {/* Mobile category tabs */}
            <div className="flex gap-2 md:hidden overflow-x-auto pb-1 flex-1 mr-4">
              <button onClick={() => { setActiveCategory(''); setPage(1); }}
                className={`cat-chip flex-shrink-0 text-[10px] px-3 py-1.5 ${activeCategory === '' ? 'active' : ''}`}>All</button>
              {categories.map(cat => (
                <button key={cat.id} onClick={() => { setActiveCategory(cat.name); setPage(1); }}
                  className={`cat-chip flex-shrink-0 text-[10px] px-3 py-1.5 ${activeCategory === cat.name ? 'active' : ''}`}>
                  {cat.name}
                </button>
              ))}
            </div>
            <select value={sort} onChange={e => { setSort(e.target.value); setPage(1); }}
              className="text-[11px] tracking-wide text-[#6b6b6b] bg-transparent border-none outline-none cursor-pointer uppercase ml-auto">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>Sort: {o.label}</option>)}
            </select>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[#e8e8e8]">
              {Array.from({ length: 12 }).map((_, i) => (
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
              <p className="text-[12px] tracking-wide uppercase text-[#a0a0a0]">No products found</p>
              <button onClick={() => { setActiveCategory(''); setSort(''); setPage(1); }}
                className="btn-ghost-dark">Clear filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-px bg-[#e8e8e8]">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 py-12">
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
        </div>
      </div>
    </div>
  );
};

export default AllProductsPage;
