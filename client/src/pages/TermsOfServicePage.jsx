import React from 'react';
import InfoPageLayout from '../components/InfoPageLayout';

const TermsOfServicePage = () => {
    // PENTING: Teks di bawah ini hanyalah placeholder. Anda HARUS menggantinya dengan syarat dan ketentuan Anda yang sebenarnya.
    return (
        <InfoPageLayout
            title="Syarat & Ketentuan"
            subtitle="Harap baca syarat dan ketentuan ini dengan cermat."
        >
            <div className="prose max-w-none text-slate-600">
                <h2>1. Penggunaan Situs</h2>
                <p>Dengan mengakses situs web ini, kami menganggap Anda menerima syarat dan ketentuan ini. Jangan terus menggunakan Outfitopia jika Anda tidak setuju untuk mengambil semua syarat dan ketentuan yang tercantum di halaman ini.</p>
                
                <h2>2. Lisensi</h2>
                <p>Kecuali dinyatakan lain, Outfitopia dan/atau pemberi lisensinya memiliki hak kekayaan intelektual untuk semua materi di Outfitopia. Semua hak kekayaan intelektual dilindungi.</p>
            </div>
        </InfoPageLayout>
    );
};

export default TermsOfServicePage;