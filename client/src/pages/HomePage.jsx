/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCarousel from '../components/ProductCarousel';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Shirt, Zap, Sparkles, TrendingUp } from 'lucide-react';

const HomePage = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [bestsellers, setBestsellers] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomepageData = async () => {
            setLoading(true);
            try {
                const [featuredRes, bestsellersRes, categoriesRes] = await Promise.all([
                    api.get('/products/featured'),
                    api.get('/products/bestsellers'),
                    api.get('/categories')
                ]);
                setFeaturedProducts(featuredRes.data);
                setBestsellers(bestsellersRes.data);
                setCategories(categoriesRes.data);
            } catch (error) {
                console.error('Failed to fetch homepage data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchHomepageData();
    }, []);
    
    const SkeletonLoader = () => (
        <div className="container mx-auto p-4 sm:p-6 animate-pulse">
            <div className="h-80 bg-[#FAFAFA] rounded-2xl mb-12"></div>
            <div className="text-center mb-8">
                <div className="h-8 bg-[#FAFAFA] rounded-lg w-1/3 mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-28 bg-[#FAFAFA] rounded-xl"></div>
                ))}
            </div>
            <div className="text-center mb-8">
                <div className="h-8 bg-[#FAFAFA] rounded-lg w-1/4 mx-auto"></div>
            </div>
            <div className="flex space-x-4 overflow-hidden">
                <div className="w-48 h-72 bg-[#FAFAFA] rounded-xl flex-shrink-0"></div>
                <div className="w-48 h-72 bg-[#FAFAFA] rounded-xl flex-shrink-0 hidden sm:block"></div>
                <div className="w-48 h-72 bg-[#FAFAFA] rounded-xl flex-shrink-0 hidden lg:block"></div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFFFFF]">
                <SkeletonLoader />
            </div>
        );
    }

    const categoryIcons = {
        "Kaos Pria": <Shirt size={28} className="text-[#8A8A8A] group-hover:text-[#C0A080] transition-colors duration-300" />,
        "Dress Wanita": <ShoppingBag size={28} className="text-[#8A8A8A] group-hover:text-[#C0A080] transition-colors duration-300" />,
        "Hoodie & Sweater": <Zap size={28} className="text-[#8A8A8A] group-hover:text-[#C0A080] transition-colors duration-300" />,
        "Celana Pria": <Zap size={28} className="text-[#8A8A8A] group-hover:text-[#C0A080] transition-colors duration-300" />,
    };

    return (
        <div className="min-h-screen bg-[#FFFFFF]">
            <div className="container mx-auto p-4 sm:p-6">
                {/* Hero Section */}
                <motion.section 
                    className="relative bg-white text-[#333333] py-20 px-8 rounded-3xl mb-20 overflow-hidden text-center shadow-sm border border-[#F0F0F0]"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-[#FAFAFA] via-transparent to-[#F5F5F5]"></div>
                    <motion.div 
                        className="relative z-10 max-w-4xl mx-auto"
                        initial={{ opacity: 0 }} 
                        animate={{ opacity: 1 }} 
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <motion.h1 
                            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight text-[#333333]"
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 0.6, delay: 0.4 }}
                        >
                            Style in Simplicity
                        </motion.h1>
                        <motion.p 
                            className="max-w-2xl mx-auto mb-8 text-base sm:text-lg text-[#666666] leading-relaxed"
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 0.6, delay: 0.5 }}
                        >
                            Temukan pakaian esensial yang memadukan kenyamanan dan desain modern untuk gaya sehari-hari Anda.
                        </motion.p>
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 0.6, delay: 0.6 }}
                        >
                            <Link to="/products">
                                <motion.button 
                                    className="group relative bg-[#C0A080] text-white font-semibold py-4 px-8 rounded-full inline-flex items-center overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300"
                                    whileHover={{ scale: 1.05, y: -2 }} 
                                    whileTap={{ scale: 0.95 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                >
                                    <span className="relative z-10 flex items-center text-base sm:text-lg">
                                        Belanja Sekarang
                                        <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform duration-300" />
                                    </span>
                                </motion.button>
                            </Link>
                        </motion.div>
                    </motion.div>
                </motion.section>

                {/* Categories Section */}
                <motion.section 
                    className="mb-20"
                    initial={{ opacity: 0 }} 
                    whileInView={{ opacity: 1 }} 
                    viewport={{ once: true, amount: 0.3 }} 
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-[#333333] mb-4">
                            Jelajahi Kategori
                        </h2>
                        <div className="w-20 h-1 bg-[#C0A080] mx-auto rounded-full"></div>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                        {categories.map((category, index) => (
                            <motion.div 
                                key={category.id} 
                                initial={{ opacity: 0, y: 30 }} 
                                whileInView={{ opacity: 1, y: 0 }} 
                                viewport={{ once: true }} 
                                transition={{ duration: 0.5, delay: 0.1 * index }}
                            >
                                <Link to={`/category/${category.name.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-')}`} className="group block">
                                    <motion.div 
                                        className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-[#F0F0F0] text-center relative overflow-hidden hover:border-[#C0A080]/30 transition-all duration-300"
                                        whileHover={{ y: -6, scale: 1.02 }} 
                                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-br from-[#FAFAFA] to-[#F5F5F5] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                        <div className="relative z-10">
                                            <motion.div 
                                                className="flex justify-center mb-4" 
                                                whileHover={{ rotate: [0, -5, 5, 0] }} 
                                                transition={{ duration: 0.6 }}
                                            >
                                                {categoryIcons[category.name] || <ShoppingBag size={28} className="text-[#8A8A8A] group-hover:text-[#C0A080] transition-colors" />}
                                            </motion.div>
                                            <p className="font-semibold text-[#555555] group-hover:text-[#333333] transition-colors text-sm sm:text-base">
                                                {category.name}
                                            </p>
                                        </div>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </div>
                </motion.section>

                {/* Product Carousels */}
                <ProductCarousel 
                    title={
                        <span className="flex items-center justify-center gap-3">
                            <Sparkles className="w-7 h-7 text-[#C0A080]" />
                            <span className="text-[#333333]">Produk Unggulan</span>
                        </span>
                    } 
                    products={featuredProducts} 
                />
                
                <ProductCarousel 
                    title={
                        <span className="flex items-center justify-center gap-3">
                            <TrendingUp className="w-7 h-7 text-[#C0A080]" />
                            <span className="text-[#333333]">Paling Laris</span>
                        </span>
                    } 
                    products={bestsellers} 
                />
            </div>
        </div>
    );
};

export default HomePage;