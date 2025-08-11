import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const ManageReviewsPage = () => {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchReviews = async () => {
        try {
            const response = await api.get('/admin/reviews');
            setReviews(response.data);
        } catch (error) {
            console.error('Failed to fetch reviews', error);
            MySwal.fire('Gagal!', 'Gagal memuat data ulasan.', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDelete = (reviewId) => {
        MySwal.fire({
            title: 'Hapus Ulasan Ini?',
            text: "Tindakan ini bersifat permanen!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            confirmButtonText: 'Ya, Hapus!',
            cancelButtonText: 'Batal'
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await api.delete(`/admin/reviews/${reviewId}`);
                    setReviews(prevReviews => prevReviews.filter(r => r.id !== reviewId));
                    MySwal.fire('Dihapus!', 'Ulasan telah berhasil dihapus.', 'success');
                } catch (error) {
                    MySwal.fire('Gagal!', error.response?.data?.message || 'Gagal menghapus ulasan.', 'error');
                }
            }
        });
    };

    if (loading) return <p>Loading ulasan...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Kelola Ulasan</h1>
            <div className="bg-white p-4 rounded-lg shadow-md overflow-x-auto">
                <table className="w-full min-w-[800px]">
                    <thead className="bg-gray-50">
                        <tr className="border-b">
                            <th className="text-left p-3 font-semibold text-gray-600">Produk</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Pengguna</th>
                            <th className="text-center p-3 font-semibold text-gray-600">Rating</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Komentar</th>
                            <th className="text-left p-3 font-semibold text-gray-600">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.map(review => (
                            <tr key={review.id} className="border-b hover:bg-gray-50">
                                <td className="p-3 font-medium">{review.productName}</td>
                                <td className="p-3 text-sm text-gray-600">{review.userName}</td>
                                <td className="p-3 text-center text-yellow-500 font-bold">★ {review.rating}</td>
                                <td className="p-3 text-sm italic max-w-xs truncate">"{review.comment}"</td>
                                <td className="p-3">
                                    <button 
                                        onClick={() => handleDelete(review.id)} 
                                        className="bg-red-500 text-white px-3 py-1 text-xs font-semibold rounded-md hover:bg-red-600 transition-colors"
                                    >
                                        Hapus
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {reviews.length === 0 && <p className="text-center p-4 text-gray-500">Belum ada ulasan dari pelanggan.</p>}
            </div>
        </div>
    );
};

export default ManageReviewsPage;