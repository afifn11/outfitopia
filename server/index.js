// server/index.js
require('dotenv').config();
const express  = require('express');
const cors     = require('cors');
const path     = require('path');
const passport = require('./config/passport');

const app = express();

// ── Middleware ─────────────────────────────────────────────────────────────────
app.use(cors({
    origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods:     ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));
app.use(express.json());
app.use(passport.initialize());

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ─────────────────────────────────────────────────────────────────────
app.use('/api/products',   require('./routes/productRoutes'));
app.use('/api/auth',       require('./routes/authRoutes'));
app.use('/api/orders',     require('./routes/orderRoutes'));
app.use('/api/admin',      require('./routes/adminRoutes'));
app.use('/api/reviews',    require('./routes/reviewRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/ai',         require('./routes/aiRoutes'));
app.use('/api/wishlist',   require('./routes/wishlistRoutes'));
app.use('/api/upload',     require('./routes/uploadRoutes'));

// ── Health check ───────────────────────────────────────────────────────────────
app.get('/health', (_, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// ── Start ──────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`✅ Server berjalan di http://localhost:${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
