import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { Search, User, ShoppingBag, X, Heart } from 'lucide-react';

const NAV_LINKS = [
    { label: 'New In', to: '/' },
    { label: 'Women',  to: '/category/Dresses' },
    { label: 'Men',    to: '/category/Shirts' },
    { label: 'All',    to: '/products' },
];

const Navbar = () => {
    const { pathname } = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { cartItems } = useCart();
    const [searchOpen, setSearchOpen]   = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const totalQty = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchOpen(false);
            setSearchQuery('');
        }
        if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery(''); }
    };

    return (
        <>
            <div className="bg-[#0a0a0a] text-white text-center py-2 text-[10px] tracking-[0.15em] uppercase">
                Free shipping on orders above Rp 500,000
            </div>

            <nav className="sticky top-0 z-50 bg-white border-b border-[#e8e8e8]">
                <div className="flex items-center justify-between px-6 h-14">
                    {/* Logo */}
                    <Link to="/" className="text-[13px] font-semibold tracking-[0.18em] uppercase text-[#0a0a0a]">
                        Outfitopia
                    </Link>

                    {/* Center nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {NAV_LINKS.map(({ label, to }) => (
                            <Link key={to} to={to}
                                className={`text-[11px] tracking-wide uppercase pb-0.5 border-b transition-all duration-150 ${
                                    pathname === to
                                        ? 'text-[#0a0a0a] border-[#0a0a0a]'
                                        : 'text-[#6b6b6b] border-transparent hover:text-[#0a0a0a] hover:border-[#0a0a0a]'
                                }`}>
                                {label}
                            </Link>
                        ))}
                    </div>

                    {/* Right icons */}
                    <div className="flex items-center gap-5">
                        {/* Search */}
                        <button onClick={() => setSearchOpen(!searchOpen)}
                            className="text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors">
                            <Search size={17} strokeWidth={1.5} />
                        </button>

                        {/* User dropdown */}
                        <div className="relative">
                            <button onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors">
                                <User size={17} strokeWidth={1.5} />
                            </button>
                            {dropdownOpen && (
                                <div className="absolute right-0 top-full mt-2 w-44 bg-white border border-[#e8e8e8] py-1 z-50 shadow-sm"
                                    onMouseLeave={() => setDropdownOpen(false)}>
                                    {user ? (
                                        <>
                                            <div className="px-4 py-2.5 border-b border-[#e8e8e8]">
                                                <p className="text-[11px] font-medium text-[#0a0a0a] truncate">{user.name}</p>
                                            </div>
                                            <Link to="/profile" onClick={() => setDropdownOpen(false)}
                                                className="block px-4 py-2.5 text-[11px] tracking-wide uppercase text-[#6b6b6b] hover:text-[#0a0a0a] hover:bg-[#fafafa]">
                                                My account
                                            </Link>
                                            <Link to="/wishlist" onClick={() => setDropdownOpen(false)}
                                                className="block px-4 py-2.5 text-[11px] tracking-wide uppercase text-[#6b6b6b] hover:text-[#0a0a0a] hover:bg-[#fafafa]">
                                                Wishlist
                                            </Link>
                                            {user.role === 'admin' && (
                                                <Link to="/admin" onClick={() => setDropdownOpen(false)}
                                                    className="block px-4 py-2.5 text-[11px] tracking-wide uppercase text-[#6b6b6b] hover:text-[#0a0a0a] hover:bg-[#fafafa]">
                                                    Admin panel
                                                </Link>
                                            )}
                                            <div className="h-px bg-[#e8e8e8] my-1" />
                                            <button onClick={() => { logout(); setDropdownOpen(false); }}
                                                className="block w-full text-left px-4 py-2.5 text-[11px] tracking-wide uppercase text-[#6b6b6b] hover:text-[#0a0a0a] hover:bg-[#fafafa]">
                                                Sign out
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <Link to="/login" onClick={() => setDropdownOpen(false)}
                                                className="block px-4 py-2.5 text-[11px] tracking-wide uppercase text-[#6b6b6b] hover:text-[#0a0a0a] hover:bg-[#fafafa]">
                                                Sign in
                                            </Link>
                                            <Link to="/register" onClick={() => setDropdownOpen(false)}
                                                className="block px-4 py-2.5 text-[11px] tracking-wide uppercase text-[#6b6b6b] hover:text-[#0a0a0a] hover:bg-[#fafafa]">
                                                Create account
                                            </Link>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Wishlist — only when logged in */}
                        {user && (
                            <Link to="/wishlist" className="text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors">
                                <Heart size={17} strokeWidth={1.5} />
                            </Link>
                        )}

                        {/* Cart */}
                        <Link to="/cart" className="relative text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors">
                            <ShoppingBag size={17} strokeWidth={1.5} />
                            {totalQty > 0 && (
                                <span className="absolute -top-2 -right-2 bg-[#0a0a0a] text-white text-[9px] font-semibold w-4 h-4 rounded-full flex items-center justify-center">
                                    {totalQty > 9 ? '9+' : totalQty}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* Search panel */}
                {searchOpen && (
                    <div className="border-t border-[#e8e8e8] px-6 py-4 bg-white">
                        <div className="max-w-xl mx-auto flex items-center gap-4">
                            <Search size={15} strokeWidth={1.5} className="text-[#a0a0a0] flex-shrink-0" />
                            <input autoFocus type="text" value={searchQuery}
                                onChange={e => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                                placeholder="Search products..."
                                className="flex-1 bg-transparent outline-none text-sm placeholder:text-[#a0a0a0]" />
                            <button onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                                className="text-[#a0a0a0] hover:text-[#0a0a0a] transition-colors">
                                <X size={15} />
                            </button>
                        </div>
                    </div>
                )}
            </nav>
        </>
    );
};

export default Navbar;
