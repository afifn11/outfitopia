import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import ProductCarousel from '../components/ProductCarousel';

const AllProductsPage = () => {

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Semua Produk</h1>
        </div>
    );
};


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
    
    if (loading) {
        return <div className="text-center mt-20">Memuat etalase toko...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <section className="bg-gray-800 text-white p-12 rounded-lg mb-12 text-center">
                <h1 className="text-4xl font-extrabold mb-4">Koleksi Fashion Terbaru</h1>
                <p className="mb-6">Temukan gaya terbaikmu dengan koleksi pilihan kami.</p>
                <Link to="/products" className="bg-white text-gray-800 font-bold py-2 px-6 rounded hover:bg-gray-200">
                    Lihat Semua Produk
                </Link>
            </section>

            <section className="mb-12">
                <h2 className="text-2xl font-bold mb-4">Belanja Berdasarkan Kategori</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map(category => (
                        <Link key={category.id} to={`/category/${category.name.toLowerCase()}`} className="bg-white p-6 rounded-lg shadow-md text-center font-semibold text-gray-700 hover:bg-gray-100 hover:shadow-lg transition">
                            {category.name}
                        </Link>
                    ))}
                </div>
            </section>

            <ProductCarousel title="Produk Unggulan" products={featuredProducts} />
            <ProductCarousel title="Produk Terlaris" products={bestsellers} />
        </div>
    );
};

export default HomePage;