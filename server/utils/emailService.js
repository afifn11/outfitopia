// server/utils/emailService.js
require('dotenv').config();

const formatPrice = (amount) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(amount) || 0);

const getTransporter = () => {
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
    const nodemailer = require('nodemailer');
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: false,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    });
};

const sendEmail = async ({ to, subject, html }) => {
    const transporter = getTransporter();
    if (!transporter) {
        console.log(`[Email skipped] To: ${to} | Subject: ${subject}`);
        return;
    }
    try {
        const info = await transporter.sendMail({
            from: `"Outfitopia" <${process.env.SMTP_USER}>`,
            to, subject, html,
        });
        console.log(`[Email sent] To: ${to} | ${info.response}`);
        return info;
    } catch (err) {
        console.error('[Email error]', err.message);
    }
};

// ── Order confirmation email ───────────────────────────────────────────────────
const orderConfirmationEmail = async ({ to, name, orderId, items, total, address }) => {
    const itemRows = items.map(i => `
        <tr>
            <td style="padding:10px 0;border-bottom:1px solid #f4f4f4;">${i.name} (${i.selectedSize || i.size || '-'})</td>
            <td style="padding:10px 0;border-bottom:1px solid #f4f4f4;text-align:center;">${i.quantity}</td>
            <td style="padding:10px 0;border-bottom:1px solid #f4f4f4;text-align:right;">${formatPrice(i.price * i.quantity)}</td>
        </tr>`).join('');

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    return sendEmail({
        to,
        subject: `Pesanan #${orderId} dikonfirmasi — Outfitopia`,
        html: `
<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="font-family:'Inter',sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
  <div style="background:#0a0a0a;padding:28px 32px;">
    <h1 style="color:#fff;margin:0;font-size:18px;letter-spacing:0.15em;font-weight:500;">OUTFITOPIA</h1>
  </div>
  <div style="padding:36px 32px;">
    <h2 style="font-size:18px;font-weight:400;margin:0 0 8px;">Pesanan dikonfirmasi</h2>
    <p style="color:#6b6b6b;margin:0 0 24px;">Halo ${name}, terima kasih atas pesananmu!</p>

    <div style="background:#fafafa;padding:16px;border-radius:4px;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;color:#6b6b6b;">Order ID</p>
      <p style="margin:4px 0 0;font-size:18px;font-weight:500;">#${orderId}</p>
    </div>

    <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
      <thead>
        <tr style="border-bottom:2px solid #e8e8e8;">
          <th style="text-align:left;padding-bottom:8px;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#a0a0a0;">Produk</th>
          <th style="text-align:center;padding-bottom:8px;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#a0a0a0;">Qty</th>
          <th style="text-align:right;padding-bottom:8px;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#a0a0a0;">Total</th>
        </tr>
      </thead>
      <tbody>${itemRows}</tbody>
      <tfoot>
        <tr>
          <td colspan="2" style="padding-top:12px;font-weight:500;">Total Pembayaran</td>
          <td style="padding-top:12px;font-weight:600;text-align:right;">${formatPrice(total)}</td>
        </tr>
      </tfoot>
    </table>

    <div style="border-top:1px solid #e8e8e8;padding-top:20px;margin-bottom:28px;">
      <p style="font-size:12px;color:#a0a0a0;margin:0 0 4px;text-transform:uppercase;letter-spacing:0.08em;">Alamat Pengiriman</p>
      <p style="font-size:13px;color:#333;margin:0;">${address}</p>
    </div>

    <a href="${frontendUrl}/profile" style="display:inline-block;background:#0a0a0a;color:#fff;text-decoration:none;padding:14px 32px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;">
      Lihat Pesanan →
    </a>
  </div>
  <div style="padding:20px 32px;border-top:1px solid #e8e8e8;text-align:center;">
    <p style="font-size:11px;color:#a0a0a0;margin:0;">© ${new Date().getFullYear()} Outfitopia. All rights reserved.</p>
  </div>
</body></html>`,
    });
};

// ── Order status update email ──────────────────────────────────────────────────
const orderStatusEmail = async ({ to, name, orderId, status, total }) => {
    const statusMessages = {
        Processing: { title: 'Pembayaran diterima', desc: 'Pesananmu sedang diproses dan akan segera dikirim.' },
        Shipped:    { title: 'Pesanan dalam pengiriman', desc: 'Pesananmu sedang dalam perjalanan menuju alamatmu.' },
        Completed:  { title: 'Pesanan selesai', desc: 'Pesananmu telah diterima. Terima kasih telah berbelanja di Outfitopia!' },
        Cancelled:  { title: 'Pesanan dibatalkan', desc: 'Pesananmu telah dibatalkan. Hubungi kami jika ada pertanyaan.' },
    };

    const msg = statusMessages[status] || { title: `Status: ${status}`, desc: '' };
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

    return sendEmail({
        to,
        subject: `Update Pesanan #${orderId} — ${msg.title}`,
        html: `
<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="font-family:'Inter',sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
  <div style="background:#0a0a0a;padding:28px 32px;">
    <h1 style="color:#fff;margin:0;font-size:18px;letter-spacing:0.15em;font-weight:500;">OUTFITOPIA</h1>
  </div>
  <div style="padding:36px 32px;">
    <h2 style="font-size:18px;font-weight:400;margin:0 0 8px;">${msg.title}</h2>
    <p style="color:#6b6b6b;margin:0 0 24px;">Halo ${name}, ${msg.desc}</p>

    <div style="background:#fafafa;padding:16px;border-radius:4px;margin-bottom:24px;">
      <p style="margin:0;font-size:13px;color:#6b6b6b;">Order ID</p>
      <p style="margin:4px 0 12px;font-size:18px;font-weight:500;">#${orderId}</p>
      <p style="margin:0;font-size:13px;color:#6b6b6b;">Total</p>
      <p style="margin:4px 0 0;font-size:16px;font-weight:500;">${formatPrice(total)}</p>
    </div>

    <a href="${frontendUrl}/profile" style="display:inline-block;background:#0a0a0a;color:#fff;text-decoration:none;padding:14px 32px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;">
      Lihat Pesanan →
    </a>
  </div>
  <div style="padding:20px 32px;border-top:1px solid #e8e8e8;text-align:center;">
    <p style="font-size:11px;color:#a0a0a0;margin:0;">© ${new Date().getFullYear()} Outfitopia. All rights reserved.</p>
  </div>
</body></html>`,
    });
};

// ── Welcome email ──────────────────────────────────────────────────────────────
const welcomeEmail = async ({ to, name }) => {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    return sendEmail({
        to,
        subject: 'Selamat Datang di Outfitopia!',
        html: `
<!DOCTYPE html><html><head><meta charset="UTF-8"></head>
<body style="font-family:'Inter',sans-serif;max-width:600px;margin:0 auto;color:#333;background:#fff;">
  <div style="background:#0a0a0a;padding:28px 32px;">
    <h1 style="color:#fff;margin:0;font-size:18px;letter-spacing:0.15em;font-weight:500;">OUTFITOPIA</h1>
  </div>
  <div style="padding:36px 32px;">
    <h2 style="font-size:18px;font-weight:400;margin:0 0 8px;">Halo, ${name}!</h2>
    <p style="color:#6b6b6b;line-height:1.7;margin:0 0 28px;">Akun Outfitopia kamu berhasil dibuat. Selamat berbelanja koleksi fashion pilihan kami.</p>
    <a href="${frontendUrl}" style="display:inline-block;background:#0a0a0a;color:#fff;text-decoration:none;padding:14px 32px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;">Mulai Berbelanja →</a>
  </div>
  <div style="padding:20px 32px;border-top:1px solid #e8e8e8;text-align:center;">
    <p style="font-size:11px;color:#a0a0a0;margin:0;">© ${new Date().getFullYear()} Outfitopia. All rights reserved.</p>
  </div>
</body></html>`,
    });
};

module.exports = { sendEmail, orderConfirmationEmail, orderStatusEmail, welcomeEmail };
