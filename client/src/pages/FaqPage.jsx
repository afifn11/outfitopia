import React, { useState } from 'react';
import InfoPageLayout from '../components/InfoPageLayout';

const FAQ_ITEMS = [
  { q: 'What is your return policy?', a: 'We accept free returns within 30 days of delivery. Items must be unworn, unwashed, and in original condition.' },
  { q: 'How long does shipping take?', a: 'Standard shipping takes 2–5 business days. Free shipping on orders above Rp 500,000.' },
  { q: 'How do I find my size?', a: 'Refer to our size guide on each product page. When in doubt, size up for a more relaxed fit.' },
  { q: 'Can I change or cancel my order?', a: 'Orders can be changed or cancelled within 1 hour of placement. Contact us immediately if needed.' },
];

const FaqPage = () => {
  const [open, setOpen] = useState(null);
  return (
    <InfoPageLayout title="FAQ">
      <div className="space-y-0 border border-[#e8e8e8]">
        {FAQ_ITEMS.map((item, i) => (
          <div key={i} className={i < FAQ_ITEMS.length - 1 ? 'border-b border-[#e8e8e8]' : ''}>
            <button onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left">
              <span className="text-[13px] text-[#0a0a0a]">{item.q}</span>
              <span className="text-[#a0a0a0] text-lg ml-4">{open === i ? '−' : '+'}</span>
            </button>
            {open === i && (
              <div className="px-5 pb-4">
                <p className="text-[13px] text-[#6b6b6b] leading-relaxed">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </InfoPageLayout>
  );
};
export default FaqPage;
