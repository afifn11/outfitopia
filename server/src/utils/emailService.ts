// src/utils/emailService.ts
import nodemailer from 'nodemailer';

const getTransporter = () =>
  nodemailer.createTransport({
    host: process.env['SMTP_HOST'],
    port: Number(process.env['SMTP_PORT']) || 587,
    secure: false,
    auth: {
      user: process.env['SMTP_USER'],
      pass: process.env['SMTP_PASS'],
    },
  });

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: SendEmailOptions): Promise<void> => {
  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"Outfitopia" <${process.env['SMTP_USER']}>`,
    ...options,
  });
};

export const sendWelcomeEmail = async (email: string, name: string): Promise<void> => {
  const frontendUrl = process.env['FRONTEND_URL'] ?? 'http://localhost:5173';
  await sendEmail({
    to: email,
    subject: 'Selamat Datang di Outfitopia! 🎉',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #C0A080; padding: 24px; text-align: center; color: white;">
          <h1 style="margin: 0;">OUTFITOPIA</h1>
          <p style="margin: 8px 0 0; opacity: 0.9;">Style in Simplicity</p>
        </div>
        <div style="padding: 32px;">
          <h2>Halo, ${name}!</h2>
          <p>Akun Anda telah berhasil dibuat. Selamat berbelanja!</p>
          <a href="${frontendUrl}" 
             style="display:inline-block;padding:12px 24px;background:#C0A080;color:white;
                    text-decoration:none;border-radius:8px;font-weight:600;margin-top:16px;">
            Mulai Berbelanja
          </a>
        </div>
        <div style="padding: 20px; text-align: center; color: #888; font-size: 13px; border-top: 1px solid #eee;">
          &copy; ${new Date().getFullYear()} Outfitopia. All rights reserved.
        </div>
      </div>
    `,
  });
};
