import React, { useState, Fragment } from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Dialog, Transition } from '@headlessui/react';
import { Menu, X, Package, ShoppingCart, MessageSquare, LayoutDashboard, LogOut, Sparkles, ExternalLink } from 'lucide-react';

const NAV_ITEMS = [
    { name: 'Dashboard',      href: '/admin',          icon: LayoutDashboard, exact: true },
    { name: 'Kelola Produk',  href: '/admin/products', icon: Package },
    { name: 'Kelola Pesanan', href: '/admin/orders',   icon: ShoppingCart },
    { name: 'Kelola Ulasan',  href: '/admin/reviews',  icon: MessageSquare },
];

const AdminLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();

    const getTitle = () => {
        const path = location.pathname;
        if (path.includes('/products/edit')) return 'Edit Produk';
        if (path.includes('/products/new'))  return 'Tambah Produk';
        return NAV_ITEMS.find(n => path === n.href)?.name || 'Dashboard';
    };

    const Sidebar = () => (
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-900 px-6 pb-4">
            <div className="flex h-16 items-center justify-between">
                <Link to="/" className="text-white font-semibold text-lg tracking-wider flex items-center gap-2">
                    Outfitopia
                </Link>
                <Link to="/" className="text-slate-400 hover:text-white transition-colors" title="Lihat toko">
                    <ExternalLink size={15} />
                </Link>
            </div>

            <nav className="flex flex-1 flex-col">
                <ul className="flex flex-1 flex-col gap-y-7">
                    <li>
                        <ul className="-mx-2 space-y-1">
                            {NAV_ITEMS.map(item => (
                                <li key={item.name}>
                                    <NavLink to={item.href} end={item.exact}
                                        onClick={() => setSidebarOpen(false)}
                                        className={({ isActive }) =>
                                            `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-150 ${
                                                isActive
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                            }`
                                        }>
                                        <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                                        {item.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </li>

                    {/* AI badge */}
                    <li>
                        <div className="bg-slate-800 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles size={14} className="text-purple-400" />
                                <span className="text-xs font-medium text-purple-400 uppercase tracking-wide">AI Powered</span>
                            </div>
                            <p className="text-xs text-slate-400 leading-relaxed">
                                Dashboard dilengkapi AI Business Insights dengan Gemini 2.0 Flash
                            </p>
                        </div>
                    </li>

                    <li className="mt-auto -mx-2">
                        <div className="p-4 border-t border-slate-700">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-white">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{user?.name}</p>
                                        <p className="text-xs text-slate-400">Administrator</p>
                                    </div>
                                </div>
                                <button onClick={logout} title="Logout"
                                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </div>
                    </li>
                </ul>
            </nav>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-100">
            {/* Mobile sidebar */}
            <Transition.Root show={sidebarOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50 lg:hidden" onClose={setSidebarOpen}>
                    <Transition.Child as={Fragment} enter="transition-opacity ease-linear duration-200" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-linear duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-slate-900/80" />
                    </Transition.Child>
                    <div className="fixed inset-0 flex">
                        <Transition.Child as={Fragment} enter="transition ease-in-out duration-200 transform" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="transition ease-in-out duration-200 transform" leaveFrom="translate-x-0" leaveTo="-translate-x-full">
                            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                    <button type="button" className="-m-2.5 p-2.5" onClick={() => setSidebarOpen(false)}>
                                        <X className="h-6 w-6 text-white" />
                                    </button>
                                </div>
                                <Sidebar />
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                <Sidebar />
            </div>

            {/* Main content */}
            <div className="lg:pl-72">
                <header className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-slate-200 bg-white px-4 shadow-sm sm:px-6 lg:px-8">
                    <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setSidebarOpen(true)}>
                        <Menu className="h-6 w-6" />
                    </button>
                    <div className="h-6 w-px bg-gray-900/10 lg:hidden" />
                    <h1 className="text-lg font-semibold text-slate-900 flex-1">{getTitle()}</h1>
                </header>
                <main className="p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
