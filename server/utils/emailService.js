const nodemailer = require('nodemailer');
require('dotenv').config();

// Konfigurasi transporter menggunakan kredensial Brevo dari .env
const transporter = nodemailer.createTransport({
    host: process.env.BREVO_HOST,
    port: process.env.BREVO_PORT,
    secure: false, // false untuk port 587 yang menggunakan STARTTLS
    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_KEY,
    },
});

/**
 * Fungsi untuk mengirim email.
 * @param {object} mailOptions - Opsi email
 * @param {string} mailOptions.to - Alamat email penerima
 * @param {string} mailOptions.subject - Judul email
 * @param {string} mailOptions.html - Isi email dalam format HTML
 */
const sendEmail = async ({ to, subject, html }) => {
    try {
        const mailOptions = {
            from: `"Outfitopia" <muhammadafifnaufal3@gmail.com>`,
            to: to,
            subject: subject,
            html: html,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent via Brevo: ' + info.response);
        return info;
    } catch (error) {
        console.error('Error sending email via Brevo:', error);
        throw new Error('Gagal mengirim email notifikasi.');
    }
};

module.exports = { sendEmail };