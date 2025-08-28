/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { motion } from 'framer-motion';
import { Star, Package, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';

// Helper function for price formatting
const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency', 
        currency: 'IDR', 
        minimumFractionDigits: 0, 
        maximumFractionDigits: 0
    }).format(price);
};

// Unified ProductCard component matching AllProductsPage design
const ProductCard = ({ product, index }) => (
    <Link 
        to={`/product/${product.id}`}
        className="block no-underline focus:outline-none focus:ring-2 focus:ring-[#C0A080]/20 focus:ring-offset-2 rounded-xl transition-all duration-200"
    >
        <motion.div 
            className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-[#F0F0F0] w-full h-[320px] flex flex-col hover:border-[#C0A080]/50 cursor-pointer"
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            whileHover={{ y: -8, scale: 1.02 }}
        >
            <div className="relative overflow-hidden rounded-t-xl flex-shrink-0">
                {/* Badge */}
                {product.featured && (
                    <div className="absolute top-3 left-3 z-10 bg-[#C0A080] text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                        New
                    </div>
                )}
                
                {/* Main Image */}
                <motion.img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover transition-all duration-300 group-hover:scale-105"
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    loading="lazy"
                />
                
                {/* Rating Badge */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm rounded-full px-3 py-1 shadow-sm border border-[#F0F0F0]">
                    <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-semibold text-gray-700">{Number(product.average_rating).toFixed(1)}</span>
                    </div>
                </div>
            </div>
            
            {/* Product Info */}
            <div className="p-5 flex flex-col flex-grow">
                {/* Title */}
                <h5 className="text-sm font-semibold text-[#333333] mb-2 group-hover:text-[#C0A080] transition-colors duration-300 h-10 overflow-hidden leading-tight line-clamp-2">
                    {product.name}
                </h5>
                
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
            </div>
        </motion.div>
    </Link>
);

// Enhanced Pagination matching AllProductsPage style
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

// Enhanced Loading Skeleton matching AllProductsPage style
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

// Enhanced Empty State component matching AllProductsPage style
const EmptyState = ({ categoryName }) => (
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
                Maaf, tidak ada produk yang ditemukan dalam kategori <span className="font-medium">"{categoryName}"</span> saat ini.
            </p>
            <Link 
                to="/" 
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-[#C0A080] text-white font-medium text-sm sm:text-base rounded-lg hover:bg-[#B09070] transition-colors duration-200 shadow-sm hover:shadow-md"
            >
                Kembali ke Beranda
            </Link>
        </div>
    </motion.div>
);

// Enhanced Error State component matching AllProductsPage style
const ErrorState = ({ categoryName, onRetry }) => (
    <motion.div 
        className="text-center mt-16 sm:mt-20 px-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
    >
        <div className="max-w-md mx-auto">
            <AlertCircle size={48} className="mx-auto text-red-300 mb-4 sm:mb-6" />
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-700 mb-2">
                Terjadi Kesalahan
            </h2>
            <p className="text-sm sm:text-base text-gray-500 mb-6 leading-relaxed">
                Gagal memuat produk untuk kategori "{categoryName}". Silakan coba lagi.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button 
                    onClick={onRetry}
                    className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-[#C0A080] text-white font-medium text-sm sm:text-base rounded-lg hover:bg-[#B09070] transition-colors duration-200 shadow-sm hover:shadow-md"
                >
                    Coba Lagi
                </button>
                <Link 
                    to="/" 
                    className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gray-100 text-gray-700 font-medium text-sm sm:text-base rounded-lg hover:bg-gray-200 transition-colors duration-200"
                >
                    Kembali ke Beranda
                </Link>
            </div>
        </div>
    </motion.div>
);

const CategoryPage = () => {
    const { categoryName } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();

    const formattedCategoryName = categoryName?.replace(/-/g, ' ') || '';

    const fetchProductsByCategory = async (page = 1) => {
        setLoading(true);
        setError(false);
        
        try {
            const response = await api.get('/products', {
                params: { 
                    category: formattedCategoryName,
                    page: page,
                    limit: 12
                }
            });
            
            if (response.data) {
                setProducts(response.data.products || []);
                setTotalPages(response.data.totalPages || 0);
                setCurrentPage(response.data.currentPage || 1);
            }
        } catch (error) {
            console.error(`Failed to fetch products for category ${formattedCategoryName}:`, error);
            setError(true);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const page = parseInt(queryParams.get('page')) || 1;
        
        if (formattedCategoryName) {
            fetchProductsByCategory(page);
        }
    }, [formattedCategoryName, location.search]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages && page !== currentPage) {
            // Smooth scroll to top when changing pages
            window.scrollTo({ top: 0, behavior: 'smooth' });
            navigate(`/category/${categoryName}?page=${page}`);
        }
    };

    const handleRetry = () => {
        const queryParams = new URLSearchParams(location.search);
        const page = parseInt(queryParams.get('page')) || 1;
        fetchProductsByCategory(page);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Modern link styles matching AllProductsPage */}
            <style>
                {`
                .category-page a {
                    text-decoration: none !important;
                    color: inherit !important;
                }
                
                .category-page a:hover,
                .category-page a:focus,
                .category-page a:active,
                .category-page a:visited {
                    text-decoration: none !important;
                    color: inherit !important;
                }
                
                .category-page a:focus-visible {
                    outline: 2px solid #C0A080 !important;
                    outline-offset: 2px !important;
                    border-radius: 12px !important;
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

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 category-page">
                {/* Header Section matching AllProductsPage */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-6 sm:mb-8"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-slate-900 capitalize">
                                {formattedCategoryName}
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
                            <span className="text-gray-700 capitalize">{formattedCategoryName}</span>
                        </nav>
                    </div>
                    
                    <div className="h-px bg-gradient-to-r from-[#C0A080]/30 via-[#C0A080]/20 to-[#C0A080]/10 mt-4 sm:mt-6" />
                </motion.div>

                {/* Content Section */}
                {loading ? (
                    <ProductGridSkeleton />
                ) : error ? (
                    <ErrorState categoryName={formattedCategoryName} onRetry={handleRetry} />
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
                            currentPage={currentPage}
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
                            Menampilkan halaman {currentPage} dari {totalPages} 
                            {totalPages > 1 && ` (${products.length} produk)`}
                        </motion.div>
                    </>
                ) : (
                    <EmptyState categoryName={formattedCategoryName} />
                )}
            </div>
        </div>
    );
};

export default CategoryPage;