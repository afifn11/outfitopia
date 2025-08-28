/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Search, Filter, Package, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';

// Fungsi helper untuk memformat harga agar konsisten
const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
};

// Enhanced ProductCard component with custom color palette
const ProductCard = ({ product, index }) => (
    <motion.div 
        className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full overflow-hidden border border-[#F0F0F0] cursor-pointer hover:border-[#C0A080]/50"
        variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
        }}
        transition={{ duration: 0.5, delay: index * 0.05 }}
        whileHover={{ y: -8, scale: 1.02 }}
    >
        <Link 
            to={`/product/${product.id}`} 
            className="block h-full flex flex-col no-underline focus:outline-none focus:ring-2 focus:ring-[#C0A080]/20 focus:ring-offset-2 rounded-xl transition-all duration-200"
        >
            <div className="relative overflow-hidden rounded-t-xl flex-shrink-0">
                <motion.img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover transition-all duration-300 group-hover:scale-105"
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    loading="lazy"
                />
                
                {/* Badge rating */}
                {product.average_rating && (
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm border border-[#F0F0F0]">
                        <div className="flex items-center space-x-1">
                            <Star className="w-3 h-3 text-yellow-400 fill-current" />
                            <span className="text-xs font-semibold text-gray-700">{Number(product.average_rating).toFixed(1)}</span>
                        </div>
                    </div>
                )}
            </div>
            
            <div className="p-5 flex flex-col flex-grow">
                <h3 className="text-sm font-semibold text-[#333333] mb-2 line-clamp-2 group-hover:text-[#C0A080] transition-colors duration-300 h-10 overflow-hidden leading-tight">
                    {product.name}
                </h3>
                
                {/* Price */}
                <div className="mb-3">
                    <div className="flex items-center space-x-2">
                        <span className="text-lg font-bold text-[#333333]">
                            {formatPrice(product.price)}
                        </span>
                        {/* Old price jika ada diskon */}
                        {product.old_price && (
                            <span className="text-sm text-gray-400 line-through">
                                {formatPrice(product.old_price)}
                            </span>
                        )}
                    </div>
                </div>
                
                {/* Rating */}
                {product.average_rating && (
                    <div className="mt-auto flex items-center space-x-1">
                        <div className="flex items-center space-x-0.5">
                            {[...Array(5)].map((_, i) => {
                                const rating = Number(product.average_rating);
                                const isHalf = rating > i && rating < i + 1;
                                const isFull = rating > i;
                                
                                return (
                                    <div key={i} className="relative">
                                        <Star className="w-3 h-3 text-gray-300" />
                                        {isFull && !isHalf && (
                                            <Star className="absolute inset-0 w-3 h-3 text-yellow-400 fill-current" />
                                        )}
                                        {isHalf && (
                                            <div className="absolute inset-0 overflow-hidden w-1/2">
                                                <Star className="w-3 h-3 text-yellow-400 fill-current" />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        <span className="text-xs text-gray-500">({product.num_reviews || 0})</span>
                    </div>
                )}
            </div>
        </Link>
    </motion.div>
);

// Enhanced Pagination matching CategoryPage style
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pageNumbers = [];
        const delta = window.innerWidth < 640 ? 1 : 2; // Fewer pages on mobile
        const range = [];
        const rangeWithDots = [];
        let l;

        range.push(1);
        
        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            if (i < totalPages && i > 1) range.push(i);
        }
        
        if (totalPages > 1) range.push(totalPages);
        
        for (let i of range) {
            if (l) {
                if (i - l === 2) rangeWithDots.push(l + 1);
                else if (i - l !== 1) rangeWithDots.push('...');
            }
            rangeWithDots.push(i);
            l = i;
        }
        
        return rangeWithDots;
    };

    return (
        <motion.nav 
            className="flex justify-center mt-8 sm:mt-12" 
            aria-label="Navigasi halaman"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
        >
            <ul className="flex items-center space-x-1 sm:space-x-2">
                {/* Previous button */}
                <li>
                    <button 
                        onClick={() => onPageChange(currentPage - 1)} 
                        disabled={currentPage === 1} 
                        className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        aria-label="Halaman sebelumnya"
                    >
                        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </li>
                
                {/* Page numbers */}
                {getPageNumbers().map((number, index) => (
                    <li key={index}>
                        {number === '...' ? (
                            <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-gray-500 bg-white border border-gray-300">
                                ...
                            </span>
                        ) : (
                            <button 
                                onClick={() => onPageChange(number)} 
                                className={`flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-sm font-medium border transition-colors duration-200 ${
                                    currentPage === number 
                                        ? 'z-10 text-white bg-[#C0A080] border-[#C0A080]' 
                                        : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
                                } ${index === 0 ? 'rounded-l-lg' : ''} ${index === getPageNumbers().length - 1 ? 'rounded-r-lg' : ''}`}
                                aria-current={currentPage === number ? 'page' : undefined}
                            >
                                {number}
                            </button>
                        )}
                    </li>
                ))}
                
                {/* Next button */}
                <li>
                    <button 
                        onClick={() => onPageChange(currentPage + 1)} 
                        disabled={currentPage === totalPages} 
                        className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                        aria-label="Halaman berikutnya"
                    >
                        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                </li>
            </ul>
        </motion.nav>
    );
};

// Enhanced Loading Skeleton with custom colors
const ProductGridSkeleton = () => (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-[#F0F0F0] overflow-hidden">
                <div className="h-48 bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5] animate-pulse relative">
                    {/* Rating badge skeleton */}
                    <div className="absolute top-3 right-3 bg-[#F0F0F0] rounded-full w-12 h-6 animate-pulse"></div>
                </div>
                <div className="p-5 space-y-3">
                    <div className="space-y-2">
                        <div className="h-4 bg-[#F0F0F0] rounded animate-pulse" />
                        <div className="h-4 bg-[#F0F0F0] rounded w-3/4 animate-pulse" />
                    </div>
                    <div className="h-6 bg-gradient-to-r from-[#F0F0F0] to-[#FAFAFA] rounded w-2/3 animate-pulse"></div>
                    {/* Star rating skeleton */}
                    <div className="flex items-center space-x-1">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="w-3 h-3 bg-[#F0F0F0] rounded animate-pulse"></div>
                        ))}
                        <div className="h-3 bg-[#F0F0F0] rounded w-8 ml-2 animate-pulse"></div>
                    </div>
                </div>
            </div>
        ))}
    </div>
);

// Enhanced Empty State
const EmptyState = () => (
    <motion.div 
        className="text-center mt-16 sm:mt-20 px-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
    >
        <div className="max-w-md mx-auto">
            <Package size={48} className="mx-auto text-slate-300 mb-4 sm:mb-6" />
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-700 mb-2">
                Produk Tidak Ditemukan
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mb-6 leading-relaxed">
                Maaf, tidak ada produk yang sesuai dengan pencarian Anda. Coba ubah kata kunci atau filter pencarian.
            </p>
            <button 
                onClick={() => window.location.reload()}
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-[#C0A080] text-white font-medium text-sm sm:text-base rounded-lg hover:bg-[#B09070] transition-colors duration-200 shadow-sm hover:shadow-md"
            >
                Muat Ulang
            </button>
        </div>
    </motion.div>
);

const AllProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [totalPages, setTotalPages] = useState(0);

    // Menggunakan satu state untuk semua filter agar lebih mudah dikelola
    const [filters, setFilters] = useState({
        searchTerm: '',
        sortBy: 'name-asc',
        currentPage: 1
    });

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        setFilters({
            currentPage: parseInt(queryParams.get('page')) || 1,
            searchTerm: queryParams.get('search') || '',
            sortBy: queryParams.get('sort') || 'name-asc'
        });
    }, [location.search]);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params = {
                    search: filters.searchTerm,
                    sortBy: filters.sortBy.split('-')[0],
                    order: filters.sortBy.split('-')[1],
                    page: filters.currentPage,
                    limit: 12,
                };
                const response = await api.get('/products', { params });
                setProducts(response.data.products);
                setTotalPages(response.data.totalPages);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };

        const handler = setTimeout(() => {
            fetchProducts();
        }, 300); 

        return () => clearTimeout(handler);
    }, [filters]);

    const updateURL = (newFilters) => {
        const queryParams = new URLSearchParams();
        queryParams.set('page', newFilters.currentPage);
        if (newFilters.searchTerm) queryParams.set('search', newFilters.searchTerm);
        if (newFilters.sortBy) queryParams.set('sort', newFilters.sortBy);
        navigate(`${location.pathname}?${queryParams.toString()}`);
    };

    const handleSearchChange = (e) => {
        updateURL({ ...filters, searchTerm: e.target.value, currentPage: 1 });
    };

    const handleSortChange = (e) => {
        updateURL({ ...filters, sortBy: e.target.value, currentPage: 1 });
    };

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            // Smooth scroll to top when changing pages
            window.scrollTo({ top: 0, behavior: 'smooth' });
            updateURL({ ...filters, currentPage: page });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Modern link styles */}
            <style>
                {`
                .all-products-page a {
                    text-decoration: none !important;
                }
                
                .all-products-page a:hover,
                .all-products-page a:focus,
                .all-products-page a:active,
                .all-products-page a:visited {
                    text-decoration: none !important;
                    outline: none !important;
                }
                
                .all-products-page a:focus-visible {
                    outline: 2px solid #C0A080 !important;
                    outline-offset: 2px !important;
                    border-radius: 8px !important;
                }
                
                .line-clamp-2 {
                    display: -webkit-box !important;
                    -webkit-line-clamp: 2 !important;
                    -webkit-box-orient: vertical !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                    line-height: 1.2 !important;
                }
                `}
            </style>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 all-products-page">
                {/* Header Section */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 sm:mb-8"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900">
                                Semua Produk
                            </h1>
                            <p className="text-sm sm:text-base text-gray-600 mt-1">
                                {loading ? 'Memuat produk...' : `${products.length} produk ditemukan`}
                            </p>
                        </div>
                        
                        {/* Breadcrumb for better navigation */}
                        <nav className="text-sm text-gray-500">
                            <Link 
                                to="/" 
                                className="hover:text-[#C0A080] transition-colors duration-200 no-underline focus:outline-none focus:ring-2 focus:ring-[#C0A080]/20 focus:ring-offset-1 rounded px-1 py-0.5"
                            >
                                Beranda
                            </Link>
                            <span className="mx-2">/</span>
                            <span className="text-gray-700">Semua Produk</span>
                        </nav>
                    </div>
                    
                    <div className="h-px bg-gradient-to-r from-[#C0A080]/30 via-[#C0A080]/20 to-[#C0A080]/10 mt-4 sm:mt-6" />
                </motion.div>

                {/* Enhanced Filter Section */}
                <motion.div 
                    className="mb-6 sm:mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                >
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
                        <div className="flex flex-col lg:flex-row gap-4">
                            {/* Search Input */}
                            <div className="flex-grow">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Cari berdasarkan nama produk..."
                                        value={filters.searchTerm}
                                        onChange={handleSearchChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C0A080]/50 focus:border-[#C0A080] transition-all duration-200 bg-gray-50 focus:bg-white"
                                    />
                                </div>
                            </div>
                            
                            {/* Sort Select */}
                            <div className="lg:w-64">
                                <div className="relative">
                                    <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <select
                                        value={filters.sortBy}
                                        onChange={handleSortChange}
                                        className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#C0A080]/50 focus:border-[#C0A080] transition-all duration-200 bg-gray-50 focus:bg-white appearance-none cursor-pointer"
                                    >
                                        <option value="name-asc">Urutkan: Nama (A-Z)</option>
                                        <option value="name-desc">Urutkan: Nama (Z-A)</option>
                                        <option value="price-asc">Urutkan: Harga (Terendah)</option>
                                        <option value="price-desc">Urutkan: Harga (Tertinggi)</option>
                                    </select>
                                    <ChevronRight className="absolute right-3 top-1/2 transform -translate-y-1/2 rotate-90 text-gray-400 w-4 h-4 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Content Section */}
                {loading ? (
                    <ProductGridSkeleton />
                ) : products.length > 0 ? (
                    <>
                        {/* Products Grid */}
                        <motion.div 
                            className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-6"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                visible: { transition: { staggerChildren: 0.05 } },
                                hidden: {}
                            }}
                        >
                            {products.map((product, index) => (
                                <ProductCard key={product.id} product={product} index={index} />
                            ))}
                        </motion.div>
                        
                        {/* Pagination */}
                        <Pagination
                            currentPage={filters.currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                        
                        {/* Results summary for accessibility */}
                        <motion.div 
                            className="text-center mt-6 text-sm text-gray-500"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.4 }}
                        >
                            Menampilkan halaman {filters.currentPage} dari {totalPages} 
                            {totalPages > 1 && ` (${products.length} produk)`}
                        </motion.div>
                    </>
                ) : (
                    <EmptyState />
                )}
            </div>
        </div>
    );
};

export default AllProductsPage;