import React, { useState, useEffect, useCallback } from 'react';
import { formatPrice } from '../../utils/format';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, Search, Package, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../../services/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);


// Komponen Pagination
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];
        let l;

        range.push(1);
        for (let i = currentPage - delta; i <= currentPage + delta; i++) {
            if (i < totalPages && i > 1) {
                range.push(i);
            }
        }
        range.push(totalPages);

        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
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
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                                currentPage === page
                                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25'
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
    <tr className="animate-pulse">
        <td className="px-6 py-4"><div className="h-12 w-12 bg-slate-200 rounded-md"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-3/4"></div></td>
        <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-1/2"></div></td>
        <td className="px-6 py-4">
            <div className="flex justify-end space-x-2">
                <div className="h-8 bg-slate-200 rounded-lg w-16"></div>
                <div className="h-8 bg-slate-200 rounded-lg w-16"></div>
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

    const location = useLocation();
    const navigate = useNavigate();

    const fetchProducts = useCallback(async (page, search) => {
        setLoading(true);
        try {
            const response = await api.get('/products', {
                params: {
                    page: page,
                    limit: 10,
                    search: search,
                }
            });
            setProducts(response.data.products);
            setTotalPages(response.data.totalPages);
            setCurrentPage(response.data.currentPage);
        } catch (error) {
            console.error('Failed to fetch products', error);
            MySwal.fire('Error', 'Gagal memuat data produk.', 'error');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const page = parseInt(queryParams.get('page')) || 1;
        const search = queryParams.get('search') || '';
        setSearchTerm(search);
        fetchProducts(page, search);
    }, [location.search, fetchProducts]);

    useEffect(() => {
        const handler = setTimeout(() => {
            const queryParams = new URLSearchParams(location.search);
            if (searchTerm !== (queryParams.get('search') || '')) {
                queryParams.set('search', searchTerm);
                queryParams.set('page', 1);
                if (!searchTerm) {
                    queryParams.delete('search');
                }
                navigate(`${location.pathname}?${queryParams.toString()}`);
            }
        }, 500);
        return () => clearTimeout(handler);
    }, [searchTerm, navigate, location.search, location.pathname]);

    const handleDelete = (id, productName) => {
        MySwal.fire({
            title: 'Apakah Anda Yakin?',
            html: `Produk "<b>${productName}</b>" akan dihapus secara permanen!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/admin/products/${id}`);
                    MySwal.fire('Dihapus!', 'Produk telah berhasil dihapus.', 'success');
                    fetchProducts(currentPage, searchTerm);
                } catch (error) {
                    MySwal.fire('Gagal!', error.response?.data?.message || 'Gagal menghapus produk.', 'error');
                }
            }
        });
    };
    
    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            const queryParams = new URLSearchParams(location.search);
            queryParams.set('page', page);
            navigate(`${location.pathname}?${queryParams.toString()}`);
        }
    };

    return (
        <div className="space-y-6">
            {/* Action bar */}
            <div className="flex justify-end">
                <Link
                    to="/admin/products/new"
                    className="inline-flex items-center justify-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-600/25"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Tambah Produk Baru
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Cari produk berdasarkan nama..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    />
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Gambar</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Nama Produk</th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">Harga</th>
                                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-900">Aksi</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, index) => <ProductSkeleton key={index} />)
                            ) : products.length > 0 ? (
                                products.map(product => (
                                    <tr key={product.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <img src={product.image} alt={product.name} className="h-12 w-12 rounded-md object-cover"/>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-slate-900 max-w-sm truncate">{product.name}</td>
                                        <td className="px-6 py-4 font-medium text-slate-700">{formatPrice(product.price)}</td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end space-x-2">
                                                <Link 
                                                    to={`/admin/products/edit/${product.id}`}
                                                    className="inline-flex items-center px-3 py-1.5 bg-indigo-50 text-indigo-600 text-sm font-medium rounded-lg hover:bg-indigo-100 transition-colors"
                                                >
                                                    <Edit className="w-4 h-4 mr-1.5" />
                                                    Edit
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(product.id, product.name)}
                                                    className="inline-flex items-center px-3 py-1.5 bg-red-50 text-red-600 text-sm font-medium rounded-lg hover:bg-red-100 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-1.5" />
                                                    Hapus
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-12 text-center">
                                        <div className="text-slate-400">
                                            <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p className="text-lg font-medium">Tidak Ada Produk Ditemukan</p>
                                            <p className="text-sm mt-1">
                                                {searchTerm ? 'Coba ubah kata kunci pencarian Anda.' : 'Mulai dengan menambahkan produk pertama Anda.'}
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                
                {!loading && products.length > 0 && (
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