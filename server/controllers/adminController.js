// /server/controllers/adminController.js (Versi Final dengan Manajemen Ulasan)

const pool = require('../config/db');

// --- Product Management ---
exports.createProduct = async (req, res) => {
    const { name, price, description, image, sizes } = req.body;
    const sizesString = Array.isArray(sizes) ? sizes.join(',') : '';
    try {
        const [result] = await pool.query(
            'INSERT INTO products (name, price, description, image, sizes) VALUES (?, ?, ?, ?, ?)',
            [name, price, description, image, sizesString]
        );
        res.status(201).json({ id: result.insertId, ...req.body });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, description, image, sizes } = req.body;
    const sizesString = Array.isArray(sizes) ? sizes.join(',') : '';
    try {
        await pool.query(
            'UPDATE products SET name = ?, price = ?, description = ?, image = ?, sizes = ? WHERE id = ?',
            [name, price, description, image, sizesString, id]
        );
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        // Di aplikasi nyata, Anda mungkin ingin melakukan soft delete
        await pool.query('DELETE FROM products WHERE id = ?', [id]);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        // Error jika produk sudah ada di order_items
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'Cannot delete product that is part of an existing order.' });
        }
        res.status(500).json({ message: 'Server error', error });
    }
};

// --- Order Management ---
exports.getAllOrders = async (req, res) => {
    try {
        // JOIN dengan tabel users untuk mendapatkan nama pelanggan
        const [orders] = await pool.query(
            'SELECT o.*, u.name as userName, u.email as userEmail FROM orders o JOIN users u ON o.user_id = u.id ORDER BY o.order_date DESC'
        );
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
        res.json({ message: 'Order status updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};


// ===================================
// === FUNGSI BARU DITAMBAHKAN DI SINI ===
// ===================================

// --- Review Management ---
exports.getAllReviews = async (req, res) => {
    try {
        // JOIN dengan tabel products dan users untuk data yang lebih kaya
        const [reviews] = await pool.query(`
            SELECT r.id, r.rating, r.comment, r.created_at, p.name as productName, u.name as userName
            FROM reviews r
            JOIN products p ON r.product_id = p.id
            JOIN users u ON r.user_id = u.id
            ORDER BY r.created_at DESC
        `);
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
};

exports.deleteReview = async (req, res) => {
    const { id } = req.params; // id dari review yang akan dihapus
    
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // 1. Ambil product_id dari review yang akan dihapus sebelum dihapus
        const [reviewData] = await connection.query('SELECT product_id FROM reviews WHERE id = ?', [id]);
        if (reviewData.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Review not found' });
        }
        const { product_id } = reviewData[0];

        // 2. Hapus review
        await connection.query('DELETE FROM reviews WHERE id = ?', [id]);

        // 3. PENTING: Kalkulasi ulang rating rata-rata dan jumlah review untuk produk terkait
        await connection.query(`
            UPDATE products p SET
            p.num_reviews = (SELECT COUNT(*) FROM reviews r WHERE r.product_id = ?),
            p.average_rating = COALESCE((SELECT AVG(r.rating) FROM reviews r WHERE r.product_id = ?), 0)
            WHERE p.id = ?
        `, [product_id, product_id, product_id]);

        await connection.commit();
        res.json({ message: 'Review deleted successfully' });

    } catch (error) {
        if (connection) await connection.rollback();
        res.status(500).json({ message: 'Server error', error });
    } finally {
        if (connection) connection.release();
    }
};