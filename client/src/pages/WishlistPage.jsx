// client/src/pages/WishlistPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { formatPrice } from '../utils/format';
import { Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import Swal from 'sweetalert2';

const WishlistPage = () => {
    const [items, setItems]     = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart }         = useCart();

    const fetchWishlist = () => {
        api.get('/wishlist')
            .then(r => setItems(r.data))
            .catch(console.error)
            .finally(() => setLoading(false));
    };

    useEffect(() => { fetchWishlist(); }, []);

    const handleRemove = async (productId, name) => {
        try {
            await api.delete(`/wishlist/${productId}`);
            setItems(prev => prev.filter(i => i.productId !== productId));
            Swal.fire({ title: `"${name}" dihapus dari wishlist`, icon: 'success', timer: 1200, showConfirmButton: false });
        } catch {
            Swal.fire({ title: 'Gagal menghapus', icon: 'error', timer: 1500, showConfirmButton: false });
        }
    };

    const handleAddToCart = (item) => {
        const sizes = item.sizes ? item.sizes.split(',') : ['ONE SIZE'];
        const size  = sizes.length === 1 ? sizes[0] : null;

        if (!size) {
            Swal.fire({
                title: 'Pilih ukuran',
                text: 'Buka halaman produk untuk memilih ukuran.',
                icon: 'info',
                confirmButtonText: 'Lihat Produk',
                confirmButtonColor: '#0a0a0a',
            }).then(r => { if (r.isConfirmed) window.location.href = `/product/${item.productId}`; });
            return;
        }

        addToCart({ ...item, id: item.productId, selectedSize: size }, 1);
        Swal.fire({ title: 'Ditambahkan ke keranjang!', icon: 'success', timer: 1200, showConfirmButton: false });
    };

    if (loading) return (
        <div className="max-w-4xl mx-auto px-6 py-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1,2,3,4].map(i => (
                    <div key={i} className="bg-[#f4f4f4] animate-pulse">
                        <div className="aspect-[3/4]" />
                        <div className="p-3 space-y-2">
                            <div className="h-3 bg-[#e8e8e8] rounded w-3/4" />
                            <div className="h-3 bg-[#e8e8e8] rounded w-1/2" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="page-enter max-w-4xl mx-auto px-6 py-10">
            <div className="flex items-baseline justify-between mb-8">
                <div>
                    <h1 className="label-sm text-[#0a0a0a] mb-1">Wishlist</h1>
                    <p className="text-[12px] text-[#a0a0a0]">{items.length} item tersimpan</p>
                </div>
                <Link to="/products" className="btn-ghost-dark">Lanjut belanja →</Link>
            </div>

            {items.length === 0 ? (
                <div className="py-24 text-center border border-[#e8e8e8]">
                    <Heart size={36} className="text-[#d0d0d0] mx-auto mb-4" strokeWidth={1} />
                    <p className="text-[12px] tracking-wide uppercase text-[#a0a0a0] mb-5">Wishlist masih kosong</p>
                    <Link to="/products" className="btn-black">Jelajahi produk →</Link>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-[#e8e8e8]">
                    {items.map(item => (
                        <div key={item.productId} className="bg-white group relative">
                            {/* Remove button */}
                            <button
                                onClick={() => handleRemove(item.productId, item.name)}
                                className="absolute top-3 right-3 z-10 w-7 h-7 bg-white border border-[#e8e8e8] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:border-red-300 hover:text-red-500"
                            >
                                <Trash2 size={12} strokeWidth={1.5} />
                            </button>

                            {/* Product image */}
                            <Link to={`/product/${item.productId}`}>
                                <div className="aspect-[3/4] bg-[#f4f4f4] overflow-hidden">
                                    <img src={item.image} alt={item.name}
                                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" />
                                </div>
                            </Link>

                            {/* Info */}
                            <div className="px-3.5 pt-3 pb-4">
                                <Link to={`/product/${item.productId}`}>
                                    <p className="text-[13px] text-[#0a0a0a] mb-0.5 leading-tight hover:underline underline-offset-2 line-clamp-1">{item.name}</p>
                                </Link>
                                <p className="text-[13px] text-[#6b6b6b] mb-3">{formatPrice(item.price)}</p>
                                <button
                                    onClick={() => handleAddToCart(item)}
                                    className="w-full flex items-center justify-center gap-2 bg-[#0a0a0a] text-white text-[10px] tracking-[0.1em] uppercase py-2.5 hover:opacity-80 transition-opacity"
                                >
                                    <ShoppingBag size={12} strokeWidth={1.5} />
                                    Add to bag
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default WishlistPage;
