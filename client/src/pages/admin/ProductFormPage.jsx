/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Image, Tag, Star, DollarSign, Package, FileText } from 'lucide-react';
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
                MySwal.fire({
                    title: 'Error',
                    text: 'Gagal memuat data yang diperlukan.',
                    icon: 'error',
                    confirmButtonColor: '#6366f1'
                });
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
            MySwal.fire({
                title: 'Berhasil!',
                text: `Produk telah berhasil ${isEditMode ? 'diperbarui' : 'ditambahkan'}.`,
                icon: 'success',
                confirmButtonColor: '#6366f1'
            }).then(() => navigate('/admin/products'));
        } catch (err) {
            MySwal.fire({
                title: 'Gagal!',
                text: 'Terjadi kesalahan saat menyimpan produk.',
                icon: 'error',
                confirmButtonColor: '#6366f1'
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600"></div>
                    <span className="text-slate-600">Memuat formulir...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => navigate('/admin/products')}
                            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">
                                {isEditMode ? 'Edit Produk' : 'Tambah Produk Baru'}
                            </h1>
                            <p className="text-slate-600 mt-1">
                                {isEditMode ? 'Perbarui informasi produk' : 'Tambahkan produk baru ke katalog'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <form onSubmit={handleSubmit} className="divide-y divide-slate-200">
                    {/* Basic Information */}
                    <div className="p-6 space-y-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-2 bg-indigo-100 rounded-lg">
                                <Package className="w-5 h-5 text-indigo-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-slate-900">Informasi Dasar</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <label htmlFor="name" className="flex items-center text-sm font-medium text-slate-700 mb-2">
                                    <Tag className="w-4 h-4 mr-2" />
                                    Nama Produk
                                </label>
                                <input 
                                    type="text" 
                                    id="name" 
                                    name="name" 
                                    value={product.name} 
                                    onChange={handleChange} 
                                    required 
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                    placeholder="Masukkan nama produk..."
                                />
                            </div>

                            <div>
                                <label htmlFor="price" className="flex items-center text-sm font-medium text-slate-700 mb-2">
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    Harga (Rp)
                                </label>
                                <input 
                                    type="number" 
                                    id="price" 
                                    name="price" 
                                    value={product.price} 
                                    onChange={handleChange} 
                                    required 
                                    min="0"
                                    step="1000"
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                    placeholder="0"
                                />
                            </div>

                            <div>
                                <label htmlFor="sizes" className="flex items-center text-sm font-medium text-slate-700 mb-2">
                                    <Package className="w-4 h-4 mr-2" />
                                    Ukuran
                                </label>
                                <input 
                                    type="text" 
                                    id="sizes" 
                                    name="sizes" 
                                    value={product.sizes} 
                                    onChange={handleChange} 
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                    placeholder="Contoh: S, M, L, XL"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="description" className="flex items-center text-sm font-medium text-slate-700 mb-2">
                                    <FileText className="w-4 h-4 mr-2" />
                                    Deskripsi
                                </label>
                                <textarea 
                                    id="description" 
                                    name="description" 
                                    value={product.description} 
                                    onChange={handleChange} 
                                    required 
                                    rows="4" 
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none"
                                    placeholder="Masukkan deskripsi produk..."
                                />
                            </div>

                            <div className="md:col-span-2">
                                <label htmlFor="image" className="flex items-center text-sm font-medium text-slate-700 mb-2">
                                    <Image className="w-4 h-4 mr-2" />
                                    URL Gambar
                                </label>
                                <input 
                                    type="text" 
                                    id="image" 
                                    name="image" 
                                    value={product.image} 
                                    onChange={handleChange} 
                                    required 
                                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                                    placeholder="https://example.com/image.jpg"
                                />
                                {product.image && (
                                    <div className="mt-3">
                                        <p className="text-sm text-slate-600 mb-2">Preview:</p>
                                        <img 
                                            src={product.image} 
                                            alt="Preview" 
                                            className="w-32 h-32 object-cover rounded-lg border border-slate-200"
                                            onError={(e) => {
                                                e.target.style.display = 'none';
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="p-6 space-y-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <Tag className="w-5 h-5 text-green-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-slate-900">Kategori</h2>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {allCategories.map(cat => (
                                <label key={cat.id} className="relative flex items-center p-4 border border-slate-200 rounded-lg cursor-pointer hover:border-indigo-300 hover:bg-indigo-50 transition-colors">
                                    <input 
                                        type="checkbox"
                                        className="sr-only"
                                        checked={product.category_ids.includes(cat.id)}
                                        onChange={() => handleCategoryChange(cat.id)}
                                    />
                                    <div className={`flex items-center space-x-3 ${
                                        product.category_ids.includes(cat.id) 
                                            ? 'text-indigo-600' 
                                            : 'text-slate-700'
                                    }`}>
                                        <div className={`w-4 h-4 border-2 rounded flex items-center justify-center ${
                                            product.category_ids.includes(cat.id)
                                                ? 'bg-indigo-600 border-indigo-600'
                                                : 'border-slate-300'
                                        }`}>
                                            {product.category_ids.includes(cat.id) && (
                                                <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="text-sm font-medium">{cat.name}</span>
                                    </div>
                                    {product.category_ids.includes(cat.id) && (
                                        <div className="absolute inset-0 border-2 border-indigo-500 rounded-lg pointer-events-none"></div>
                                    )}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Featured Product */}
                    <div className="p-6 space-y-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="p-2 bg-yellow-100 rounded-lg">
                                <Star className="w-5 h-5 text-yellow-600" />
                            </div>
                            <h2 className="text-lg font-semibold text-slate-900">Pengaturan Khusus</h2>
                        </div>

                        <div className="flex items-center space-x-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <input 
                                type="checkbox"
                                id="is_featured"
                                name="is_featured"
                                className="w-4 h-4 text-yellow-600 bg-gray-100 border-gray-300 rounded focus:ring-yellow-500 focus:ring-2"
                                checked={product.is_featured}
                                onChange={handleChange}
                            />
                            <label htmlFor="is_featured" className="flex items-center cursor-pointer">
                                <Star className="w-5 h-5 text-yellow-600 mr-2" />
                                <div>
                                    <span className="text-sm font-medium text-slate-900">Jadikan Produk Unggulan</span>
                                    <p className="text-xs text-slate-600">Produk unggulan akan ditampilkan di halaman utama</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <div className="p-6 bg-slate-50">
                        <div className="flex items-center justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/products')}
                                className="px-6 py-3 text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors font-medium"
                            >
                                Batal
                            </button>
                            <button 
                                type="submit" 
                                disabled={isSubmitting} 
                                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 disabled:bg-indigo-400 disabled:cursor-not-allowed transition-colors shadow-lg shadow-indigo-600/25"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Menyimpan...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        {isEditMode ? 'Perbarui Produk' : 'Simpan Produk'}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductFormPage;