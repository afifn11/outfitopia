import React, { useState } from 'react';
import api from '../services/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const ReviewModal = ({ product, onClose, onReviewSubmitted }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (rating === 0) {
            setError('Rating tidak boleh kosong.');
            return;
        }
        setError('');
        try {
            await api.post(`/reviews/product/${product.product_id}`, { rating, comment });
            
            MySwal.fire({
                title: 'Terima Kasih!',
                text: 'Ulasan Anda telah berhasil dikirim.',
                icon: 'success',
                timer: 2000,
                showConfirmButton: false
            });

            if(onReviewSubmitted) onReviewSubmitted();
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || 'Gagal mengirim ulasan.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4">Beri Ulasan untuk</h2>
                <p className="mb-4 font-semibold">{product.productName}</p>
                
                <form onSubmit={handleSubmit}>
                    {error && <p className="text-red-500 mb-4">{error}</p>}
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Rating Anda:</label>
                        <select value={rating} onChange={e => setRating(Number(e.target.value))} required className="w-full p-2 border rounded">
                            <option value="0" disabled>Pilih Rating...</option>
                            <option value="1">1 - Sangat Buruk</option>
                            <option value="2">2 - Buruk</option>
                            <option value="3">3 - Cukup</option>
                            <option value="4">4 - Baik</option>
                            <option value="5">5 - Sangat Baik</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label className="block mb-1 font-medium">Komentar (opsional):</label>
                        <textarea value={comment} onChange={e => setComment(e.target.value)} rows="4" className="w-full p-2 border rounded" placeholder="Bagaimana pengalaman Anda dengan produk ini?"></textarea>
                    </div>
                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">Batal</button>
                        <button type="submit" className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900">Kirim Ulasan</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ReviewModal;