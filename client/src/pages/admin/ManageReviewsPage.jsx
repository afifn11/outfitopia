import React, { useState, useEffect } from 'react';
import { Star, Trash2, Search, MessageSquare, RefreshCw } from 'lucide-react';
import api from '../../services/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const StarRating = ({ rating }) => (
    <div className="flex items-center gap-0.5">
        {[1,2,3,4,5].map(s => (
            <Star key={s} className={`w-3.5 h-3.5 ${s <= rating ? 'text-yellow-400 fill-current' : 'text-slate-200 fill-current'}`} />
        ))}
    </div>
);

const ManageReviewsPage = () => {
    const [reviews, setReviews]   = useState([]);
    const [loading, setLoading]   = useState(true);
    const [search, setSearch]     = useState('');
    const [ratingFilter, setRatingFilter] = useState('all');

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/reviews');
            setReviews(res.data || []);
        } catch {
            MySwal.fire({ title: 'Gagal!', text: 'Gagal memuat ulasan.', icon: 'error', confirmButtonColor: '#6366f1' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchReviews(); }, []);

    const handleDelete = async (id) => {
        const result = await MySwal.fire({
            title: 'Hapus ulasan?',
            text: 'Tindakan ini tidak dapat dibatalkan.',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ya, hapus',
            cancelButtonText: 'Batal',
            confirmButtonColor: '#ef4444',
            cancelButtonColor: '#6b7280',
        });
        if (!result.isConfirmed) return;
        try {
            await api.delete(`/admin/reviews/${id}`);
            setReviews(prev => prev.filter(r => r.id !== id));
            MySwal.fire({ title: 'Dihapus!', icon: 'success', timer: 1500, showConfirmButton: false });
        } catch {
            MySwal.fire({ title: 'Gagal!', text: 'Gagal menghapus ulasan.', icon: 'error', confirmButtonColor: '#6366f1' });
        }
    };

    const avgRating = reviews.length
        ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
        : '0.0';

    const filtered = reviews.filter(r => {
        const matchSearch = search === '' ||
            r.productName?.toLowerCase().includes(search.toLowerCase()) ||
            r.userName?.toLowerCase().includes(search.toLowerCase()) ||
            r.comment?.toLowerCase().includes(search.toLowerCase());
        const matchRating = ratingFilter === 'all' || r.rating === Number(ratingFilter);
        return matchSearch && matchRating;
    });

    return (
        <div className="space-y-6">
            {/* Refresh button row */}
            <div className="flex justify-end">
                <button onClick={fetchReviews} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors" title="Refresh">
                    <RefreshCw className="w-4 h-4" />
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                    { label: 'Total Ulasan', value: reviews.length },
                    { label: 'Rating Rata-rata', value: avgRating },
                    { label: 'Bintang 5', value: reviews.filter(r => r.rating === 5).length },
                    { label: 'Bintang ≤ 2', value: reviews.filter(r => r.rating <= 2).length },
                ].map(({ label, value }) => (
                    <div key={label} className="bg-white rounded-xl border border-slate-200 p-5">
                        <p className="text-sm text-slate-500 mb-1">{label}</p>
                        <p className="text-2xl font-bold text-slate-900">{value}</p>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 flex flex-wrap gap-4 items-center">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input value={search} onChange={e => setSearch(e.target.value)}
                        placeholder="Cari produk atau pengguna..."
                        className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {[
                        { key:'all', label:'Semua' },
                        { key:'5', label:'★ 5' },
                        { key:'4', label:'★ 4' },
                        { key:'3', label:'★ 3' },
                        { key:'2', label:'★ ≤2' },
                    ].map(f => (
                        <button key={f.key} onClick={() => setRatingFilter(f.key === '2' ? f.key : f.key)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                                ratingFilter === f.key
                                    ? 'bg-indigo-600 text-white'
                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                            }`}>
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Reviews grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1,2,3,4,5,6].map(i => (
                        <div key={i} className="bg-white rounded-xl border border-slate-200 p-5 animate-pulse">
                            <div className="h-4 bg-slate-200 rounded w-3/4 mb-3" />
                            <div className="h-3 bg-slate-200 rounded w-1/2 mb-4" />
                            <div className="h-12 bg-slate-200 rounded" />
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-white rounded-xl border border-slate-200 py-20 text-center">
                    <MessageSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-medium">Tidak ada ulasan</p>
                    <p className="text-slate-400 text-sm mt-1">Coba ubah filter atau kata kunci pencarian</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(review => (
                        <div key={review.id} className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-shadow flex flex-col">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-900 text-sm truncate">{review.productName}</p>
                                    <p className="text-xs text-slate-500 mt-0.5">{review.userName}</p>
                                </div>
                                <button onClick={() => handleDelete(review.id)}
                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors ml-2 flex-shrink-0">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            <StarRating rating={review.rating} />

                            <p className="text-sm text-slate-600 mt-3 line-clamp-3 flex-1 italic">
                                "{review.comment || 'Tidak ada komentar.'}"
                            </p>

                            <p className="text-xs text-slate-400 mt-3 pt-3 border-t border-slate-100">
                                {review.created_at
                                    ? new Date(review.created_at).toLocaleDateString('id-ID', { day:'numeric', month:'short', year:'numeric' })
                                    : '-'}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageReviewsPage;
