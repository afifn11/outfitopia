// server/controllers/wishlistController.js
require('dotenv').config();
const pool = require('../config/db');

// GET /api/wishlist — ambil semua wishlist user
const getWishlist = async (req, res) => {
    const userId = req.user.id;
    try {
        const [items] = await pool.query(
            `SELECT w.id, w.created_at, p.id as productId, p.name, p.price, p.image, p.sizes, p.average_rating
             FROM wishlists w
             JOIN products p ON w.product_id = p.id
             WHERE w.user_id = ?
             ORDER BY w.created_at DESC`,
            [userId]
        );
        res.json(items);
    } catch (err) {
        console.error('[Wishlist] getWishlist error:', err.message);
        res.status(500).json({ message: 'Gagal mengambil wishlist' });
    }
};

// POST /api/wishlist/:productId — tambah ke wishlist
const addToWishlist = async (req, res) => {
    const userId    = req.user.id;
    const productId = req.params.productId;
    try {
        // Cek produk ada
        const [product] = await pool.query('SELECT id FROM products WHERE id = ?', [productId]);
        if (product.length === 0)
            return res.status(404).json({ message: 'Produk tidak ditemukan' });

        // Cek sudah ada di wishlist
        const [existing] = await pool.query(
            'SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );
        if (existing.length > 0)
            return res.status(400).json({ message: 'Produk sudah ada di wishlist' });

        await pool.query(
            'INSERT INTO wishlists (user_id, product_id) VALUES (?, ?)',
            [userId, productId]
        );
        res.status(201).json({ message: 'Ditambahkan ke wishlist' });
    } catch (err) {
        console.error('[Wishlist] addToWishlist error:', err.message);
        res.status(500).json({ message: 'Gagal menambah ke wishlist' });
    }
};

// DELETE /api/wishlist/:productId — hapus dari wishlist
const removeFromWishlist = async (req, res) => {
    const userId    = req.user.id;
    const productId = req.params.productId;
    try {
        await pool.query(
            'DELETE FROM wishlists WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );
        res.json({ message: 'Dihapus dari wishlist' });
    } catch (err) {
        console.error('[Wishlist] removeFromWishlist error:', err.message);
        res.status(500).json({ message: 'Gagal menghapus dari wishlist' });
    }
};

// GET /api/wishlist/check/:productId — cek apakah produk ada di wishlist
const checkWishlist = async (req, res) => {
    const userId    = req.user.id;
    const productId = req.params.productId;
    try {
        const [rows] = await pool.query(
            'SELECT id FROM wishlists WHERE user_id = ? AND product_id = ?',
            [userId, productId]
        );
        res.json({ inWishlist: rows.length > 0 });
    } catch (err) {
        res.status(500).json({ message: 'Gagal cek wishlist' });
    }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist, checkWishlist };
