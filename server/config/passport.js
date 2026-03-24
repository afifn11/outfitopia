// server/config/passport.js
require('dotenv').config();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const pool = require('./db');

passport.use(new GoogleStrategy({
    clientID:     process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL:  process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback',
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const email = profile.emails?.[0]?.value;
        const name  = profile.displayName;

        if (!email) return done(new Error('No email from Google'), null);

        // Check if user already exists
        const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);

        if (rows.length > 0) {
            // User exists — return it
            return done(null, rows[0]);
        }

        // New user — create with random password (they'll use Google to login)
        const crypto = require('crypto');
        const randomPass = crypto.randomBytes(32).toString('hex');
        const bcrypt = require('bcryptjs');
        const hashed = await bcrypt.hash(randomPass, 12);

        const [result] = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
            [name, email, hashed, 'user']
        );

        const newUser = { id: result.insertId, name, email, role: 'user' };
        return done(null, newUser);
    } catch (err) {
        return done(err, null);
    }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
        done(null, rows[0] || null);
    } catch (err) {
        done(err, null);
    }
});

module.exports = passport;
