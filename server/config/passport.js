// server/config/passport.js
require('dotenv').config();
const passport     = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool         = require('./db');
const bcrypt       = require('bcryptjs');
const crypto       = require('crypto');

const GOOGLE_CLIENT_ID     = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CALLBACK_URL         = process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback';

// Guard: jika Google credentials belum diisi, skip setup
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET ||
    GOOGLE_CLIENT_ID === 'ISI_DARI_GOOGLE_CONSOLE') {
    console.warn('[Passport] Google OAuth credentials not set — Google login disabled');
} else {
    passport.use(new GoogleStrategy({
        clientID:     GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL:  CALLBACK_URL,
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            const email = profile.emails?.[0]?.value;
            const name  = profile.displayName || profile.username || 'Google User';

            if (!email) return done(new Error('Email tidak tersedia dari Google'), null);

            // Cek user sudah ada berdasarkan email
            const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

            if (rows.length > 0) {
                // User sudah ada — return langsung
                const existingUser = rows[0];
                return done(null, {
                    id:    existingUser.id,
                    name:  existingUser.name,
                    email: existingUser.email,
                    role:  existingUser.role,
                });
            }

            // User baru — buat akun otomatis
            const randomPass = crypto.randomBytes(32).toString('hex');
            const hashed     = await bcrypt.hash(randomPass, 12);

            const [result] = await pool.query(
                'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
                [name, email, hashed, 'user']
            );

            return done(null, {
                id:    result.insertId,
                name:  name,
                email: email,
                role:  'user',
            });
        } catch (err) {
            console.error('[Passport] Google strategy error:', err.message);
            return done(err, null);
        }
    }));
}

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const [rows] = await pool.query('SELECT id, name, email, role FROM users WHERE id = ?', [id]);
        done(null, rows[0] || null);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;
