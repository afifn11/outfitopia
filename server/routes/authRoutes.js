// server/routes/authRoutes.js
require('dotenv').config();
const express = require('express');
const router  = express.Router();
const passport = require('../config/passport');
const { registerUser, loginUser, googleCallback } = require('../controllers/authController');

// Standard auth
router.post('/register', registerUser);
router.post('/login',    loginUser);

// Google OAuth
router.get('/google',
    passport.authenticate('google', { scope: ['profile', 'email'], session: false })
);

router.get('/google/callback',
    passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/login?error=google_failed`, session: false }),
    googleCallback
);

module.exports = router;
