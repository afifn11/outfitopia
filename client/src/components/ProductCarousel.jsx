/* eslint-disable no-unused-vars */
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

// Import komponen dan modul Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import CSS bawaan Swiper
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

// Fungsi helper untuk memformat harga
const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
};

// Komponen Kartu Produk dengan seluruh area dapat diklik
const ProductCard = ({ product }) => {
    return (
        <Link 
            to={`/product/${product.id}`}
            className="block no-underline focus:outline-none focus:ring-2 focus:ring-[#C0A080]/20 focus:ring-offset-2 rounded-xl transition-all duration-200"
        >
            <motion.div 
                className="group bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-[#F0F0F0] w-full h-[320px] flex flex-col hover:border-[#C0A080]/50 cursor-pointer"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
                        <span className="text-xs text-gray-500">({product.num_reviews})</span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

const ProductCarousel = ({ title, products }) => {
    if (!products || products.length === 0) return null;

    // Duplicate products untuk loop yang lebih smooth jika jumlah produk sedikit
    const duplicatedProducts = products.length < 6 ? [...products, ...products] : products;

    return (
        <section className="mb-16 relative">
            {/* Header dengan palet warna custom */}
            <div className="text-center mb-10">
                <motion.h2 
                    className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#333333] mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {title}
                </motion.h2>
                <motion.div 
                    className="w-20 h-1 bg-[#C0A080] mx-auto rounded-full"
                    initial={{ width: 0 }}
                    whileInView={{ width: 80 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                />
            </div>
            
            {/* Enhanced Swiper Styling dengan palet warna custom */}
            <style>
                {`
                .product-carousel {
                    position: relative;
                    z-index: 1;
                }
                
                .swiper-button-next, .swiper-button-prev {
                    color: #ffffff !important;
                    background: #C0A080 !important;
                    border-radius: 50% !important;
                    width: 40px !important;
                    height: 40px !important;
                    box-shadow: 0 4px 12px rgba(192, 160, 128, 0.25) !important;
                    border: 2px solid rgba(255, 255, 255, 0.2) !important;
                    backdrop-filter: blur(10px) !important;
                    transition: all 0.3s ease !important;
                    z-index: 10 !important;
                    margin-top: 0 !important;
                    top: 50% !important;
                    transform: translateY(-50%) !important;
                }
                
                .swiper-button-next {
                    right: -16px !important;
                }
                
                .swiper-button-prev {
                    left: -16px !important;
                }
                
                .swiper-button-next:hover, .swiper-button-prev:hover {
                    transform: translateY(-50%) scale(1.1) !important;
                    background: #B09070 !important;
                    box-shadow: 0 6px 16px rgba(192, 160, 128, 0.35) !important;
                    border-color: rgba(255, 255, 255, 0.3) !important;
                }
                
                .swiper-button-next::after, .swiper-button-prev::after {
                    font-size: 16px !important;
                    font-weight: bold !important;
                }
                
                .swiper-button-disabled {
                    opacity: 0.3 !important;
                    transform: translateY(-50%) scale(0.9) !important;
                }
                
                .swiper-pagination {
                    bottom: -12px !important;
                    position: relative !important;
                    margin-top: 20px !important;
                }
                
                .swiper-pagination-bullet {
                    width: 10px !important;
                    height: 10px !important;
                    background-color: #F0F0F0 !important;
                    opacity: 0.7 !important;
                    transition: all 0.3s ease !important;
                }
                
                .swiper-pagination-bullet-active {
                    background: #C0A080 !important;
                    transform: scale(1.3) !important;
                    opacity: 1 !important;
                    box-shadow: 0 2px 8px rgba(192, 160, 128, 0.3) !important;
                }
                
                /* Modern link styles untuk seluruh card */
                .product-carousel a {
                    text-decoration: none !important;
                    color: inherit !important;
                }
                
                .product-carousel a:hover,
                .product-carousel a:focus,
                .product-carousel a:active,
                .product-carousel a:visited {
                    text-decoration: none !important;
                    color: inherit !important;
                }
                
                /* Modern focus states untuk seluruh card */
                .product-carousel a:focus-visible {
                    outline: 2px solid #C0A080 !important;
                    outline-offset: 2px !important;
                    border-radius: 12px !important;
                }
                
                /* Line clamp utility untuk modern text truncation */
                .line-clamp-2 {
                    display: -webkit-box !important;
                    -webkit-line-clamp: 2 !important;
                    -webkit-box-orient: vertical !important;
                    overflow: hidden !important;
                    text-overflow: ellipsis !important;
                    line-height: 1.2 !important;
                }
                
                /* Hide navigation pada mobile */
                @media (max-width: 640px) {
                    .swiper-button-next, .swiper-button-prev {
                        display: none !important;
                    }
                }
                
                .product-carousel .swiper-slide {
                    transition: all 0.3s ease !important;
                    height: auto !important;
                }
                
                .product-carousel .swiper-wrapper {
                    align-items: stretch !important;
                }
                
                /* Memastikan tidak ada overflow yang mengganggu */
                .product-carousel .swiper {
                    overflow: visible !important;
                    padding: 0 24px !important;
                }
                
                .product-carousel .swiper-wrapper {
                    align-items: stretch !important;
                    transition-timing-function: cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
                }
                
                .product-carousel .swiper-slide {
                    transition: all 0.3s ease !important;
                    height: 320px !important;
                    display: flex !important;
                    flex-direction: column !important;
                }
                
                /* Smooth autoplay transition */
                .product-carousel.swiper-autoplay .swiper-wrapper {
                    transition-duration: 800ms !important;
                }
                
                @media (max-width: 640px) {
                    .product-carousel .swiper {
                        padding: 0 8px !important;
                    }
                }
                `}
            </style>

            {/* Background decoration dengan palet warna custom */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#FAFAFA]/30 via-transparent to-[#F5F5F5]/20 rounded-2xl pointer-events-none" style={{ zIndex: 0 }} />
            
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="relative"
                style={{ zIndex: 1 }}
            >
                <Swiper
                    // Modul yang akan kita gunakan
                    modules={[Navigation, Pagination, Autoplay]}
                    
                    // Pengaturan untuk tampilan slide
                    spaceBetween={20}
                    slidesPerView={2}
                    loop={duplicatedProducts.length >= 4}
                    loopAdditionalSlides={2}
                    centeredSlides={false}
                    
                    // Pengaturan Autoplay yang diperbaiki
                    autoplay={{
                        delay: 3500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                        waitForTransition: true,
                        stopOnLastSlide: false,
                        reverseDirection: false,
                    }}

                    // Pengaturan transisi yang lebih smooth
                    speed={800}
                    effect={'slide'}
                    grabCursor={true}
                    touchRatio={1}
                    touchAngle={45}
                    
                    // Mengaktifkan tombol navigasi
                    navigation={true}

                    // Mengaktifkan pagination
                    pagination={{
                        clickable: true,
                        dynamicBullets: true,
                        dynamicMainBullets: 3,
                    }}

                    // Responsive breakpoints dengan ukuran yang lebih kecil
                    breakpoints={{
                        320: {
                            slidesPerView: 2,
                            spaceBetween: 14,
                        },
                        480: {
                            slidesPerView: 2.5,
                            spaceBetween: 16,
                        },
                        640: {
                            slidesPerView: 3,
                            spaceBetween: 18,
                        },
                        768: {
                            slidesPerView: 3.5,
                            spaceBetween: 20,
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 22,
                        },
                        1280: {
                            slidesPerView: 5,
                            spaceBetween: 24,
                        }
                    }}

                    // Event handlers untuk memastikan autoplay berjalan dengan baik
                    onSlideChange={(swiper) => {
                        // Memastikan autoplay tetap aktif setelah slide change
                        if (swiper.autoplay && !swiper.autoplay.running) {
                            swiper.autoplay.start();
                        }
                    }}
                    
                    onInit={(swiper) => {
                        // Memastikan autoplay dimulai saat swiper di-init
                        if (swiper.autoplay) {
                            swiper.autoplay.start();
                        }
                    }}

                    className="product-carousel"
                >
                    {duplicatedProducts.map((product, index) => (
                        <SwiperSlide key={`${product.id}-${index}`} className="!h-auto">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ 
                                    duration: 0.4, 
                                    delay: (index % 6) * 0.05,
                                    ease: "easeOut" 
                                }}
                                className="h-full w-full"
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </motion.div>
        </section>
    );
};

export default ProductCarousel;