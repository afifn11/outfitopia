/* eslint-disable no-unused-vars */
// /client/src/pages/admin/ProductFormPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const ProductFormPage = () => {
    const { id } = useParams(); // Ambil 'id' dari URL jika ada
    const navigate = useNavigate();
    const isEditMode = Boolean(id); // Jika ada id, maka ini adalah mode edit

    const [product, setProduct] = useState({
        name: '',
        price: '',
        description: '',
        image: '',
        sizes: '', // Kita akan simpan sebagai string dipisahkan koma di form
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isEditMode) {
            setLoading(true);
            const fetchProduct = async () => {
                try {
                    const response = await api.get(`/products/${id}`);
                    const fetchedProduct = response.data;
                    // Ubah array 'sizes' menjadi string untuk ditampilkan di form
                    setProduct({ ...fetchedProduct, sizes: fetchedProduct.sizes.join(', ') });
                } catch (err) {
                    setError('Gagal memuat data produk.');
                } finally {
                    setLoading(false);
                }
            };
            fetchProduct();
        }
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProduct(prevProduct => ({
            ...prevProduct,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Ubah string 'sizes' kembali menjadi array
        const productData = {
            ...product,
            price: parseFloat(product.price),
            sizes: product.sizes.split(',').map(s => s.trim()).filter(s => s), // Filter string kosong
        };

        try {
            if (isEditMode) {
                await api.put(`/admin/products/${id}`, productData);
                alert('Produk berhasil diperbarui!');
            } else {
                await api.post('/admin/products', productData);
                alert('Produk baru berhasil ditambahkan!');
            }
            navigate('/admin/products');
        } catch (err) {
            setError(err.response?.data?.message || 'Terjadi kesalahan.');
        } finally {
            setLoading(false);
        }
    };

    if (loading && isEditMode) {
        return <p>Loading form...</p>;
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">
                {isEditMode ? 'Edit Produk' : 'Tambah Produk Baru'}
            </h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4">
                {error && <p className="text-red-500 bg-red-100 p-3 rounded">{error}</p>}
                <div>
                    <label htmlFor="name" className="block font-medium mb-1">Nama Produk</label>
                    <input type="text" id="name" name="name" value={product.name} onChange={handleChange} required className="w-full border rounded p-2" />
                </div>
                <div>
                    <label htmlFor="price" className="block font-medium mb-1">Harga</label>
                    <input type="number" id="price" name="price" value={product.price} onChange={handleChange} required className="w-full border rounded p-2" />
                </div>
                <div>
                    <label htmlFor="description" className="block font-medium mb-1">Deskripsi</label>
                    <textarea id="description" name="description" value={product.description} onChange={handleChange} required rows="4" className="w-full border rounded p-2"></textarea>
                </div>
                <div>
                    <label htmlFor="image" className="block font-medium mb-1">URL Gambar</label>
                    <input type="text" id="image" name="image" value={product.image} onChange={handleChange} required className="w-full border rounded p-2" />
                </div>
                <div>
                    <label htmlFor="sizes" className="block font-medium mb-1">Ukuran (pisahkan dengan koma)</label>
                    <input type="text" id="sizes" name="sizes" value={product.sizes} onChange={handleChange} placeholder="Contoh: S, M, L, XL" className="w-full border rounded p-2" />
                </div>
                <div>
                    <button type="submit" disabled={loading} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300">
                        {loading ? 'Menyimpan...' : 'Simpan Produk'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductFormPage;