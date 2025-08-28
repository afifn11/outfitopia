import React from 'react';
import InfoPageLayout from '../components/InfoPageLayout';

const ReturnPolicyPage = () => {
    // PENTING: Teks di bawah ini hanyalah placeholder. Anda HARUS menggantinya dengan kebijakan Anda yang sebenarnya.
    return (
        <InfoPageLayout
            title="Kebijakan Pengembalian"
            subtitle="Kami ingin Anda puas dengan pembelian Anda."
        >
            <div className="prose max-w-none text-slate-600">
                <h2>Batas Waktu Pengembalian</h2>
                <p>Anda dapat mengembalikan produk dalam waktu 14 hari sejak tanggal penerimaan untuk mendapatkan pengembalian dana penuh atau penukaran.</p>
                
                <h2>Kondisi Produk</h2>
                <p>Produk yang dikembalikan harus dalam kondisi asli, belum dipakai, belum dicuci, dan dengan semua label asli masih terpasang.</p>
            </div>
        </InfoPageLayout>
    );
};

export default ReturnPolicyPage;