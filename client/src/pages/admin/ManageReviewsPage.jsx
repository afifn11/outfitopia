import React, { useState, useEffect } from 'react';
import { Star, MessageSquare, User, Package, Trash2, Search } from 'lucide-react';
import api from '../../services/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

// Star Rating Component
const StarRating = ({ rating }) => {
    return (
        <div className="flex items-center space-x-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <Star
                    key={star}
                    className={`w-4 h-4 ${
                        star <= rating ? 'text-yellow-400 fill-current' : 'text-slate-300'
                    }`}
                />
            ))}
            <span className="ml-2 text-sm font-medium text-slate-700">{rating}</span>
        </div>
    );
};

// Review skeleton loader
const ReviewSkeleton = () => (
    <tr className="border-b border-slate-100 animate-pulse">
        <td className="px-6 py-4">
            <div className="h-4 bg-slate-200 rounded w-32"></div>
        </td>
        <td className="px-6 py-4">
            <div className="h-4 bg-slate-200 rounded w-24"></div>
        </td>
        <td className="px-6 py-4">
            <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="w-4 h-4 bg-slate-200 rounded"></div>
                ))}
            </div>
        </td>
        <td className="px-6 py-4">
            <div className="h-4 bg-slate-200 rounded w-48"></div>
        </td>
        <td className="px-6 py-4">
            <div className="h-8 bg-slate-200 rounded w-16"></div>
        </td>
    </tr>
);

const ManageReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [ratingFilter, setRatingFilter] = useState('all');

    const fetchReviews = async () => {
        try {
            const response = await api.get('/admin/reviews');
            setReviews(response.data);
        } catch (error) {
            console.error('Failed to fetch reviews', error);
            MySwal.fire({
                title: 'Gagal!',
                text: 'Gagal memuat data ulasan.',
                icon: 'error',
                confirmButtonColor: '#6366f1'
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDelete = (reviewId, productName) => {
        MySwal.fire({
            title: 'Hapus Ulasan Ini?',
            text: `Ulasan untuk produk "${productName}" akan dihapus secara permanen!`,
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
                    await api.delete(`/admin/reviews/${reviewId}`);
                    setReviews(prevReviews => prevReviews.filter(r => r.id !== reviewId));
                    MySwal.fire({
                        title: 'Dihapus!',
                        text: 'Ulasan telah berhasil dihapus.',
                        icon: 'success',
                        confirmButtonColor: '#6366f1'
                    });
                } catch (error) {
                    MySwal.fire({
                        title: 'Gagal!',
                        text: error.response?.data?.message || 'Gagal menghapus ulasan.',
                        icon: 'error',
                        confirmButtonColor: '#6366f1'
                    });
                }
            }
        });
    };

    const filteredReviews = reviews.filter(review => {
        const matchesSearch = review.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             review.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             review.comment.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesRating = ratingFilter === 'all' || review.rating === parseInt(ratingFilter);
        
        return matchesSearch && matchesRating;
    });

    const reviewStats = {
        total: reviews.length,
        averageRating: reviews.length > 0 ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1) : 0,
        fiveStar: reviews.filter(r => r.rating === 5).length,
        fourStar: reviews.filter(r => r.rating === 4).length,
        threeStar: reviews.filter(r => r.rating === 3).length,
        twoStar: reviews.filter(r => r.rating === 2).length,
        oneStar: reviews.filter(r => r.rating === 1).length,
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Kelola Ulasan</h1>
                    <p className="text-slate-600 mt-1">Pantau dan kelola semua ulasan dari pelanggan</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-indigo-100 rounded-lg">
                            <MessageSquare className="w-5 h-5 text-indigo-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-slate-600">Total Ulasan</p>
                            <p className="text-2xl font-bold text-slate-900">{reviewStats.total}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-yellow-100 rounded-lg">
                            <Star className="w-5 h-5 text-yellow-600 fill-current" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-slate-600">Rating Rata-rata</p>
                            <p className="text-2xl font-bold text-slate-900">{reviewStats.averageRating}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <Star className="w-5 h-5 text-green-600 fill-current" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-slate-600">5 Bintang</p>
                            <p className="text-2xl font-bold text-green-600">{reviewStats.fiveStar}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                    <div className="flex items-center">
                        <div className="p-2 bg-red-100 rounded-lg">
                            <Star className="w-5 h-5 text-red-600" />
                        </div>
                        <div className="ml-3">
                            <p className="text-sm font-medium text-slate-600">1 Bintang</p>
                            <p className="text-2xl font-bold text-red-600">{reviewStats.oneStar}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Cari ulasan berdasarkan produk, pengguna, atau komentar..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                    </div>
                    
                    <div className="flex space-x-2">
                        <select
                            value={ratingFilter}
                            onChange={(e) => setRatingFilter(e.target.value)}
                            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        >
                            <option value="all">Semua Rating</option>
                            <option value="5">5 Bintang</option>
                            <option value="4">4 Bintang</option>
                            <option value="3">3 Bintang</option>
                            <option value="2">2 Bintang</option>
                            <option value="1">1 Bintang</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Reviews Table */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                                    <div className="flex items-center">
                                        <Package className="w-4 h-4 mr-2" />
                                        Produk
                                    </div>
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                                    <div className="flex items-center">
                                        <User className="w-4 h-4 mr-2" />
                                        Pengguna
                                    </div>
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                                    <div className="flex items-center">
                                        <Star className="w-4 h-4 mr-2" />
                                        Rating
                                    </div>
                                </th>
                                <th className="text-left px-6 py-4 text-sm font-semibold text-slate-900">
                                    Komentar
                                </th>
                                <th className="text-right px-6 py-4 text-sm font-semibold text-slate-900">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                Array.from({ length: 5 }).map((_, index) => (
                                    <ReviewSkeleton key={index} />
                                ))
                            ) : filteredReviews.length > 0 ? (
                                filteredReviews.map(review => (
                                    <tr key={review.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-slate-900 max-w-xs truncate">
                                                {review.productName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-slate-600">
                                                {review.userName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <StarRating rating={review.rating} />
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="max-w-md">
                                                <p className="text-sm text-slate-700 italic line-clamp-2">
                                                    "{review.comment}"
                                                </p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end">
                                                <button 
                                                    onClick={() => handleDelete(review.id, review.productName)}
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
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="text-slate-400">
                                            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                                            <p className="text-lg font-medium">
                                                {searchTerm || ratingFilter !== 'all' 
                                                    ? 'Tidak ditemukan ulasan yang sesuai' 
                                                    : 'Belum ada ulasan dari pelanggan'
                                                }
                                            </p>
                                            <p className="text-sm mt-1">
                                                {searchTerm || ratingFilter !== 'all'
                                                    ? 'Coba ubah kriteria pencarian atau filter.'
                                                    : 'Ulasan akan muncul di sini ketika pelanggan memberikan feedback.'
                                                }
                                            </p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ManageReviewsPage;