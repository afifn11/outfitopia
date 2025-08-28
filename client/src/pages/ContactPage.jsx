import React from 'react';
import InfoPageLayout from '../components/InfoPageLayout';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const ContactPage = () => {
    return (
        <InfoPageLayout 
            title="Hubungi Kami" 
            subtitle="Kami siap membantu. Hubungi kami melalui detail di bawah ini atau isi formulir kontak."
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
                {/* Info Kontak */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold text-[#333333]">Informasi Kontak</h2>
                    
                    <div className="flex items-start space-x-4 p-4 bg-[#FAFAFA] rounded-lg border border-[#F0F0F0]">
                        <Mail className="w-5 h-5 text-[#C0A080] mt-1 flex-shrink-0"/>
                        <div>
                            <h3 className="font-medium text-[#333333]">Email</h3>
                            <p className="text-[#666666] mt-1">support@outfitopia.com</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 p-4 bg-[#FAFAFA] rounded-lg border border-[#F0F0F0]">
                        <Phone className="w-5 h-5 text-[#C0A080] mt-1 flex-shrink-0"/>
                        <div>
                            <h3 className="font-medium text-[#333333]">Telepon</h3>
                            <p className="text-[#666666] mt-1">+62 812 3456 7890</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start space-x-4 p-4 bg-[#FAFAFA] rounded-lg border border-[#F0F0F0]">
                        <MapPin className="w-5 h-5 text-[#C0A080] mt-1 flex-shrink-0"/>
                        <div>
                            <h3 className="font-medium text-[#333333]">Alamat</h3>
                            <p className="text-[#666666] mt-1">Jl. Jenderal Sudirman No. 123, Jakarta, Indonesia</p>
                        </div>
                    </div>
                </div>

                {/* Formulir Kontak */}
                <form className="space-y-4 bg-white p-6 rounded-xl border border-[#F0F0F0] shadow-sm">
                    <h2 className="text-xl font-semibold text-[#333333] mb-4">Kirim Pesan</h2>
                    
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-[#333333] mb-2">Nama</label>
                        <input 
                            type="text" 
                            id="name" 
                            className="w-full px-4 py-3 border border-[#F0F0F0] rounded-lg focus:ring-2 focus:ring-[#C0A080] focus:border-[#C0A080] transition-colors duration-200 bg-[#FAFAFA] focus:bg-white"
                            placeholder="Masukkan nama lengkap Anda"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-[#333333] mb-2">Email</label>
                        <input 
                            type="email" 
                            id="email" 
                            className="w-full px-4 py-3 border border-[#F0F0F0] rounded-lg focus:ring-2 focus:ring-[#C0A080] focus:border-[#C0A080] transition-colors duration-200 bg-[#FAFAFA] focus:bg-white"
                            placeholder="Masukkan alamat email Anda"
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-[#333333] mb-2">Pesan</label>
                        <textarea 
                            id="message" 
                            rows="4" 
                            className="w-full px-4 py-3 border border-[#F0F0F0] rounded-lg focus:ring-2 focus:ring-[#C0A080] focus:border-[#C0A080] transition-colors duration-200 bg-[#FAFAFA] focus:bg-white resize-none"
                            placeholder="Tulis pesan Anda di sini..."
                        ></textarea>
                    </div>
                    
                    <button 
                        type="submit" 
                        className="w-full bg-[#C0A080] text-white py-3 px-4 rounded-lg hover:bg-[#B09070] transition-colors duration-200 font-medium flex items-center justify-center"
                    >
                        <Send className="w-5 h-5 mr-2" />
                        Kirim Pesan
                    </button>
                </form>
            </div>
        </InfoPageLayout>
    );
};

export default ContactPage;