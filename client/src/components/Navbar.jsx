// /client/src/components/Navbar.jsx (Versi penyempurnaan UI)

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const CartBadge = styled.span`
  position: absolute; top: -8px; right: -12px; background-color: #ef4444; color: white;
  border-radius: 50%; padding: 2px 6px; font-size: 0.75rem; font-weight: bold;
`;

const Navbar = () => {
    const { cartItems } = useCart();
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-gray-800">TokoBaju</Link>
                <div className="flex items-center gap-6">
                    {isAuthenticated ? (
                        <>
                            <span className="text-gray-600">Halo, {user?.name}</span>
                            {/* Tampilkan link yang berbeda berdasarkan role */}
                            {user?.role === 'admin' ? (
                                <Link to="/admin" className="font-bold text-blue-600 hover:text-blue-800">Dashboard Admin</Link>
                            ) : (
                                <Link to="/profile" className="text-gray-600 hover:text-gray-800">Profil Saya</Link>
                            )}
                            <button onClick={handleLogout} className="text-gray-600 hover:text-gray-800">Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-600 hover:text-gray-800">Login</Link>
                            <Link to="/register" className="text-gray-600 hover:text-gray-800">Register</Link>
                        </>
                    )}

                    {/* Hanya tampilkan keranjang jika user adalah bukan admin atau belum login */}
                    {(!user || user?.role !== 'admin') && (
                        <div className="relative">
                            <Link to="/cart" className="text-gray-600 hover:text-gray-800">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {totalItems > 0 && <CartBadge>{totalItems}</CartBadge>}
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;