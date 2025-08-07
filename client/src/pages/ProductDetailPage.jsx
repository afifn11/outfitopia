// client/src/pages/ProductDetailPage.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import styled from 'styled-components';

// Styled-component untuk tombol dengan state
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
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/${id}`);
        setProduct(response.data);
        if (response.data.sizes && response.data.sizes.length > 0) {
          setSelectedSize(response.data.sizes[0]);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart({ ...product, selectedSize });
    alert(`${product.name} (${selectedSize}) telah ditambahkan ke keranjang!`);
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
          <p className="text-2xl text-gray-800 my-4">Rp {product.price.toLocaleString('id-ID')}</p>
          <p className="text-gray-600 mb-6">{product.description}</p>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Pilih Ukuran:</h3>
            <div className="flex gap-2">
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

          <AddToCartButton onClick={handleAddToCart}>
            Tambah ke Keranjang
          </AddToCartButton>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;