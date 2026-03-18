import React, { useState } from 'react';
import InfoPageLayout from '../components/InfoPageLayout';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = e => { e.preventDefault(); setSent(true); };

  return (
    <InfoPageLayout title="Contact us">
      {sent ? (
        <div className="py-8 text-center">
          <p className="text-[13px] text-[#0a0a0a] mb-2">Message sent.</p>
          <p className="text-[12px] text-[#6b6b6b]">We'll get back to you within 1–2 business days.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-7 max-w-sm">
          <div>
            <label className="block label-sm text-[#6b6b6b] mb-2">Name</label>
            <input name="name" value={form.name} onChange={handleChange} required className="input-minimal" placeholder="Your name" />
          </div>
          <div>
            <label className="block label-sm text-[#6b6b6b] mb-2">Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required className="input-minimal" placeholder="your@email.com" />
          </div>
          <div>
            <label className="block label-sm text-[#6b6b6b] mb-2">Message</label>
            <textarea name="message" value={form.message} onChange={handleChange} required rows={4} className="input-minimal resize-none" placeholder="How can we help?" />
          </div>
          <button type="submit" className="btn-black">Send message</button>
        </form>
      )}
    </InfoPageLayout>
  );
};
export default ContactPage;
