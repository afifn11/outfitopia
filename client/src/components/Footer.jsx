import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="border-t border-[#e8e8e8] mt-auto">
    <div className="bg-[#fafafa] px-6 py-10">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <p className="text-[11px] font-semibold tracking-[0.18em] uppercase text-[#0a0a0a] mb-4">Outfitopia</p>
          <p className="text-[12px] text-[#6b6b6b] leading-relaxed max-w-[160px]">Minimal fashion for the modern wardrobe.</p>
        </div>
        <div>
          <p className="label-sm text-[#0a0a0a] mb-4">Company</p>
          {['About us', 'Careers', 'Sustainability'].map(l => (
            <span key={l} className="block text-[12px] text-[#6b6b6b] mb-2.5 hover:text-[#0a0a0a] transition-colors cursor-pointer">{l}</span>
          ))}
        </div>
        <div>
          <p className="label-sm text-[#0a0a0a] mb-4">Help</p>
          {[['Size guide','/products'],['Shipping & returns','/return-policy'],['Contact us','/contact'],['FAQ','/faq']].map(([l, to]) => (
            <Link key={l} to={to} className="block text-[12px] text-[#6b6b6b] mb-2.5 hover:text-[#0a0a0a] transition-colors">{l}</Link>
          ))}
        </div>
        <div>
          <p className="label-sm text-[#0a0a0a] mb-4">Legal</p>
          {[['Privacy policy','/privacy-policy'],['Terms of service','/terms-of-service']].map(([l, to]) => (
            <Link key={l} to={to} className="block text-[12px] text-[#6b6b6b] mb-2.5 hover:text-[#0a0a0a] transition-colors">{l}</Link>
          ))}
        </div>
      </div>
    </div>
    <div className="border-t border-[#e8e8e8] px-6 py-4 flex justify-between items-center">
      <span className="text-[11px] text-[#a0a0a0]">© {new Date().getFullYear()} Outfitopia. All rights reserved.</span>
      <span className="text-[11px] text-[#a0a0a0]">IDR · Indonesia</span>
    </div>
  </footer>
);

export default Footer;
