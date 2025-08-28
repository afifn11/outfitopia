// /client/src/components/Navbar.jsx (Enhanced UI Version)

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import styled from 'styled-components';

const CartBadge = styled.span`
  position: absolute; 
  top: -6px; 
  right: -6px; 
  background: #C0A080;
  color: white;
  border-radius: 50%; 
  min-width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem; 
  font-weight: 700;
  border: 2px solid white;
  box-shadow: 0 2px 8px rgba(192, 160, 128, 0.4);
  animation: pulse 2s infinite;

  @keyframes pulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.05); }
  }
`;

const Navbar = () => {
    const { cartItems } = useCart();
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="bg-white/95 backdrop-blur-md shadow-sm border-b border-[#F0F0F0] sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <Link 
                        to="/" 
                        className="text-2xl font-bold text-[#333333] hover:scale-105 transition-transform duration-200"
                        onClick={closeMenu}
                    >
                        Outfitopia.
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-8">
                        {isAuthenticated ? (
                            <>
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-[#C0A080] rounded-full flex items-center justify-center">
                                        <span className="text-white text-sm font-semibold">
                                            {user?.name?.charAt(0)?.toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-[#555555] font-medium">Halo, {user?.name}</span>
                                </div>

                                {user?.role === 'admin' ? (
                                    <Link 
                                        to="/admin" 
                                        className="bg-[#C0A080] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#B09070] transform hover:scale-105 transition-all duration-200 shadow-sm"
                                    >
                                        Dashboard Admin
                                    </Link>
                                ) : (
                                    <Link 
                                        to="/profile" 
                                        className="flex items-center space-x-2 text-[#555555] hover:text-[#C0A080] font-medium transition-colors duration-200"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        <span>Profil Saya</span>
                                    </Link>
                                )}

                                <button 
                                    onClick={handleLogout} 
                                    className="flex items-center space-x-2 text-[#555555] hover:text-[#A05050] font-medium transition-colors duration-200"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    <span>Logout</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link 
                                    to="/login" 
                                    className="text-[#555555] hover:text-[#C0A080] font-medium transition-colors duration-200"
                                >
                                    Login
                                </Link>
                                <Link 
                                    to="/register" 
                                    className="bg-[#C0A080] text-white px-6 py-2 rounded-lg font-semibold hover:bg-[#B09070] transform hover:scale-105 transition-all duration-200 shadow-sm"
                                >
                                    Register
                                </Link>
                            </>
                        )}

                        {/* Cart Icon - Only show if not admin */}
                        {(!user || user?.role !== 'admin') && (
                            <div className="relative p-1">
                                <Link 
                                    to="/cart" 
                                    className="text-[#555555] hover:text-[#C0A080] p-2 hover:bg-[#FAFAFA] rounded-lg transition-all duration-200 block"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {totalItems > 0 && <CartBadge>{totalItems}</CartBadge>}
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-4">
                        {/* Cart Icon for Mobile - Only show if not admin */}
                        {(!user || user?.role !== 'admin') && (
                            <div className="relative">
                                <Link 
                                    to="/cart" 
                                    className="text-[#555555] hover:text-[#C0A080] p-2 block"
                                    onClick={closeMenu}
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {totalItems > 0 && <CartBadge>{totalItems}</CartBadge>}
                                </Link>
                            </div>
                        )}
                        
                        <button
                            onClick={toggleMenu}
                            className="text-[#555555] hover:text-[#333333] p-2"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                {isMenuOpen ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden border-t border-[#F0F0F0] bg-white/95 backdrop-blur-md">
                        <div className="px-4 py-4 space-y-4">
                            {isAuthenticated ? (
                                <>
                                    <div className="flex items-center space-x-3 pb-4 border-b border-[#F0F0F0]">
                                        <div className="w-10 h-10 bg-[#C0A080] rounded-full flex items-center justify-center">
                                            <span className="text-white font-semibold">
                                                {user?.name?.charAt(0)?.toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <p className="text-[#333333] font-medium">{user?.name}</p>
                                            <p className="text-[#666666] text-sm">{user?.email}</p>
                                        </div>
                                    </div>

                                    {user?.role === 'admin' ? (
                                        <Link 
                                            to="/admin" 
                                            className="flex items-center space-x-3 text-[#C0A080] font-semibold py-2"
                                            onClick={closeMenu}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                            </svg>
                                            <span>Dashboard Admin</span>
                                        </Link>
                                    ) : (
                                        <Link 
                                            to="/profile" 
                                            className="flex items-center space-x-3 text-[#555555] hover:text-[#C0A080] py-2"
                                            onClick={closeMenu}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                            <span>Profil Saya</span>
                                        </Link>
                                    )}

                                    <button 
                                        onClick={handleLogout} 
                                        className="flex items-center space-x-3 text-[#A05050] py-2 w-full text-left"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        <span>Logout</span>
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link 
                                        to="/login" 
                                        className="block text-[#555555] hover:text-[#C0A080] py-2 font-medium"
                                        onClick={closeMenu}
                                    >
                                        Login
                                    </Link>
                                    <Link 
                                        to="/register" 
                                        className="block bg-[#C0A080] text-white px-4 py-2 rounded-lg font-semibold text-center hover:bg-[#B09070]"
                                        onClick={closeMenu}
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;