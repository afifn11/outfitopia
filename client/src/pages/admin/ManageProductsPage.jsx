import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const ManageProductsPage = () => {
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        try {
            // Menggunakan endpoint produk publik, karena admin juga butuh list ini
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Failed to fetch products', error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
            try {
                await api.delete(`/admin/products/${id}`);
                alert('Produk berhasil dihapus');
                fetchProducts(); // Refresh list produk
            } catch (error) {
                alert(error.response?.data?.message || 'Gagal menghapus produk');
            }
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Kelola Produk</h1>
                <Link to="/admin/products/new" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Tambah Produk Baru
                </Link>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md">
                <table className="w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="text-left p-2">Nama Produk</th>
                            <th className="text-left p-2">Harga</th>
                            <th className="text-left p-2">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="border-b">
                                <td className="p-2">{product.name}</td>
                                <td className="p-2">Rp {product.price.toLocaleString('id-ID')}</td>
                                <td className="p-2">
                                    <Link to={`/admin/products/edit/${product.id}`} className="text-blue-500 hover:underline mr-4">Edit</Link>
                                    <button onClick={() => handleDelete(product.id)} className="text-red-500 hover:underline">Hapus</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManageProductsPage;