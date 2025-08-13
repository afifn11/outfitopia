import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import styled from 'styled-components';
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

const AddToCartButton = styled.button`
  background-color: #1f2937; // gray-800
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: bold;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #374151; // gray-700
  }

  &:disabled {
    background-color: #9ca3af; // gray-400
    cursor: not-allowed;
  }
`;

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSize, setSelectedSize] = useState('');
    const { addToCart } = useCart();
    
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProductAndReviews = async () => {
            setLoading(true);
            try {
                const [productRes, reviewsRes] = await Promise.all([
                    api.get(`/products/${id}`),
                    api.get(`/reviews/product/${id}`)
                ]);
                
                setProduct(productRes.data);
                setReviews(reviewsRes.data);

                if (productRes.data.sizes && productRes.data.sizes.length > 0) {
                    setSelectedSize(productRes.data.sizes[0]);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProductAndReviews();
    }, [id]);

    const handleAddToCart = () => {
      if (!selectedSize) {
          MySwal.fire({
            title: 'Oops...',
            text: 'Silakan pilih ukuran terlebih dahulu!',
            icon: 'warning'
          });
          return;
      }
      
      addToCart({ ...product, selectedSize }, quantity);
      
      MySwal.fire({
          title: 'Berhasil!',
          text: `${quantity} pcs ${product.name} telah ditambahkan ke keranjang.`,
          icon: 'success',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
              toast.addEventListener('mouseenter', Swal.stopTimer);
              toast.addEventListener('mouseleave', Swal.resumeTimer);
          }
      });
    };

    if (loading) return <div className="text-center mt-10">Loading detail produk...</div>;
    if (!product) return <div className="text-center mt-10">Produk tidak ditemukan.</div>;

    return (
        <div className="container mx-auto p-6">
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                    <img src={product.image} alt={product.name} className="w-full rounded-lg shadow-lg" />
                </div>
                <div className="md:w-1/2">
                    <h1 className="text-4xl font-bold">{product.name}</h1>
                    <div className="flex items-center my-4">
                        {product.num_reviews > 0 ? (
                            <>
                                <span className="text-yellow-500 font-bold">★ {Number(product.average_rating).toFixed(1)}</span>
                                <span className="text-gray-600 ml-2">({product.num_reviews} ulasan)</span>
                            </>
                        ) : (
                            <span className="text-gray-500">Belum ada ulasan</span>
                        )}
                    </div>
                    
                    {/* ==================================== */}
                    {/* === PERBAIKAN FORMAT HARGA DI SINI === */}
                    {/* ==================================== */}
                    <p className="text-2xl text-gray-800 mb-4 font-semibold">{formatPrice(product.price)}</p>

                    <p className="text-gray-600 mb-6">{product.description}</p>
                    <div className="mb-6">
                        <h3 className="font-semibold mb-2">Pilih Ukuran:</h3>
                        <div className="flex gap-2 flex-wrap">
                        {product.sizes.map(size => (
                            <button 
                                key={size} 
                                onClick={() => setSelectedSize(size)}
                                className={`border px-4 py-2 rounded ${selectedSize === size ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'}`}
                            >
                                {size}
                            </button>
                        ))}
                        </div>
                    </div>

                    <div className="mb-6">
                        <h3 className="font-semibold mb-2">Kuantitas:</h3>
                        <div className="flex items-center border rounded-md w-fit">
                            <button 
                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                className="px-4 py-2 text-lg font-bold bg-gray-200 hover:bg-gray-300 rounded-l-md"
                                disabled={quantity <= 1}
                            >
                                -
                            </button>
                            <span className="px-6 py-2 text-lg w-16 text-center">{quantity}</span>
                            <button 
                                onClick={() => setQuantity(prev => prev + 1)}
                                className="px-4 py-2 text-lg font-bold bg-gray-200 hover:bg-gray-300 rounded-r-md"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    <AddToCartButton onClick={handleAddToCart}>
                        Tambah ke Keranjang
                    </AddToCartButton>
                </div>
            </div>

            <div className="mt-12">
                <h2 className="text-2xl font-bold mb-4">Ulasan Produk</h2>
                <div className="space-y-4">
                    {reviews.length > 0 ? reviews.map(review => (
                        <div key={review.id} className="border-b pb-4">
                            <div className="flex items-center mb-1">
                                <p className="font-bold mr-2">{review.userName}</p>
                                <span className="text-yellow-500">★ {review.rating}</span>
                            </div>
                            <p className="text-gray-600">{review.comment}</p>
                            <p className="text-xs text-gray-400 mt-1">{new Date(review.created_at).toLocaleDateString('id-ID')}</p>
                        </div>
                    )) : (
                        <p>Jadilah yang pertama memberi ulasan untuk produk ini.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;