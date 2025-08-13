/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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


// Komponen reusable untuk tombol-tombol pagination
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5;
        const halfPagesToShow = Math.floor(maxPagesToShow / 2);

        if (totalPages <= maxPagesToShow) {
            for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
        } else if (currentPage <= halfPagesToShow) {
            for (let i = 1; i <= maxPagesToShow; i++) pageNumbers.push(i);
            pageNumbers.push('...');
            pageNumbers.push(totalPages);
        } else if (currentPage + halfPagesToShow >= totalPages) {
            pageNumbers.push(1);
            pageNumbers.push('...');
            for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) pageNumbers.push(i);
        } else {
            pageNumbers.push(1);
            pageNumbers.push('...');
            for (let i = currentPage - halfPagesToShow; i <= currentPage + halfPagesToShow; i++) pageNumbers.push(i);
            pageNumbers.push('...');
            pageNumbers.push(totalPages);
        }
        return pageNumbers;
    };

    return (
        <nav className="flex justify-center mt-12" aria-label="Page navigation">
            <ul className="flex items-center -space-x-px h-10 text-base">
                <li>
                    <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                        <span className="sr-only">Previous</span>&laquo;
                    </button>
                </li>
                {getPageNumbers().map((number, index) => (
                    <li key={index}>
                        {number === '...' ? (
                            <span className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300">...</span>
                        ) : (
                            <button onClick={() => onPageChange(number)} className={`flex items-center justify-center px-4 h-10 leading-tight border ${currentPage === number ? 'z-10 text-blue-600 bg-blue-50 border-blue-300' : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100'}`}>
                                {number}
                            </button>
                        )}
                    </li>
                ))}
                <li>
                    <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                        <span className="sr-only">Next</span>&raquo;
                    </button>
                </li>
            </ul>
        </nav>
    );
};


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

    // Efek ini hanya berjalan saat komponen dimuat atau URL berubah
    // Tujuannya adalah menyinkronkan state dengan URL
    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        setFilters({
            currentPage: parseInt(queryParams.get('page')) || 1,
            searchTerm: queryParams.get('search') || '',
            sortBy: queryParams.get('sort') || 'name-asc'
        });
    }, [location.search]);

    // Efek ini berjalan saat state `filters` berubah, dan akan memanggil API
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
        }, 300); // Debounce untuk mencegah pemanggilan API berlebihan saat mengetik

        return () => clearTimeout(handler);
    }, [filters]);

    // Fungsi untuk memperbarui URL, yang akan memicu `useEffect` di atas
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
            updateURL({ ...filters, currentPage: page });
        }
    };


    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Semua Produk</h1>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8 p-4 bg-white rounded-lg shadow-sm">
                <input
                    type="text"
                    placeholder="Cari berdasarkan nama produk..."
                    value={filters.searchTerm}
                    onChange={handleSearchChange}
                    className="w-full sm:flex-grow p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                />
                <select
                    value={filters.sortBy}
                    onChange={handleSortChange}
                    className="w-full sm:w-auto p-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                >
                    <option value="name-asc">Urutkan: Nama (A-Z)</option>
                    <option value="name-desc">Urutkan: Nama (Z-A)</option>
                    <option value="price-asc">Urutkan: Harga (Terendah)</option>
                    <option value="price-desc">Urutkan: Harga (Tertinggi)</option>
                </select>
            </div>

            {loading ? (
                <div className="text-center mt-10">Memuat produk...</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.length > 0 ? products.map((product) => (
                            <div key={product.id} className="border rounded-lg shadow-lg overflow-hidden group bg-white">
                                <Link to={`/product/${product.id}`}>
                                    <div className="overflow-hidden">
                                        <img 
                                            src={product.image} 
                                            alt={product.name} 
                                            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" 
                                        />
                                    </div>
                                    <div className="p-4">
                                        <h2 className="text-lg font-semibold truncate text-gray-800">{product.name}</h2>
                                        <p className="text-gray-700 mt-2 font-medium">{formatPrice(product.price)}</p>
                                    </div>
                                </Link>
                            </div>
                        )) : (
                            <p className="col-span-full text-center text-gray-500 mt-10">Produk yang Anda cari tidak ditemukan.</p>
                        )}
                    </div>
                    
                    <Pagination
                        currentPage={filters.currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            )}
        </div>
    );
};

export default AllProductsPage;