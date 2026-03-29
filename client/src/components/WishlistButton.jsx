// client/src/components/WishlistButton.jsx
// Reusable button untuk tambah/hapus wishlist di product card/detail
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const WishlistButton = ({ productId, size = 16, className = '' }) => {
    const { user } = useAuth();
    const [inWishlist, setInWishlist] = useState(false);
    const [loading, setLoading]       = useState(false);

    useEffect(() => {
        if (!user || !productId) return;
        api.get(`/wishlist/check/${productId}`)
            .then(r => setInWishlist(r.data.inWishlist))
            .catch(() => {});
    }, [user, productId]);

    const toggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            window.location.href = '/login';
            return;
        }
        setLoading(true);
        try {
            if (inWishlist) {
                await api.delete(`/wishlist/${productId}`);
                setInWishlist(false);
            } else {
                await api.post(`/wishlist/${productId}`);
                setInWishlist(true);
            }
        } catch (err) {
            console.error('[Wishlist] toggle error:', err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={toggle}
            disabled={loading}
            title={inWishlist ? 'Hapus dari wishlist' : 'Simpan ke wishlist'}
            className={`flex items-center justify-center transition-all duration-150 disabled:opacity-50 ${className}`}
        >
            <Heart
                size={size}
                strokeWidth={1.5}
                className={`transition-all duration-150 ${inWishlist ? 'fill-[#0a0a0a] text-[#0a0a0a]' : 'text-[#a0a0a0] hover:text-[#0a0a0a]'}`}
            />
        </button>
    );
};

export default WishlistButton;
