import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Send } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[#FAFAFA] text-[#555555] border-t border-[#F0F0F0]">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    
                    {/* Kolom Brand & Social Media */}
                    <div className="md:col-span-4 lg:col-span-5">
                        <Link to="/" className="text-3xl font-bold text-[#333333] mb-4 block">Outfitopia.</Link>
                        <p className="text-[#666666] max-w-sm leading-relaxed">
                            Pusat fashion Anda untuk menemukan gaya terbaik yang mengekspresikan diri Anda. Kualitas premium, desain modern.
                        </p>
                        <div className="flex space-x-4 mt-6">
                            <a href="#" className="text-[#666666] hover:text-[#C0A080] transition-colors"><Facebook size={20} /></a>
                            <a href="#" className="text-[#666666] hover:text-[#C0A080] transition-colors"><Instagram size={20} /></a>
                            <a href="#" className="text-[#666666] hover:text-[#C0A080] transition-colors"><Twitter size={20} /></a>
                        </div>
                    </div>

                    {/* Kolom Link Navigasi */}
                    <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
                        <div>
                            <h3 className="text-sm font-semibold text-[#333333] tracking-wider uppercase">Toko</h3>
                            <ul className="mt-4 space-y-3">
                                <li><Link to="/products" className="text-[#555555] hover:text-[#C0A080] transition-colors">Semua Produk</Link></li>
                                <li><Link to="/category/pakaian-pria" className="text-[#555555] hover:text-[#C0A080] transition-colors">Pakaian Pria</Link></li>
                                <li><Link to="/category/pakaian-wanita" className="text-[#555555] hover:text-[#C0A080] transition-colors">Pakaian Wanita</Link></li>
                                <li><Link to="/category/aksesoris" className="text-[#555555] hover:text-[#C0A080] transition-colors">Aksesoris</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-[#333333] tracking-wider uppercase">Bantuan</h3>
                            <ul className="mt-4 space-y-3">
                                <li><Link to="/faq" className="text-[#555555] hover:text-[#C0A080] transition-colors">FAQ</Link></li>
                                <li><Link to="/return-policy" className="text-[#555555] hover:text-[#C0A080] transition-colors">Kebijakan Pengembalian</Link></li>
                                <li><Link to="#" className="text-[#555555] hover:text-[#C0A080] transition-colors">Lacak Pesanan</Link></li>
                                <li><Link to="/contact" className="text-[#555555] hover:text-[#C0A080] transition-colors">Hubungi Kami</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-sm font-semibold text-[#333333] tracking-wider uppercase">Berlangganan</h3>
                            <p className="mt-4 text-[#666666]">Dapatkan info koleksi terbaru dan penawaran spesial.</p>
                            <form className="mt-4 flex">
                                <input 
                                    type="email" 
                                    placeholder="Email Anda" 
                                    className="w-full bg-white border border-[#F0F0F0] rounded-l-md px-4 py-2 text-[#333333] focus:outline-none focus:ring-2 focus:ring-[#C0A080]"
                                />
                                <button className="bg-[#C0A080] hover:bg-[#B09070] px-4 py-2 rounded-r-md transition-colors text-white">
                                    <Send size={20} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Bagian Bawah Footer (Copyright) */}
                <div className="mt-12 pt-8 border-t border-[#F0F0F0] flex flex-col sm:flex-row justify-between items-center text-sm text-[#666666]">
                    <p>&copy; {new Date().getFullYear()} Outfitopia. All Rights Reserved.</p>
                    <div className="flex space-x-6 mt-4 sm:mt-0">
                        <Link to="/terms-of-service" className="hover:text-[#C0A080]">Syarat & Ketentuan</Link>
                        <Link to="/privacy-policy" className="hover:text-[#C0A080]">Kebijakan Privasi</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;