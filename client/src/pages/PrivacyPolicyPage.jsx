import React from 'react';
import InfoPageLayout from '../components/InfoPageLayout';

const PrivacyPolicyPage = () => {
    // PENTING: Teks di bawah ini hanyalah placeholder. Anda HARUS menggantinya dengan kebijakan privasi Anda yang sebenarnya.
    return (
        <InfoPageLayout
            title="Kebijakan Privasi"
            subtitle="Privasi Anda penting bagi kami."
        >
            <div className="prose max-w-none text-slate-600">
                <h2>1. Informasi yang Kami Kumpulkan</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Kami mengumpulkan informasi pribadi seperti nama, alamat email, dan alamat pengiriman saat Anda mendaftar dan melakukan pemesanan.</p>
                
                <h2>2. Bagaimana Kami Menggunakan Informasi Anda</h2>
                <p>Informasi yang kami kumpulkan digunakan untuk memproses transaksi Anda, mengelola akun Anda, dan, jika Anda setuju, mengirim email kepada Anda tentang produk dan penawaran khusus lainnya.</p>

                <h2>3. Keamanan Data</h2>
                <p>Kami berkomitmen untuk memastikan bahwa informasi Anda aman. Untuk mencegah akses atau pengungkapan yang tidak sah, kami telah menerapkan prosedur fisik, elektronik, dan manajerial yang sesuai untuk melindungi dan mengamankan informasi yang kami kumpulkan secara online.</p>
            </div>
        </InfoPageLayout>
    );
};

export default PrivacyPolicyPage;