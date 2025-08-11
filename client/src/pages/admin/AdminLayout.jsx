// /client/src/pages/admin/AdminLayout.jsx
import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const AdminLayout = () => {
    const activeLinkStyle = {
        backgroundColor: '#374151',
        color: 'white',
    };

    return (
        <div className="flex">
            <aside className="w-64 bg-gray-800 text-white min-h-screen p-4">
                <nav>
                    <ul>
                        <li className="mb-2">
                            <NavLink to="/admin/products" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="block p-2 rounded hover:bg-gray-700">
                                Kelola Produk
                            </NavLink>
                        </li>
                        <li className="mb-2">
                            <NavLink to="/admin/orders" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="block p-2 rounded hover:bg-gray-700">
                                Kelola Pesanan
                            </NavLink>
                        </li>
                        <li className="mb-2">
                            <NavLink to="/admin/reviews" style={({ isActive }) => isActive ? activeLinkStyle : undefined} className="block p-2 rounded hover:bg-gray-700">
                                Kelola Ulasan
                            </NavLink>
                        </li>
                    </ul>
                </nav>
            </aside>
            <main className="flex-1 p-10">
                <Outlet /> {/* Halaman admin spesifik akan dirender di sini */}
            </main>
        </div>
    );
};

export default AdminLayout;