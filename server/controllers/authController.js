const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/emailService'); // <- Import layanan email

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please add all fields' });
    }

    try {
        const [userExists] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (userExists.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        const newUser = { id: result.insertId, name, email, role: 'user' };

        // --- MENGIRIM EMAIL NOTIFIKASI REGISTRASI ---
        try {
            await sendEmail({
                to: newUser.email,
                subject: 'Selamat Datang di TokoBaju!',
                html: `
                    <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                        <h1 style="color: #333;">Halo, ${newUser.name}!</h1>
                        <p>Terima kasih telah mendaftar di TokoBaju. Akun Anda telah berhasil dibuat.</p>
                        <p>Kini Anda bisa mulai menjelajahi koleksi terbaik kami dan menemukan gaya yang paling cocok untuk Anda.</p>
                        <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}" style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">
                            Mulai Belanja
                        </a>
                        <p style="margin-top: 30px; font-size: 0.9em; color: #777;">Salam hangat,<br>Tim TokoBaju</p>
                    </div>
                `
            });
        } catch (emailError) {
            console.error("Gagal mengirim email selamat datang:", emailError);
            // Proses registrasi tetap dianggap berhasil meskipun email gagal terkirim.
        }
        // ---------------------------------------------

        res.status(201).json({
            ...newUser,
            token: generateToken(newUser.id, newUser.role),
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            res.json({
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user.id, user.role),
            });
        } else {
            res.status(400).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

module.exports = { registerUser, loginUser };