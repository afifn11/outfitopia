import React, { useState } from 'react';
import InfoPageLayout from '../components/InfoPageLayout';
import { ChevronDown } from 'lucide-react';

const AccordionItem = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="border-b border-[#F0F0F0] py-5">
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="w-full flex justify-between items-center text-left focus:outline-none focus:ring-2 focus:ring-[#C0A080] focus:ring-offset-2 rounded-lg p-2 transition-all duration-200"
            >
                <h3 className="text-lg font-semibold text-[#333333]">{title}</h3>
                <ChevronDown 
                    className={`w-5 h-5 text-[#666666] transform transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} 
                />
            </button>
            {isOpen && (
                <div className="mt-4 text-[#666666] leading-relaxed pl-2">
                    {children}
                </div>
            )}
        </div>
    );
};

const FaqPage = () => {
    return (
        <InfoPageLayout 
            title="Frequently Asked Questions (FAQ)"
            subtitle="Temukan jawaban untuk pertanyaan yang paling sering diajukan di sini."
        >
            <div className="space-y-2">
                <AccordionItem title="Bagaimana cara melacak pesanan saya?">
                    <p>Setelah pesanan Anda dikirim, kami akan mengirimkan email notifikasi yang berisi nomor resi. Anda dapat menggunakan nomor resi tersebut untuk melacak status pengiriman di situs web jasa pengiriman terkait.</p>
                </AccordionItem>
                
                <AccordionItem title="Apa kebijakan pengembalian Anda?">
                    <p>Kami menerima pengembalian produk dalam waktu 14 hari setelah barang diterima, dengan syarat produk masih dalam kondisi baru, belum dipakai, dan lengkap dengan label. Silakan kunjungi halaman Kebijakan Pengembalian kami untuk detail lebih lanjut.</p>
                </AccordionItem>
                
                <AccordionItem title="Berapa lama waktu pengiriman?">
                    <p>Waktu pengiriman bervariasi tergantung lokasi Anda. Untuk Jabodetabek, estimasi 1-3 hari kerja. Untuk kota-kota besar lainnya, 3-7 hari kerja. Anda akan melihat estimasi waktu pengiriman saat checkout.</p>
                </AccordionItem>

                <AccordionItem title="Bagaimana cara melakukan pembayaran?">
                    <p>Kami menerima berbagai metode pembayaran termasuk transfer bank, kartu kredit, dan e-wallet. Semua transaksi diproses dengan aman melalui payment gateway terpercaya.</p>
                </AccordionItem>

                <AccordionItem title="Apakah produk yang dijual original?">
                    <p>Ya, semua produk yang kami jual 100% original dan bergaransi. Kami bekerja langsung dengan brand dan distributor resmi untuk memastikan keaslian produk.</p>
                </AccordionItem>

                <AccordionItem title="Bagaimana jika ukuran tidak pas?">
                    <p>Kami menyediakan panduan ukuran yang detail untuk setiap produk. Jika ukuran tidak pas, Anda dapat melakukan penukaran dalam waktu 14 hari dengan syarat produk masih dalam kondisi baru dan tag masih terpasang.</p>
                </AccordionItem>
            </div>
        </InfoPageLayout>
    );
};

export default FaqPage;