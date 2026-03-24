// server/controllers/authController.js
require('dotenv').config();
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/emailService');

const generateToken = (id, role) =>
    jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: '30d' });

// ── Register ──────────────────────────────────────────────────────────────────
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
        return res.status(400).json({ message: 'Harap lengkapi semua field' });

    try {
        const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
        if (existing.length > 0)
            return res.status(400).json({ message: 'Email sudah terdaftar' });

        const hashed = await bcrypt.hash(password, 12);
        const [result] = await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashed]
        );
        const newUser = { id: result.insertId, name, email, role: 'user' };

        // Send welcome email non-blocking
        try {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            await sendEmail({
                to: email,
                subject: 'Selamat Datang di Outfitopia!',
                html: generateWelcomeEmail(name, frontendUrl),
            });
        } catch (e) {
            console.error('Welcome email failed:', e.message);
        }

        res.status(201).json({ ...newUser, token: generateToken(newUser.id, newUser.role) });
    } catch (err) {
        console.error('Register error:', err.message);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// ── Login ─────────────────────────────────────────────────────────────────────
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ message: 'Harap lengkapi email dan password' });

    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (rows.length === 0)
            return res.status(400).json({ message: 'Email atau password salah' });

        const user = rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(400).json({ message: 'Email atau password salah' });

        res.json({
            id: user.id, name: user.name, email: user.email, role: user.role,
            token: generateToken(user.id, user.role),
        });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ message: 'Terjadi kesalahan server' });
    }
};

// ── Google OAuth callback ─────────────────────────────────────────────────────
// Called after Google authenticates the user
const googleCallback = async (req, res) => {
    try {
        const { id, name, email, role } = req.user;
        const token = generateToken(id, role);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

        // Redirect to frontend with token in URL — frontend will store it
        res.redirect(`${frontendUrl}/auth/google/success?token=${token}&id=${id}&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&role=${role}`);
    } catch (err) {
        console.error('Google callback error:', err.message);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        res.redirect(`${frontendUrl}/login?error=google_auth_failed`);
    }
};

// ── Welcome email template ────────────────────────────────────────────────────
const generateWelcomeEmail = (name, frontendUrl) => `
    <div style="font-family: 'Inter', sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <div style="background: #0a0a0a; padding: 32px; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 22px; letter-spacing: 0.15em; font-weight: 500;">OUTFITOPIA</h1>
        </div>
        <div style="padding: 40px 32px;">
            <h2 style="font-size: 20px; font-weight: 400; margin-bottom: 16px;">Halo, ${name}!</h2>
            <p style="color: #6b6b6b; line-height: 1.7; margin-bottom: 32px;">
                Akun Outfitopia kamu berhasil dibuat. Selamat berbelanja koleksi fashion pilihan kami.
            </p>
            <a href="${frontendUrl}" style="display:inline-block;background:#0a0a0a;color:#fff;text-decoration:none;padding:14px 32px;font-size:11px;letter-spacing:0.12em;text-transform:uppercase;">
                Mulai Berbelanja →
            </a>
        </div>
        <div style="padding: 20px 32px; border-top: 1px solid #e8e8e8; text-align: center;">
            <p style="font-size: 11px; color: #a0a0a0; margin: 0;">© ${new Date().getFullYear()} Outfitopia. All rights reserved.</p>
        </div>
    </div>
`;

module.exports = { registerUser, loginUser, googleCallback };
