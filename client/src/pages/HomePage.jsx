/* eslint-disable no-unused-vars */
// /client/src/pages/HomePage.jsx

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios'; // Kita butuh axios lagi untuk params
import { Link } from 'react-router-dom';
import api from '../services/api'; // Tetap gunakan api untuk base URL

const HomePage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('name'); // 'name' atau 'price'

    // useCallback digunakan agar fungsi fetchProducts tidak dibuat ulang di setiap render,
    // kecuali jika dependency-nya (sortBy, searchTerm) berubah.
    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const params = {
                search: searchTerm,
                sortBy: sortBy.split('-')[0], // 'price-asc' -> 'price'
                order: sortBy.split('-')[1],  // 'price-asc' -> 'asc'
            };
            const response = await api.get('/products', { params });
            setProducts(response.data);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }, [searchTerm, sortBy]);


    useEffect(() => {
        // Debouncing: Tunda pencarian 500ms setelah user berhenti mengetik
        const delayDebounceFn = setTimeout(() => {
            fetchProducts();
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [fetchProducts]);

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Produk Kami</h1>

            {/* Kontrol Pencarian dan Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <input
                    type="text"
                    placeholder="Cari produk..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-1/2 p-2 border rounded-md"
                />
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full sm:w-1/4 p-2 border rounded-md"
                >
                    <option value="name-asc">Nama (A-Z)</option>
                    <option value="name-desc">Nama (Z-A)</option>
                    <option value="price-asc">Harga (Terendah)</option>
                    <option value="price-desc">Harga (Tertinggi)</option>
                </select>
            </div>

            {/* Tampilan Produk */}
            {loading ? (
                <div className="text-center mt-10">Loading produk...</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.length > 0 ? products.map((product) => (
                        <div key={product.id} className="border rounded-lg shadow-lg overflow-hidden group">
                            <Link to={`/product/${product.id}`}>
                                <img src={product.image} alt={product.name} className="w-full h-64 object-cover group-hover:opacity-80 transition-opacity" />
                                <div className="p-4">
                                    <h2 className="text-lg font-semibold truncate">{product.name}</h2>
                                    <p className="text-gray-700 mt-2">Rp {product.price.toLocaleString('id-ID')}</p>
                                </div>
                            </Link>
                        </div>
                    )) : (
                        <p className="col-span-full text-center">Produk tidak ditemukan.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default HomePage;