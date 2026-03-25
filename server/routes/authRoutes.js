// server/routes/authRoutes.js
require('dotenv').config();
const express  = require('express');
const router   = express.Router();
const passport = require('../config/passport');
const { registerUser, loginUser, googleCallback } = require('../controllers/authController');

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Standard auth
router.post('/register', registerUser);
router.post('/login',    loginUser);

// Google OAuth — Step 1: redirect to Google
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email'],
        session: false,
        prompt: 'select_account', // Always show account picker, prevents code reuse issues
    })
);

// Google OAuth — Step 2: callback from Google
router.get('/google/callback',
    // Pre-flight: catch OAuth errors before passport processes them
    (req, res, next) => {
        if (req.query.error) {
            console.log('[OAuth] User cancelled or error from Google:', req.query.error);
            return res.redirect(`${FRONTEND_URL}/login?error=google_cancelled`);
        }
        next();
    },
    // Passport handles the token exchange
    (req, res, next) => {
        passport.authenticate('google', { session: false }, (err, user) => {
            if (err) {
                console.error('[OAuth] Passport error:', err.message);
                return res.redirect(`${FRONTEND_URL}/login?error=google_failed`);
            }
            if (!user) {
                console.error('[OAuth] No user returned from passport');
                return res.redirect(`${FRONTEND_URL}/login?error=google_no_user`);
            }
            req.user = user;
            next();
        })(req, res, next);
    },
    googleCallback
);

module.exports = router;
