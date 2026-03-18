import React, { useState } from 'react';
import api from '../services/api';
import { X } from 'lucide-react';

const Star = ({ filled, onClick }) => (
  <button type="button" onClick={onClick} className="text-[#0a0a0a] hover:scale-110 transition-transform">
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  </button>
);

const ReviewModal = ({ productId, productName, onClose, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) { setError('Please select a rating.'); return; }
    setLoading(true);
    try {
      await api.post(`/reviews/${productId}`, { rating, comment });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '400px', background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div className="bg-white w-full max-w-sm p-8 relative">
        <button onClick={onClose} className="absolute top-5 right-5 text-[#a0a0a0] hover:text-[#0a0a0a] transition-colors">
          <X size={16} strokeWidth={1.5} />
        </button>
        <h2 className="label-sm text-[#0a0a0a] mb-1">Write a review</h2>
        <p className="text-[12px] text-[#6b6b6b] mb-6">{productName}</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block label-sm text-[#6b6b6b] mb-3">Rating</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(s => <Star key={s} filled={s <= rating} onClick={() => setRating(s)} />)}
            </div>
          </div>
          <div>
            <label className="block label-sm text-[#6b6b6b] mb-2">Comment (optional)</label>
            <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3}
              className="input-minimal resize-none" placeholder="Share your thoughts..." />
          </div>
          {error && <p className="text-[12px] text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="btn-black w-full justify-center">
            {loading ? <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : 'Submit review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;
