// /server/controllers/reviewController.js (Versi Perbaikan)

const pool = require('../config/db');

// Dapatkan semua ulasan untuk satu produk
exports.getProductReviews = async (req, res) => {
    try {
        const [reviews] = await pool.query(
            'SELECT r.*, u.name as userName FROM reviews r JOIN users u ON r.user_id = u.id WHERE r.product_id = ? ORDER BY r.created_at DESC',
            [req.params.id]
        );
        res.json(reviews);
    } catch (error) {
        console.error('Get reviews error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// Buat ulasan baru
exports.createProductReview = async (req, res) => {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = req.user.id;

    if (!rating || rating == 0) {
        return res.status(400).json({ message: 'Rating tidak boleh kosong.' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // ==================================================================
        // === PERUBAHAN UTAMA DI SINI: Validasi Status Pesanan Diperlonggar ===
        // ==================================================================
        // 1. Validasi: Cek apakah user pernah membeli produk ini (status Shipped atau Completed)
        const [purchase] = await connection.query(
            `SELECT o.id FROM orders o JOIN order_items oi ON o.id = oi.order_id WHERE o.user_id = ? AND oi.product_id = ? AND (o.status = 'Shipped' OR o.status = 'Completed')`,
            [userId, productId]
        );
        if (purchase.length === 0) {
            await connection.rollback();
            // Berikan pesan error yang lebih jelas ke frontend
            return res.status(403).json({ message: 'Anda hanya bisa memberi ulasan untuk produk yang sudah diterima.' });
        }

        // 2. Cek apakah user sudah pernah mereview
        const [existingReview] = await connection.query('SELECT id FROM reviews WHERE user_id = ? AND product_id = ?', [userId, productId]);
        if(existingReview.length > 0) {
            await connection.rollback();
            return res.status(400).json({ message: 'Produk sudah pernah Anda ulas.' });
        }

        // 3. Masukkan review baru
        await connection.query('INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)', [productId, userId, rating, comment]);

        // 4. Update average_rating dan num_reviews di tabel products
        await connection.query(`
            UPDATE products p SET
            p.num_reviews = (SELECT COUNT(*) FROM reviews r WHERE r.product_id = ?),
            p.average_rating = (SELECT AVG(r.rating) FROM reviews r WHERE r.product_id = ?)
            WHERE p.id = ?
        `, [productId, productId, productId]);

        await connection.commit();
        res.status(201).json({ message: 'Ulasan berhasil ditambahkan' });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Create review error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan di server.' });
    } finally {
        if (connection) connection.release();
    }
};