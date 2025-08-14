import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// Fungsi helper untuk memformat harga
const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
};

// Komponen Pagination yang lebih modern
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    
    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];
        
        for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
            range.push(i);
        }
        
        if (currentPage - delta > 2) {
            rangeWithDots.push(1, '...');
        } else {
            rangeWithDots.push(1);
        }
        
        rangeWithDots.push(...range);
        
        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push('...', totalPages);
        } else if (totalPages > 1) {
            rangeWithDots.push(totalPages);
        }
        
        return rangeWithDots;
    };

    return (
        <div className="flex items-center justify-center space-x-1 mt-8">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronLeft className="w-4 h-4" />
            </button>
            
            {getVisiblePages().map((page, index) => (
                <React.Fragment key={index}>
                    {page === '...' ? (
                        <span className="px-3 py-2 text-slate-400">...</span>
                    ) : (
                        <button
                            onClick={() => onPageChange(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                currentPage === page
                                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                                    : 'text-slate-700 bg-white border border-slate-300 hover:bg-slate-50'
                            }`}
                        >
                            {page}
                        </button>
                    )}
                </React.Fragment>
            ))}
            
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-slate-500 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
};

// Komponen Loading Skeleton
const ProductSkeleton = () => (
    <tr className="border-b border-slate-100 animate-pulse">
        <td className="px-6 py-4">
            <div className="h-4 bg-slate-200 rounded w-3/4"></div>
        </td>
        <td className="px-6 py-4">
            <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </td>
        <td className="px-6 py-4">
            <div className="flex space-x-2">
                <div className="h-8 bg-slate-200 rounded w-12"></div>
                <div className="h-8 bg-slate-200 rounded w-12"></div>
            </div>
        </td>
    </tr>
);

const ManageProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');
    const [showFilters, setShowFilters] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const fetchProducts = useCallback(async (page) => {
        setLoading(true);
        try {
            const response = await api.get('/products', {
                params: {
                    page: page,
                    limit: 10
                }
            });
            setProducts(response.data.products);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
        } catch (error) {
            console.error('Failed to fetch products', error);
            MySwal.fire({
                title: 'Error',
                text: 'Gagal memuat data produk.',
                icon: 'error',
                confirmButtonColor: '#6366f1'
            });
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const page = parseInt(queryParams.get('page')) || 1;
        fetchProducts(page);
    }, [location.search, fetchProducts]);

    const handleDelete = (id, productName) => {
        MySwal.fire({
            title: 'Apakah Anda Yakin?',
            text: `Produk "${productName}" akan dihapus secara permanen!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
            background: '#ffffff',
            backdrop: 'rgba(0,0,0,0.4)'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/admin/products/${id}`);
                    MySwal.fire({
                        title: 'Dihapus!',
                        text: 'Produk telah berhasil dihapus.',
                        icon: 'success',
                        confirmButtonColor: '#6366f1'
                    });
                    fetchProducts(currentPage);
                } catch (error) {
                    MySwal.fire({
                        title: 'Gagal!',
                        text: error.response?.data?.message || 'Gagal menghapus produk.',
                        icon: 'error',
                        confirmButtonColor: '#6366f1'
                    });
                }
            }
        });
    };
    
    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            navigate(`/admin/products?page=${page}`);
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">Kelola Produk</h1>
                        <p className="text-slate-600 mt-1">Kelola semua produk dalam toko Anda</p>
                    </div>
                    <Link 
                        to="/admin/products/new" 
                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/25"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Produk Baru
                    </Link>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Cari produk..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="inline-flex items-center px-4 py-2 text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                        <Filter className="w-4 h-4 mr-2" />
                        Filter
                    </button>
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                                    Nama Produk
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                                    Harga
                                </th>
                                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-900">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <ProductSkeleton key={index} />
                                ))
                            ) : filteredProducts.length > 0 ? (
                                filteredProducts.map(product => (
                                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900">
                                                {product.name}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="font-medium text-slate-900">
                                                {formatPrice(product.price)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link 
                                                    to={`/admin/products/edit/${product.id}`}
                                                    className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-100 transition-colors"
                                                >
                                                    <Edit className="w-3 h-3 mr-1" />
                                                    Edit
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(product.id, product.name)}
                                                    className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
                                                >
                                                    <Trash2 className="w-3 h-3 mr-1" />
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="px-6 py-12 text-center">
                                        <div className="text-slate-400">
                                            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p className="text-lg font-medium">Tidak ada produk</p>
                                            <p className="text-sm mt-1">
                                                {searchTerm ? 'Tidak ditemukan produk yang sesuai dengan pencarian.' : 'Mulai dengan menambahkan produk pertama Anda.'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {/* Pagination */}
                {!loading && filteredProducts.length > 0 && (
                    <div className="border-t border-slate-200 px-6 py-4">
                        <Pagination 
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageProductsPage;