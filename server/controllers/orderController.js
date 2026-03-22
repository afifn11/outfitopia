// server/controllers/orderController.js
require('dotenv').config();
const pool = require('../config/db');
const midtransClient = require('midtrans-client');
const crypto = require('crypto');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const snap = new midtransClient.Snap({
    isProduction: IS_PRODUCTION,
    serverKey:    process.env.MIDTRANS_SERVER_KEY,
    clientKey:    process.env.MIDTRANS_CLIENT_KEY,
});

// Verifikasi signature Midtrans — cegah request palsu di production
const verifyMidtransSignature = (notification) => {
    const { order_id, status_code, gross_amount, signature_key } = notification;
    if (!signature_key) return false;
    const hash = crypto
        .createHash('sha512')
        .update(`${order_id}${status_code}${gross_amount}${process.env.MIDTRANS_SERVER_KEY}`)
        .digest('hex');
    return hash === signature_key;
};

// POST /api/orders
const createOrder = async (req, res) => {
    const { userDetails, cartItems, totalPrice } = req.body;
    const userId = req.user.id;

    if (!cartItems || cartItems.length < 1) {
        return res.status(400).json({ message: 'Keranjang kosong' });
    }
    if (!userDetails?.name || !userDetails?.phone || !userDetails?.address) {
        return res.status(400).json({ message: 'Data pengiriman tidak lengkap' });
    }

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        const [orderResult] = await connection.query(
            `INSERT INTO orders (user_id, total_amount, shipping_address, customer_name, customer_phone, status)
             VALUES (?, ?, ?, ?, ?, 'Pending')`,
            [userId, totalPrice, userDetails.address, userDetails.name, userDetails.phone]
        );
        const orderId = orderResult.insertId;

        await Promise.all(
            cartItems.map(item =>
                connection.query(
                    'INSERT INTO order_items (order_id, product_id, quantity, price, size) VALUES (?, ?, ?, ?, ?)',
                    [orderId, item.id, item.quantity, item.price, item.selectedSize || item.size || 'ONE SIZE']
                )
            )
        );

        await connection.commit();

        const [userRows] = await pool.query('SELECT name, email FROM users WHERE id = ?', [userId]);
        const user = userRows[0];

        const itemDetails = cartItems.map(item => ({
            id:       String(item.id),
            price:    Math.round(item.price),
            quantity: item.quantity,
            name:     (item.name || `Product ${item.id}`).substring(0, 50),
        }));

        const subtotal     = cartItems.reduce((sum, i) => sum + i.price * i.quantity, 0);
        const shippingCost = Math.round(totalPrice) - Math.round(subtotal);
        if (shippingCost > 0) {
            itemDetails.push({ id: 'SHIPPING', price: shippingCost, quantity: 1, name: 'Ongkos Kirim' });
        }

        const parameter = {
            transaction_details: {
                order_id:     `OUTFITOPIA-${orderId}-${Date.now()}`,
                gross_amount: Math.round(totalPrice),
            },
            item_details: itemDetails,
            customer_details: {
                first_name: userDetails.name,
                email:      user?.email || '',
                phone:      userDetails.phone,
                shipping_address: {
                    first_name: userDetails.name,
                    phone:      userDetails.phone,
                    address:    userDetails.address,
                },
            },
            callbacks: {
                finish: `${process.env.FRONTEND_URL}/order-success?order_id=${orderId}`,
            },
        };

        const snapResponse = await snap.createTransaction(parameter);

        res.status(201).json({
            message:    'Order created',
            orderId,
            snap_token: snapResponse.token,
            snap_url:   snapResponse.redirect_url,
        });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('[Order] Create error:', error.message);
        res.status(500).json({ message: 'Gagal membuat pesanan: ' + error.message });
    } finally {
        if (connection) connection.release();
    }
};

// POST /api/orders/notification — webhook Midtrans
const handleNotification = async (req, res) => {
    try {
        const notification = req.body;

        console.log('[Midtrans] Notification received:', {
            order_id:           notification.order_id,
            transaction_status: notification.transaction_status,
            fraud_status:       notification.fraud_status,
            payment_type:       notification.payment_type,
        });

        // Production: verifikasi signature wajib
        // Development: skip (tombol "Tes URL" Midtrans pakai dummy ID tanpa signature valid)
        if (IS_PRODUCTION) {
            if (!verifyMidtransSignature(notification)) {
                console.warn('[Midtrans] Invalid signature — request ditolak');
                return res.status(403).json({ message: 'Invalid signature' });
            }
        } else {
            console.log('[Midtrans] Development mode — signature verification skipped');
        }

        const { order_id, transaction_status, fraud_status, payment_type } = notification;

        // Skip jika tidak ada order_id (test notification dari Midtrans dashboard)
        if (!order_id) {
            console.log('[Midtrans] No order_id — skipped');
            return res.status(200).json({ message: 'Skipped' });
        }

        // Ekstrak orderId dari "OUTFITOPIA-{orderId}-{timestamp}"
        const parts   = order_id.split('-');
        const orderId = parts[1];

        if (!orderId || isNaN(orderId)) {
            console.log('[Midtrans] Invalid order_id format:', order_id);
            return res.status(200).json({ message: 'Invalid format, skipped' });
        }

        // Tentukan status order berdasarkan response Midtrans
        let orderStatus = 'Pending';
        if (transaction_status === 'capture') {
            orderStatus = fraud_status === 'challenge' ? 'Pending' : 'Processing';
        } else if (transaction_status === 'settlement') {
            orderStatus = 'Processing';
        } else if (transaction_status === 'pending') {
            orderStatus = 'Pending';
        } else if (['cancel', 'deny', 'expire'].includes(transaction_status)) {
            orderStatus = 'Cancelled';
        }

        const [result] = await pool.query(
            'UPDATE orders SET status = ?, payment_method = ? WHERE id = ?',
            [orderStatus, payment_type || 'midtrans', orderId]
        );

        if (result.affectedRows === 0) {
            console.warn(`[Midtrans] Order ${orderId} tidak ditemukan di database`);
        } else {
            console.log(`[Midtrans] Order ${orderId} → ${orderStatus} (${payment_type})`);
        }

        // Selalu return 200 ke Midtrans — jika return non-200, Midtrans akan retry terus
        res.status(200).json({ message: 'OK' });

    } catch (error) {
        console.error('[Midtrans] Notification error:', error.message);
        // Tetap return 200 agar Midtrans tidak retry — error sudah di-log di server
        res.status(200).json({ message: 'Received with error' });
    }
};

// GET /api/orders/my-orders
const getMyOrders = async (req, res) => {
    const userId = req.user.id;
    try {
        const [orders] = await pool.query(
            'SELECT * FROM orders WHERE user_id = ? ORDER BY order_date DESC',
            [userId]
        );
        res.json(orders);
    } catch (error) {
        console.error('[Order] getMyOrders error:', error.message);
        res.status(500).json({ message: 'Gagal mengambil data pesanan' });
    }
};

// GET /api/orders/:id
const getOrderById = async (req, res) => {
    const userId  = req.user.id;
    const orderId = req.params.id;
    try {
        const [order] = await pool.query(
            'SELECT * FROM orders WHERE id = ? AND user_id = ?',
            [orderId, userId]
        );
        if (order.length === 0) {
            return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
        }
        const [items] = await pool.query(
            `SELECT oi.*, p.name as productName, p.image as productImage
             FROM order_items oi
             JOIN products p ON oi.product_id = p.id
             WHERE oi.order_id = ?`,
            [orderId]
        );
        res.json({ order: order[0], items });
    } catch (error) {
        console.error('[Order] getOrderById error:', error.message);
        res.status(500).json({ message: 'Gagal mengambil detail pesanan' });
    }
};

module.exports = { createOrder, handleNotification, getMyOrders, getOrderById };
