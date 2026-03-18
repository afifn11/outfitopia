import React from 'react';
import { Link } from 'react-router-dom';

const InfoPageLayout = ({ title, children }) => (
  <div className="page-enter max-w-2xl mx-auto px-6 py-12">
    <div className="mb-3">
      <Link to="/" className="text-[11px] tracking-wide uppercase text-[#a0a0a0] hover:text-[#0a0a0a] transition-colors">← Back</Link>
    </div>
    <h1 className="text-[11px] font-medium tracking-[0.12em] uppercase text-[#0a0a0a] mb-8">{title}</h1>
    <div className="prose prose-sm text-[#6b6b6b] leading-relaxed space-y-4 text-[13px]">
      {children}
    </div>
  </div>
);

export default InfoPageLayout;
