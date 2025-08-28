const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/emailService');

const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    });
};

// Template email yang konsisten dengan desain website
const generateWelcomeEmailTemplate = (name, frontendUrl) => {
    return `
        <!DOCTYPE html>
        <html lang="id">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Selamat Datang di Outfitopia</title>
            <style>
                body {
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    line-height: 1.6;
                    color: #333333;
                    background-color: #FAFAFA;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    background-color: #FFFFFF;
                    border-radius: 12px;
                    overflow: hidden;
                    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                }
                .header {
                    background-color: #C0A080;
                    padding: 30px 20px;
                    text-align: center;
                    color: #FFFFFF;
                }
                .logo {
                    font-size: 28px;
                    font-weight: bold;
                    margin-bottom: 10px;
                }
                .content {
                    padding: 30px;
                }
                .welcome-text {
                    font-size: 18px;
                    margin-bottom: 20px;
                    color: #333333;
                }
                .button {
                    display: inline-block;
                    padding: 14px 28px;
                    background-color: #C0A080;
                    color: #FFFFFF;
                    text-decoration: none;
                    border-radius: 8px;
                    font-weight: 600;
                    margin: 20px 0;
                    transition: background-color 0.3s ease;
                }
                .button:hover {
                    background-color: #B09070;
                }
                .features {
                    margin: 30px 0;
                    padding: 20px;
                    background-color: #FAFAFA;
                    border-radius: 8px;
                    border: 1px solid #F0F0F0;
                }
                .feature-item {
                    margin-bottom: 15px;
                    padding-left: 25px;
                    position: relative;
                }
                .feature-item:before {
                    content: "✓";
                    position: absolute;
                    left: 0;
                    color: #C0A080;
                    font-weight: bold;
                }
                .footer {
                    text-align: center;
                    padding: 20px;
                    color: #666666;
                    font-size: 14px;
                    border-top: 1px solid #F0F0F0;
                    background-color: #FAFAFA;
                }
                .social-links {
                    margin: 15px 0;
                }
                .social-link {
                    color: #C0A080;
                    text-decoration: none;
                    margin: 0 10px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo">OUTFITOPIA</div>
                    <p>Style in Simplicity</p>
                </div>
                
                <div class="content">
                    <h1>Halo, ${name}!</h1>
                    
                    <p class="welcome-text">
                        Selamat datang di Outfitopia! Kami sangat senang Anda bergabung dengan kami. 
                        Akun Anda telah berhasil dibuat dan sekarang Anda dapat menikmati semua fitur 
                        yang kami sediakan.
                    </p>

                    <div class="features">
                        <h3>Yang bisa Anda lakukan:</h3>
                        <div class="feature-item">Jelajahi koleksi fashion terbaru kami</div>
                        <div class="feature-item">Simpan item favorit untuk nanti</div>
                        <div class="feature-item">Beli produk dengan proses yang aman</div>
                        <div class="feature-item">Lacak pesanan dengan mudah</div>
                    </div>

                    <div style="text-align: center;">
                        <a href="${frontendUrl}" class="button">
                            Mulai Berbelanja Sekarang
                        </a>
                    </div>

                    <p>
                        Jika Anda memiliki pertanyaan atau butuh bantuan, jangan ragu untuk 
                        menghubungi tim support kami di 
                        <a href="mailto:support@outfitopia.com" style="color: #C0A080;">
                            support@outfitopia.com
                        </a>
                    </p>
                </div>
                
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} Outfitopia. All rights reserved.</p>
                    
                    <div class="social-links">
                        <a href="#" class="social-link">Instagram</a> • 
                        <a href="#" class="social-link">Facebook</a> • 
                        <a href="#" class="social-link">Twitter</a>
                    </div>
                    
                    <p>
                        Email ini dikirim secara otomatis. Mohon tidak membalas email ini.
                    </p>
                </div>
            </div>
        </body>
        </html>
    `;
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Harap lengkapi semua field' });
    }

    try {
        const [userExists] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (userExists.length > 0) {
            return res.status(400).json({ message: 'Email sudah terdaftar' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await pool.query(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );

        const newUser = { id: result.insertId, name, email, role: 'user' };

        // Mengirim email notifikasi registrasi
        try {
            const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
            await sendEmail({
                to: newUser.email,
                subject: 'Selamat Datang di Outfitopia! 🎉',
                html: generateWelcomeEmailTemplate(newUser.name, frontendUrl)
            });
            console.log('Email selamat datang berhasil dikirim ke:', newUser.email);
        } catch (emailError) {
            console.error("Gagal mengirim email selamat datang:", emailError);
            // Registrasi tetap berhasil meskipun email gagal
        }

        res.status(201).json({
            ...newUser,
            token: generateToken(newUser.id, newUser.role),
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return res.status(400).json({ message: 'Harap lengkapi email dan password' });
    }

    try {
        const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            return res.status(400).json({ message: 'Email atau password salah' });
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
            res.status(400).json({ message: 'Email atau password salah' });
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server', error: error.message });
    }
};

module.exports = { registerUser, loginUser };