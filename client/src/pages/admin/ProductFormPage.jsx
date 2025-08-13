/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const MySwal = withReactContent(Swal);

const ProductFormPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditMode = Boolean(id);

    const [product, setProduct] = useState({
        name: '',
        price: '',
        description: '',
        image: '',
        sizes: '',
        is_featured: false,
        category_ids: []
    });
    const [allCategories, setAllCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                // Selalu ambil daftar semua kategori
                const categoriesRes = await api.get('/categories');
                setAllCategories(categoriesRes.data);

                // Jika mode edit, ambil juga data produk spesifik
                if (isEditMode) {
                    const productRes = await api.get(`/products/${id}`);
                    const fetchedProduct = productRes.data;
                    
                    setProduct({
                        name: fetchedProduct.name || '',
                        price: fetchedProduct.price || '',
                        description: fetchedProduct.description || '',
                        image: fetchedProduct.image || '',
                        sizes: fetchedProduct.sizes.join(', '),
                        is_featured: fetchedProduct.is_featured === 1, // Konversi 1/0 dari DB ke true/false
                        category_ids: fetchedProduct.categories.map(c => c.id) // Ambil hanya ID dari objek kategori
                    });
                }
            } catch (err) {
                MySwal.fire('Error', 'Gagal memuat data yang diperlukan.', 'error');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, isEditMode]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProduct(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleCategoryChange = (categoryId) => {
        setProduct(prev => {
            const newCategoryIds = prev.category_ids.includes(categoryId)
                ? prev.category_ids.filter(id => id !== categoryId)
                : [...prev.category_ids, categoryId];
            return { ...prev, category_ids: newCategoryIds };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        const productData = {
            ...product,
            price: parseFloat(product.price),
            sizes: product.sizes.split(',').map(s => s.trim()).filter(s => s), // Ubah string kembali jadi array
        };

        try {
            if (isEditMode) {
                await api.put(`/admin/products/${id}`, productData);
            } else {
                await api.post('/admin/products', productData);
            }
            MySwal.fire('Berhasil!', `Produk telah berhasil ${isEditMode ? 'diperbarui' : 'ditambahkan'}.`, 'success')
                .then(() => navigate('/admin/products'));
        } catch (err) {
            MySwal.fire('Gagal!', 'Terjadi kesalahan saat menyimpan produk.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (loading) return <p className="text-center mt-8">Memuat formulir...</p>;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">{isEditMode ? 'Edit Produk' : 'Tambah Produk Baru'}</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-4 max-w-2xl mx-auto">
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
                
                <div className="border-t pt-4">
                    <label className="block font-medium mb-2">Kategori</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 border p-3 rounded-md bg-gray-50">
                        {allCategories.map(cat => (
                            <label key={cat.id} className="flex items-center space-x-2 cursor-pointer">
                                <input 
                                    type="checkbox"
                                    className="rounded text-blue-600 focus:ring-blue-500"
                                    checked={product.category_ids.includes(cat.id)}
                                    onChange={() => handleCategoryChange(cat.id)}
                                />
                                <span>{cat.name}</span>
                            </label>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="flex items-center space-x-2 cursor-pointer">
                        <input 
                            type="checkbox"
                            name="is_featured"
                            className="rounded text-blue-600 focus:ring-blue-500"
                            checked={product.is_featured}
                            onChange={handleChange}
                        />
                        <span className="font-medium">Jadikan Produk Unggulan (Featured)</span>
                    </label>
                </div>
                
                <div className="pt-4">
                    <button type="submit" disabled={isSubmitting} className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-600 disabled:bg-blue-300 transition-colors">
                        {isSubmitting ? 'Menyimpan...' : 'Simpan Produk'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductFormPage;