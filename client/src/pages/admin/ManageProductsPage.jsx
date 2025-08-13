import React, { useState, useEffect, useCallback } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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

// Komponen Pagination
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
        <nav className="flex justify-center mt-8">
            <ul className="flex items-center -space-x-px h-10 text-base">
                <li>
                    <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1} className="flex items-center justify-center px-4 h-10 ms-0 leading-tight text-gray-500 bg-white border border-e-0 border-gray-300 rounded-s-lg hover:bg-gray-100 disabled:opacity-50">
                        &laquo;
                    </button>
                </li>
                {pageNumbers.map(number => (
                    <li key={number}>
                        <button onClick={() => onPageChange(number)} className={`flex items-center justify-center px-4 h-10 leading-tight border ${currentPage === number ? 'text-blue-600 bg-blue-50 border-blue-300' : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100'}`}>
                            {number}
                        </button>
                    </li>
                ))}
                <li>
                    <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages} className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-e-lg hover:bg-gray-100 disabled:opacity-50">
                        &raquo;
                    </button>
                </li>
            </ul>
        </nav>
    );
};


const ManageProductsPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const location = useLocation();
    const navigate = useNavigate();

    const fetchProducts = useCallback(async (page) => {
        setLoading(true);
        try {
            // Menggunakan endpoint produk publik dengan parameter halaman
            const response = await api.get('/products', {
                params: {
                    page: page,
                    limit: 10 // Tampilkan 10 produk per halaman di tabel admin
                }
            });
            // --- PERBAIKAN UTAMA: Ambil array dari response.data.products ---
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
        fetchProducts(page);
    }, [location.search, fetchProducts]);

    const handleDelete = (id) => {
        MySwal.fire({
            title: 'Apakah Anda Yakin?',
            text: "Produk yang dihapus tidak dapat dikembalikan!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonText: 'Batal',
            confirmButtonText: 'Ya, Hapus Saja!'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/admin/products/${id}`);
                    MySwal.fire('Dihapus!', 'Produk telah berhasil dihapus.', 'success');
                    // Refresh data di halaman saat ini
                    fetchProducts(currentPage);
                } catch (error) {
                    MySwal.fire('Gagal!', error.response?.data?.message || 'Gagal menghapus produk.', 'error');
                }
            }
        });
    };
    
    const handlePageChange = (page) => {
        if (page > 0 && page <= totalPages) {
            navigate(`/admin/products?page=${page}`);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Kelola Produk</h1>
                <Link to="/admin/products/new" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Tambah Produk Baru
                </Link>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b bg-gray-50">
                            <th className="text-left p-3 font-semibold text-gray-600">Nama Produk</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Harga</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="3" className="text-center p-4">Memuat...</td></tr>
                        ) : products.length > 0 ? (
                            products.map(product => (
                                <tr key={product.id} className="border-b hover:bg-gray-50">
                                    <td className="p-3">{product.name}</td>
                                    {/* --- PERBAIKAN FORMAT HARGA DI SINI --- */}
                                    <td className="p-3">{formatPrice(product.price)}</td>
                                    <td className="p-3">
                                        <Link to={`/admin/products/edit/${product.id}`} className="text-blue-500 hover:underline mr-4 font-medium">Edit</Link>
                                        <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:underline font-medium">Hapus</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="3" className="text-center p-4">Tidak ada produk.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
            {/* --- KOMPONEN PAGINATION DITAMPILKAN DI SINI --- */}
            <Pagination 
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </div>
    );
};

export default ManageProductsPage;