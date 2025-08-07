// /server/controllers/adminController.js
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