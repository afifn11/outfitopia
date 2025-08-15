const pool = require('../config/db');

// --- Helper Function untuk mengelola asosiasi kategori ---
const updateProductCategories = async (connection, productId, categoryIds = []) => {
    // 1. Hapus semua asosiasi kategori lama untuk produk ini
    await connection.query('DELETE FROM product_categories WHERE product_id = ?', [productId]);
    
    // 2. Jika ada kategori baru yang dipilih, masukkan asosiasi yang baru
    if (categoryIds && categoryIds.length > 0) {
        const values = categoryIds.map(categoryId => [productId, categoryId]);
        await connection.query('INSERT INTO product_categories (product_id, category_id) VALUES ?', [values]);
    }
};


// --- Product Management (BAGIAN YANG DIPERBAIKI) ---
exports.createProduct = async (req, res) => {
    // Ambil data baru: is_featured dan category_ids
    const { name, price, description, image, sizes, is_featured, category_ids } = req.body;
    const sizesString = Array.isArray(sizes) ? sizes.join(',') : '';
    
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Masukkan data ke tabel products, termasuk is_featured
        const [result] = await connection.query(
            'INSERT INTO products (name, price, description, image, sizes, is_featured) VALUES (?, ?, ?, ?, ?, ?)',
            [name, price, description, image, sizesString, is_featured || false]
        );
        const productId = result.insertId;

        // Gunakan helper function untuk menyimpan kategori
        await updateProductCategories(connection, productId, category_ids);

        await connection.commit();
        res.status(201).json({ id: productId, ...req.body });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Create product error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        if (connection) connection.release();
    }
};

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    // Ambil data baru: is_featured dan category_ids
    const { name, price, description, image, sizes, is_featured, category_ids } = req.body;
    const sizesString = Array.isArray(sizes) ? sizes.join(',') : '';

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Update data di tabel products, termasuk is_featured
        await connection.query(
            'UPDATE products SET name = ?, price = ?, description = ?, image = ?, sizes = ?, is_featured = ? WHERE id = ?',
            [name, price, description, image, sizesString, is_featured || false, id]
        );

        // Gunakan helper function untuk memperbarui kategori
        await updateProductCategories(connection, id, category_ids);
        
        await connection.commit();
        res.json({ message: 'Product updated successfully' });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Update product error:", error);
        res.status(500).json({ message: 'Server error', error: error.message });
    } finally {
        if (connection) connection.release();
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM products WHERE id = ?', [id]);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ message: 'Tidak dapat menghapus produk yang sudah menjadi bagian dari pesanan.' });
        }
        res.status(500).json({ message: 'Server error', error });
    }
};

// --- Order Management ---
exports.getAllOrders = async (req, res) => {
    try {
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

// --- Review Management ---
exports.getAllReviews = async (req, res) => {
    try {
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
    const { id } = req.params;
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();
        const [reviewData] = await connection.query('SELECT product_id FROM reviews WHERE id = ?', [id]);
        if (reviewData.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Review not found' });
        }
        const { product_id } = reviewData[0];
        await connection.query('DELETE FROM reviews WHERE id = ?', [id]);
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