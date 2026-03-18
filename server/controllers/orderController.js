const pool = require('../config/db');

const createOrder = async (req, res) => {
    const { userDetails, cartItems, totalPrice } = req.body;
    const userId = req.user.id; // Diambil dari token setelah melewati middleware 'protect'

    if (!cartItems || cartItems.length < 1) {
        return res.status(400).json({ message: 'No order items' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // 1. Simpan ke tabel 'orders'
        // --- PERBAIKAN DI SINI: Mengganti 'delivery_address' menjadi 'shipping_address' ---
        const [orderResult] = await connection.query(
            'INSERT INTO orders (user_id, total_amount, shipping_address, customer_name, customer_phone) VALUES (?, ?, ?, ?, ?)',
            [userId, totalPrice, userDetails.address, userDetails.name, userDetails.phone]
        );
        // --------------------------------------------------------------------------------

        const orderId = orderResult.insertId;

        // 2. Siapkan dan simpan ke tabel 'order_items'
        const orderItemsPromises = cartItems.map(item => {
            return connection.query(
                'INSERT INTO order_items (order_id, product_id, quantity, price, size) VALUES (?, ?, ?, ?, ?)',
                [orderId, item.id, item.quantity, item.price, item.selectedSize || item.size || 'ONE SIZE']
            );
        });

        await Promise.all(orderItemsPromises);

        // Jika semua berhasil, commit transaksi
        await connection.commit();

        res.status(201).json({ message: 'Order created successfully', orderId });

    } catch (error) {
        // Jika ada satu saja error, batalkan semua (rollback)
        if (connection) await connection.rollback();
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Server error while creating order' });
    } finally {
        if (connection) connection.release();
    }
};

const getMyOrders = async (req, res) => {
    const userId = req.user.id;
    try {
        const [orders] = await pool.query(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC',
            [userId]
        );
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch orders' });
    }
};

const getOrderById = async (req, res) => {
    const userId = req.user.id;
    const orderId = req.params.id;
    try {
        // Validasi bahwa pesanan ini milik user yang sedang login
        const [order] = await pool.query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [orderId, userId]);
        if (order.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Ambil semua item yang berhubungan dengan order ini, join dengan nama produk
        const [items] = await pool.query(
            `SELECT oi.*, p.name as productName, p.image as productImage 
             FROM order_items oi 
             JOIN products p ON oi.product_id = p.id 
             WHERE oi.order_id = ?`,
            [orderId]
        );

        res.json({ order: order[0], items });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch order details' });
    }
};

module.exports = { createOrder, getMyOrders, getOrderById };