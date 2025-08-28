/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { 
    Star, 
    ShoppingCart, 
    Plus, 
    Minus, 
    ArrowLeft, 
    Package,
    User,
    Calendar,
    AlertCircle,
    Heart,
    Share2,
    Truck
} from 'lucide-react';

const MySwal = withReactContent(Swal);

// Helper function for price formatting
const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
};

// Enhanced Star Rating Component
const StarRating = ({ rating, size = 'default', showNumber = true }) => {
    const starSize = size === 'small' ? 'w-3 h-3' : size === 'large' ? 'w-5 h-5' : 'w-4 h-4';
    
    return (
        <div className="flex items-center space-x-1">
            <div className="flex items-center space-x-0.5">
                {[...Array(5)].map((_, i) => (
                    <Star 
                        key={i}
                        className={`${starSize} ${
                            i < Math.floor(rating) 
                                ? 'text-amber-400 fill-current' 
                                : i < rating 
                                ? 'text-amber-400 fill-current opacity-50'
                                : 'text-gray-300'
                        }`} 
                    />
                ))}
            </div>
            {showNumber && (
                <span className="text-sm font-medium text-[#333333] ml-1">
                    {Number(rating).toFixed(1)}
                </span>
            )}
        </div>
    );
};

// Size Selector Component
const SizeSelector = ({ sizes, selectedSize, onSizeChange }) => (
    <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#333333] mb-3">Pilih Ukuran:</h3>
        <div className="flex gap-2 flex-wrap">
            {sizes.map(size => (
                <motion.button 
                    key={size} 
                    onClick={() => onSizeChange(size)}
                    className={`border-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        selectedSize === size 
                            ? 'bg-[#C0A080] text-white border-[#C0A080] shadow-sm' 
                            : 'bg-white text-[#555555] border-[#F0F0F0] hover:border-[#C0A080] hover:bg-[#FAFAFA]'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    {size}
                </motion.button>
            ))}
        </div>
    </div>
);

// Quantity Selector Component
const QuantitySelector = ({ quantity, onQuantityChange }) => (
    <div className="mb-6">
        <h3 className="text-lg font-semibold text-[#333333] mb-3">Kuantitas:</h3>
        <div className="flex items-center border-2 border-[#F0F0F0] rounded-lg w-fit bg-white">
            <motion.button 
                onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                className="p-3 text-[#666666] hover:text-[#C0A080] hover:bg-[#FAFAFA] rounded-l-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={quantity <= 1}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Minus className="w-4 h-4" />
            </motion.button>
            <span className="px-6 py-3 text-lg font-semibold text-[#333333] min-w-[60px] text-center border-x border-[#F0F0F0]">
                {quantity}
            </span>
            <motion.button 
                onClick={() => onQuantityChange(quantity + 1)}
                className="p-3 text-[#666666] hover:text-[#C0A080] hover:bg-[#FAFAFA] rounded-r-lg transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <Plus className="w-4 h-4" />
            </motion.button>
        </div>
    </div>
);

// Review Card Component
const ReviewCard = ({ review, index }) => (
    <motion.div 
        className="bg-white rounded-xl border border-[#F0F0F0] p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
    >
        <div className="flex items-start justify-between mb-3">
            <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-[#C0A080] rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-white" />
                </div>
                <div>
                    <p className="font-semibold text-[#333333]">{review.userName}</p>
                    <div className="flex items-center space-x-2 mt-1">
                        <StarRating rating={review.rating} size="small" showNumber={false} />
                        <span className="text-sm text-[#666666]">•</span>
                        <div className="flex items-center text-sm text-[#666666]">
                            <Calendar className="w-3 h-3 mr-1" />
                            {new Date(review.created_at).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
        <p className="text-[#555555] leading-relaxed">{review.comment}</p>
    </motion.div>
);

// Loading Skeleton
const ProductDetailSkeleton = () => (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Image skeleton */}
            <div className="lg:w-1/2">
                <div className="aspect-square bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5] rounded-2xl animate-pulse" />
            </div>
            
            {/* Content skeleton */}
            <div className="lg:w-1/2 space-y-4">
                <div className="h-8 bg-[#FAFAFA] rounded w-3/4 animate-pulse" />
                <div className="h-6 bg-[#FAFAFA] rounded w-1/2 animate-pulse" />
                <div className="h-8 bg-[#FAFAFA] rounded w-1/3 animate-pulse" />
                <div className="space-y-2">
                    <div className="h-4 bg-[#FAFAFA] rounded animate-pulse" />
                    <div className="h-4 bg-[#FAFAFA] rounded w-5/6 animate-pulse" />
                </div>
                <div className="h-12 bg-[#FAFAFA] rounded animate-pulse" />
            </div>
        </div>
    </div>
);

// Error State Component
const ErrorState = ({ onRetry }) => (
    <motion.div 
        className="text-center mt-16 sm:mt-20 px-4"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
    >
        <div className="max-w-md mx-auto">
            <AlertCircle size={48} className="mx-auto text-[#C0A080] mb-6" />
            <h2 className="text-2xl font-semibold text-[#333333] mb-2">
                Produk Tidak Ditemukan
            </h2>
            <p className="text-[#666666] mb-6 leading-relaxed">
                Maaf, produk yang Anda cari tidak dapat ditemukan atau telah dihapus.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button 
                    onClick={onRetry}
                    className="inline-flex items-center px-6 py-3 bg-[#C0A080] text-white font-medium rounded-lg hover:bg-[#B09070] transition-colors duration-200"
                >
                    Coba Lagi
                </button>
                <Link 
                    to="/" 
                    className="inline-flex items-center px-6 py-3 bg-[#FAFAFA] text-[#555555] font-medium rounded-lg hover:bg-[#F5F5F5] transition-colors duration-200"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Kembali ke Beranda
                </Link>
            </div>
        </div>
    </motion.div>
);

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const { addToCart } = useCart();

    const fetchProductAndReviews = async () => {
        setLoading(true);
        setError(false);
        
        try {
            const [productRes, reviewsRes] = await Promise.all([
                api.get(`/products/${id}`),
                api.get(`/reviews/product/${id}`)
            ]);
            
            if (productRes.data) {
                setProduct(productRes.data);
                setReviews(reviewsRes.data || []);

                if (productRes.data.sizes && productRes.data.sizes.length > 0) {
                    setSelectedSize(productRes.data.sizes[0]);
                }
            } else {
                setError(true);
            }
        } catch (error) {
            console.error('Error fetching product data:', error);
            setError(true);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            fetchProductAndReviews();
        }
    }, [id]);

    const handleAddToCart = () => {
        if (!selectedSize && product.sizes && product.sizes.length > 0) {
            MySwal.fire({
                title: 'Pilih Ukuran',
                text: 'Silakan pilih ukuran terlebih dahulu!',
                icon: 'warning',
                confirmButtonColor: '#C0A080'
            });
            return;
        }
        
        addToCart({ ...product, selectedSize }, quantity);
        
        MySwal.fire({
            title: 'Berhasil!',
            html: `<div class="text-center"><strong>${quantity} pcs</strong><br/>${product.name}<br/>telah ditambahkan ke keranjang</div>`,
            icon: 'success',
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: '#FAFAFA',
            color: '#333333',
            didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer);
                toast.addEventListener('mouseleave', Swal.resumeTimer);
            }
        });
    };

    const handleShare = async () => {
        if (navigator.share && navigator.canShare({ url: window.location.href })) {
            try {
                await navigator.share({
                    title: product.name,
                    text: `Lihat produk ${product.name}`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            MySwal.fire({
                title: 'Link Disalin!',
                text: 'Link produk telah disalin ke clipboard',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });
        }
    };

    if (loading) return <ProductDetailSkeleton />;
    if (error || !product) return <ErrorState onRetry={fetchProductAndReviews} />;

    return (
        <div className="min-h-screen bg-[#FFFFFF]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                {/* Breadcrumb Navigation */}
                <motion.nav 
                    className="mb-6 sm:mb-8"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                >
                    <div className="flex items-center text-sm text-[#666666] space-x-2">
                        <Link to="/" className="hover:text-[#C0A080] transition-colors duration-200">
                            Beranda
                        </Link>
                        <span>/</span>
                        <Link to={`/category/${product.category?.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-[#C0A080] transition-colors duration-200">
                            {product.category}
                        </Link>
                        <span>/</span>
                        <span className="text-[#333333] truncate max-w-[200px]">{product.name}</span>
                    </div>
                </motion.nav>

                {/* Main Product Section */}
                <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-8 sm:mb-12 border border-[#F0F0F0]">
                    <div className="flex flex-col lg:flex-row">
                        {/* Product Image */}
                        <motion.div 
                            className="lg:w-1/2 relative"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <div className="aspect-square lg:aspect-[4/5] relative overflow-hidden">
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/5 to-transparent" />
                            </div>
                            
                            {/* Action buttons overlay */}
                            <div className="absolute top-4 right-4 flex flex-col space-y-2">           
                                <motion.button
                                    onClick={handleShare}
                                    className="p-2 bg-white/90 backdrop-blur-sm rounded-full text-[#666666] hover:text-[#C0A080] shadow-sm transition-colors duration-200"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Share2 className="w-5 h-5" />
                                </motion.button>
                            </div>
                        </motion.div>

                        {/* Product Info */}
                        <motion.div 
                            className="lg:w-1/2 p-6 sm:p-8 lg:p-10"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                        >
                            {/* Product Title */}
                            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#333333] mb-4 leading-tight">
                                {product.name}
                            </h1>

                            {/* Rating Section */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center space-x-4">
                                    <StarRating rating={product.average_rating} size="default" />
                                    {product.num_reviews > 0 && (
                                        <span className="text-sm text-[#666666]">
                                            ({product.num_reviews} ulasan)
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Price */}
                            <div className="mb-6">
                                <p className="text-3xl sm:text-4xl font-bold text-[#C0A080]">
                                    {formatPrice(product.price)}
                                </p>
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-[#333333] mb-3">Deskripsi Produk:</h3>
                                <p className="text-[#555555] leading-relaxed">
                                    {product.description || 'Tidak ada deskripsi tersedia untuk produk ini.'}
                                </p>
                            </div>

                            {/* Size Selection */}
                            {product.sizes && product.sizes.length > 0 && (
                                <SizeSelector 
                                    sizes={product.sizes}
                                    selectedSize={selectedSize}
                                    onSizeChange={setSelectedSize}
                                />
                            )}

                            {/* Quantity Selection */}
                            <QuantitySelector 
                                quantity={quantity}
                                onQuantityChange={setQuantity}
                            />

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <motion.button
                                    onClick={handleAddToCart}
                                    className="flex-1 flex items-center justify-center space-x-2 bg-[#C0A080] text-white font-bold py-4 px-6 rounded-xl shadow-sm hover:bg-[#B09070] transition-all duration-300"
                                    whileHover={{ scale: 1.02, y: -1 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    <span>Tambah ke Keranjang</span>
                                </motion.button>
                            
                            </div>

                        </motion.div>
                    </div>
                </div>

                {/* Reviews Section */}
                <motion.div 
                    className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 border border-[#F0F0F0]"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl sm:text-3xl font-bold text-[#333333]">
                            Ulasan Produk
                        </h2>
                        {reviews.length > 0 && (
                            <div className="flex items-center space-x-2">
                                <StarRating rating={product.average_rating} size="default" />
                                <span className="text-sm text-[#666666]">
                                    ({reviews.length} ulasan)
                                </span>
                            </div>
                        )}
                    </div>

                    {reviews.length > 0 ? (
                        <div className="space-y-4 sm:space-y-6">
                            {reviews.map((review, index) => (
                                <ReviewCard key={review.id} review={review} index={index} />
                            ))}
                        </div>
                    ) : (
                        <motion.div 
                            className="text-center py-12"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <Star size={48} className="mx-auto text-[#F0F0F0] mb-4" />
                            <h3 className="text-xl font-semibold text-[#333333] mb-2">
                                Belum Ada Ulasan
                            </h3>
                            <p className="text-[#666666]">
                                Jadilah yang pertama memberi ulasan untuk produk ini.
                            </p>
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default ProductDetailPage;