import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

// Fungsi helper untuk memformat harga agar konsisten di seluruh aplikasi
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

const CategoryPage = () => {
    const { categoryName } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const page = parseInt(queryParams.get('page')) || 1;
        
        const fetchProductsByCategory = async () => {
            setLoading(true);
            try {
                const response = await api.get('/products', {
                    params: { 
                        category: categoryName.replace(/-/g, ' '),
                        page: page,
                        limit: 12
                    }
                });
                setProducts(response.data.products);
                setTotalPages(response.data.totalPages);
                setCurrentPage(response.data.currentPage);
            } catch (error) {
                console.error(`Failed to fetch products for category ${categoryName}`, error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductsByCategory();
    }, [categoryName, location.search]);

    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            navigate(`/category/${categoryName}?page=${page}`);
        }
    };

    if (loading) {
        return <div className="text-center mt-20">Memuat produk untuk kategori '{categoryName.replace(/-/g, ' ')}'...</div>;
    }

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 capitalize">Kategori: {categoryName.replace(/-/g, ' ')}</h1>
            
            {products.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {products.map((product) => (
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
                                        {/* --- PERBAIKAN FORMAT HARGA DITERAPKAN DI SINI --- */}
                                        <p className="text-gray-700 mt-2 font-medium">{formatPrice(product.price)}</p>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </div>
                    <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </>
            ) : (
                <p className="text-center text-gray-500 mt-10">Tidak ada produk dalam kategori ini.</p>
            )}
        </div>
    );
};

export default CategoryPage;