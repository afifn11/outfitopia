require('dotenv').config();

const sendEmail = async ({ to, subject, html }) => {
    // Skip jika SMTP belum dikonfigurasi
    if (!process.env.BREVO_HOST || !process.env.BREVO_USER || !process.env.BREVO_KEY) {
        console.log(`[Email skipped] To: ${to} | Subject: ${subject}`);
        return;
    }

    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
        host: process.env.BREVO_HOST,
        port: Number(process.env.BREVO_PORT) || 587,
        secure: false,
        auth: {
            user: process.env.BREVO_USER,
            pass: process.env.BREVO_KEY,
        },
    });

    try {
        const info = await transporter.sendMail({
            from: `"Outfitopia" <${process.env.BREVO_USER}>`,
            to, subject, html,
        });
        console.log('Email sent: ' + info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error.message);
        // Jangan throw — email gagal tidak boleh gagalkan request utama
    }
};

module.exports = { sendEmail };