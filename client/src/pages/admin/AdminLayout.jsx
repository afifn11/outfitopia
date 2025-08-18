import React, { useState, Fragment } from 'react';
import { NavLink, Outlet, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Dialog, Transition } from '@headlessui/react';
import { 
    Menu, X, Package, ShoppingCart, MessageSquare, LayoutDashboard, LogOut
} from 'lucide-react';

const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const { user, logout } = useAuth();
    const location = useLocation();

    const getPageTitle = () => {
        const path = location.pathname;
        if (path.includes('/products/edit')) return 'Edit Produk';
        if (path.includes('/products/new')) return 'Tambah Produk Baru';
        const currentLink = navigation.find(link => path === link.href);
        return currentLink ? currentLink.name : 'Dashboard';
    };

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
        { name: 'Kelola Produk', href: '/admin/products', icon: Package },
        { name: 'Kelola Pesanan', href: '/admin/orders', icon: ShoppingCart },
        { name: 'Kelola Ulasan', href: '/admin/reviews', icon: MessageSquare }
    ];

    const SidebarContent = () => (
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-slate-900 px-6 pb-4">
            <Link to="/" className="flex h-16 shrink-0 items-center text-white">
                <h1 className="text-xl font-bold">Outfitopia</h1>
            </Link>
            <nav className="flex flex-1 flex-col">
                <ul role="list" className="flex flex-1 flex-col gap-y-7">
                    <li>
                        <ul role="list" className="-mx-2 space-y-2">
                            {navigation.map((item) => (
                                <li key={item.name}>
                                    <NavLink
                                        to={item.href}
                                        end={item.exact}
                                        onClick={() => setIsSidebarOpen(false)}
                                        className={({ isActive }) =>
                                            `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${
                                                isActive
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                                                : 'text-slate-300 hover:text-white hover:bg-slate-800'
                                            }`
                                        }
                                    >
                                        <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                                        {item.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </li>
                    <li className="mt-auto -mx-2">
                        <div className="p-4 border-t border-slate-700">
                             <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-white">{user?.name.charAt(0).toUpperCase()}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{user?.name}</p>
                                        <p className="text-xs text-slate-400">Administrator</p>
                                    </div>
                                </div>
                                <button onClick={logout} title="Logout" className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
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
            {/* Mobile Sidebar */}
            <Transition.Root show={isSidebarOpen} as={Fragment}>
                <Dialog as="div" className="relative z-50 lg:hidden" onClose={setIsSidebarOpen}>
                    <Transition.Child as={Fragment} enter="transition-opacity ease-linear duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="transition-opacity ease-linear duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
                        <div className="fixed inset-0 bg-slate-900/80" />
                    </Transition.Child>
                    <div className="fixed inset-0 flex">
                        <Transition.Child as={Fragment} enter="transition ease-in-out duration-300 transform" enterFrom="-translate-x-full" enterTo="translate-x-0" leave="transition ease-in-out duration-300 transform" leaveFrom="translate-x-0" leaveTo="-translate-x-full">
                            <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                                <Transition.Child as={Fragment} enter="ease-in-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in-out duration-300" leaveFrom="opacity-100" leaveTo="opacity-0">
                                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                                        <button type="button" className="-m-2.5 p-2.5" onClick={() => setIsSidebarOpen(false)}>
                                            <X className="h-6 w-6 text-white" />
                                        </button>
                                    </div>
                                </Transition.Child>
                                <SidebarContent />
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </Dialog>
            </Transition.Root>

            {/* Static Sidebar for desktop */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
                <SidebarContent />
            </div>
            
            {/* Main content area */}
            <div className="lg:pl-72">
                <header className="flex h-16 shrink-0 items-center gap-x-4 border-b border-slate-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8 sticky top-0 z-40">
                    <button type="button" className="-m-2.5 p-2.5 text-gray-700 lg:hidden" onClick={() => setIsSidebarOpen(true)}>
                        <Menu className="h-6 w-6" />
                    </button>
                    <div className="h-6 w-px bg-gray-900/10 lg:hidden" aria-hidden="true" />
                    <div className="flex flex-1 items-center justify-between">
                        <h1 className="text-lg font-semibold text-slate-900">{getPageTitle()}</h1>
                    </div>
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