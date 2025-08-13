import React from 'react';
import { Link } from 'react-router-dom';

// Fungsi helper untuk memformat harga
const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
};

const ProductCarousel = ({ title, products }) => {
    if (!products || products.length === 0) {
        return null; // Jangan tampilkan apa-apa jika tidak ada produk
    }

    return (
        <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <div className="flex overflow-x-auto space-x-6 pb-4">
                {products.map(product => (
                    <div key={product.id} className="flex-shrink-0 w-64 border rounded-lg shadow-lg overflow-hidden group bg-white">
                        <Link to={`/product/${product.id}`}>
                            <div className="overflow-hidden">
                                <img 
                                    src={product.image} 
                                    alt={product.name} 
                                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300" 
                                />
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold truncate text-gray-800">{product.name}</h3>
                                {/* --- PERBAIKAN FORMAT HARGA DI SINI --- */}
                                <p className="text-gray-700 mt-2 font-medium">{formatPrice(product.price)}</p>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ProductCarousel;