// /server/controllers/adminController.js - KODE LENGKAP DENGAN PERBAIKAN

const pool = require('../config/db');
const { sendEmail, orderStatusEmail } = require('../utils/emailService');

// === HELPER FUNCTIONS ===

// Helper function untuk mengelola asosiasi kategori produk
const updateProductCategories = async (connection, productId, categoryIds = []) => {
    try {
        // 1. Hapus semua asosiasi kategori lama untuk produk ini
        await connection.query('DELETE FROM product_categories WHERE product_id = ?', [productId]);
        
        // 2. Jika ada kategori baru yang dipilih, masukkan asosiasi yang baru
        if (categoryIds && categoryIds.length > 0) {
            const values = categoryIds.map(categoryId => [productId, categoryId]);
            await connection.query('INSERT INTO product_categories (product_id, category_id) VALUES ?', [values]);
        }
    } catch (error) {
        console.error('Error updating product categories:', error);
        throw error;
    }
};

// Helper function untuk memformat harga konsisten
const formatPrice = (price) => {
    const numberPrice = typeof price === 'string' ? parseFloat(price) : price;
    if (isNaN(numberPrice)) {
        return 'Rp 0';
    }
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(numberPrice);
};

// === PRODUCT MANAGEMENT ===

exports.createProduct = async (req, res) => {
    const { name, price, description, image, sizes, is_featured, category_ids } = req.body;
    
    // Validasi input
    if (!name || !price || !description || !image) {
        return res.status(400).json({ message: 'Nama, harga, deskripsi, dan gambar produk wajib diisi' });
    }

    if (price <= 0) {
        return res.status(400).json({ message: 'Harga produk harus lebih dari 0' });
    }

    const sizesString = Array.isArray(sizes) ? sizes.join(',') : (sizes || '');
    
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Masukkan data ke tabel products
        const [result] = await connection.query(
            'INSERT INTO products (name, price, description, image, sizes, is_featured) VALUES (?, ?, ?, ?, ?, ?)',
            [name, price, description, image, sizesString, is_featured || false]
        );
        const productId = result.insertId;

        // Gunakan helper function untuk menyimpan kategori
        await updateProductCategories(connection, productId, category_ids);

        await connection.commit();
        
        res.status(201).json({ 
            message: 'Produk berhasil ditambahkan',
            id: productId, 
            ...req.body 
        });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Create product error:", error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Nama produk sudah ada' });
        }
        
        res.status(500).json({ message: 'Terjadi kesalahan server saat menambahkan produk' });
    } finally {
        if (connection) connection.release();
    }
};

exports.updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, price, description, image, sizes, is_featured, category_ids } = req.body;
    
    // Validasi input
    if (!name || !price || !description || !image) {
        return res.status(400).json({ message: 'Nama, harga, deskripsi, dan gambar produk wajib diisi' });
    }

    if (price <= 0) {
        return res.status(400).json({ message: 'Harga produk harus lebih dari 0' });
    }

    const sizesString = Array.isArray(sizes) ? sizes.join(',') : (sizes || '');

    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Cek apakah produk exists
        const [existingProduct] = await connection.query('SELECT id FROM products WHERE id = ?', [id]);
        if (existingProduct.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Produk tidak ditemukan' });
        }

        // Update data di tabel products
        await connection.query(
            'UPDATE products SET name = ?, price = ?, description = ?, image = ?, sizes = ?, is_featured = ? WHERE id = ?',
            [name, price, description, image, sizesString, is_featured || false, id]
        );

        // Gunakan helper function untuk memperbarui kategori
        await updateProductCategories(connection, id, category_ids);
        
        await connection.commit();
        res.json({ message: 'Produk berhasil diperbarui' });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Update product error:", error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Nama produk sudah ada' });
        }
        
        res.status(500).json({ message: 'Terjadi kesalahan server saat memperbarui produk' });
    } finally {
        if (connection) connection.release();
    }
};

exports.deleteProduct = async (req, res) => {
    const { id } = req.params;
    
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Cek apakah produk exists
        const [existingProduct] = await connection.query('SELECT name FROM products WHERE id = ?', [id]);
        if (existingProduct.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Produk tidak ditemukan' });
        }

        // Hapus asosiasi kategori terlebih dahulu
        await connection.query('DELETE FROM product_categories WHERE product_id = ?', [id]);
        
        // Hapus produk
        await connection.query('DELETE FROM products WHERE id = ?', [id]);
        
        await connection.commit();
        res.json({ message: 'Produk berhasil dihapus' });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error("Delete product error:", error);
        
        if (error.code === 'ER_ROW_IS_REFERENCED_2') {
            return res.status(400).json({ 
                message: 'Tidak dapat menghapus produk yang sudah menjadi bagian dari pesanan atau ulasan.' 
            });
        }
        
        res.status(500).json({ message: 'Terjadi kesalahan server saat menghapus produk' });
    } finally {
        if (connection) connection.release();
    }
};

// === ORDER MANAGEMENT ===

exports.getAllOrders = async (req, res) => {
    try {
        const [orders] = await pool.query(`
            SELECT 
                o.*, 
                u.name as userName, 
                u.email as userEmail 
            FROM orders o 
            JOIN users u ON o.user_id = u.id 
            ORDER BY o.order_date DESC
        `);
        
        // Format harga untuk setiap order
        const formattedOrders = orders.map(order => ({
            ...order,
            formatted_total: formatPrice(order.total_amount)
        }));
        
        res.json(formattedOrders);
    } catch (error) {
        console.error('Get all orders error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server saat mengambil data pesanan' });
    }
};

exports.updateOrderStatus = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    
    // Validasi status
    const validStatuses = ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Status tidak valid' });
    }
    
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Cek apakah order exists
        const [existingOrder] = await connection.query('SELECT id, status FROM orders WHERE id = ?', [id]);
        if (existingOrder.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Pesanan tidak ditemukan' });
        }

        // Cek apakah status berubah
        if (existingOrder[0].status === status) {
            await connection.rollback();
            return res.status(400).json({ message: 'Status pesanan sudah sama' });
        }

        // 1. Update status pesanan di database
        await connection.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
        
        // 2. Dapatkan email dan nama pelanggan dari pesanan yang diupdate
        const [orders] = await connection.query(`
            SELECT 
                o.id, 
                o.total_amount,
                u.email, 
                u.name 
            FROM orders o 
            JOIN users u ON o.user_id = u.id 
            WHERE o.id = ?
        `, [id]);

        await connection.commit();

        // 3. Kirim email notification (tidak memblok response)
        if (orders.length > 0) {
            const customer = orders[0];
            
            // Kirim email status update (non-blocking)
            orderStatusEmail({
                to:      customer.email,
                name:    customer.name,
                orderId: id,
                status,
                total:   customer.total_amount,
            }).catch(e => console.error(`[Email] Order status failed for #${id}:`, e.message));
        }
        
        res.json({ message: 'Status pesanan berhasil diperbarui' });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Update order status error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server saat memperbarui status pesanan' });
    } finally {
        if (connection) connection.release();
    }
};

// Helper function untuk generate email content
const generateOrderStatusEmail = (status, customer) => {
    const statusMessages = {
        'Pending': {
            title: 'Pesanan Diterima',
            message: 'Pesanan Anda telah diterima dan sedang diproses.',
            color: '#f59e0b'
        },
        'Shipped': {
            title: 'Pesanan Sedang Dikirim',
            message: 'Pesanan Anda sedang dalam perjalanan! Kami akan segera memberikan nomor resi jika tersedia.',
            color: '#3b82f6'
        },
        'Completed': {
            title: 'Pesanan Selesai',
            message: 'Pesanan Anda telah selesai. Jangan ragu untuk memberikan ulasan produk di halaman profil Anda. Terima kasih telah berbelanja!',
            color: '#10b981'
        },
        'Cancelled': {
            title: 'Pesanan Dibatalkan',
            message: 'Pesanan Anda telah dibatalkan. Jika ada pertanyaan, silakan hubungi customer service kami.',
            color: '#ef4444'
        }
    };

    const statusInfo = statusMessages[status] || statusMessages['Pending'];
    
    return `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0; font-size: 24px;">TokoBaju</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Update Status Pesanan</p>
            </div>
            
            <div style="padding: 30px; background: #ffffff;">
                <h2 style="color: ${statusInfo.color}; margin-top: 0;">${statusInfo.title}</h2>
                <p>Halo, <strong>${customer.name}</strong>,</p>
                <p>Ada pembaruan untuk pesanan Anda dengan nomor <strong>#${customer.id}</strong>.</p>
                
                <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${statusInfo.color};">
                    <p style="margin: 0; font-size: 16px;"><strong>Status Terbaru:</strong></p>
                    <p style="font-size: 18px; font-weight: bold; color: ${statusInfo.color}; margin: 5px 0 0 0;">${status}</p>
                </div>
                
                <p>${statusInfo.message}</p>
                
                <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin: 0; font-size: 14px; color: #64748b;"><strong>Total Pesanan:</strong> ${formatPrice(customer.total_amount)}</p>
                </div>
            </div>
            
            <div style="background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                <p style="margin: 0; font-size: 14px; color: #64748b;">
                    Salam hangat,<br>
                    <strong>Tim TokoBaju</strong>
                </p>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #94a3b8;">
                    Email ini dikirim otomatis, mohon tidak membalas email ini.
                </p>
            </div>
        </div>
    `;
};

// === REVIEW MANAGEMENT ===

exports.getAllReviews = async (req, res) => {
    try {
        const [reviews] = await pool.query(`
            SELECT 
                r.id, 
                r.rating, 
                r.comment, 
                r.created_at, 
                p.name as productName, 
                u.name as userName
            FROM reviews r
            JOIN products p ON r.product_id = p.id
            JOIN users u ON r.user_id = u.id
            ORDER BY r.created_at DESC
        `);
        res.json(reviews);
    } catch (error) {
        console.error('Get all reviews error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server saat mengambil data ulasan' });
    }
};

exports.deleteReview = async (req, res) => {
    const { id } = req.params;
    
    let connection;
    try {
        connection = await pool.getConnection();
        await connection.beginTransaction();

        // Ambil data review untuk mendapatkan product_id
        const [reviewData] = await connection.query('SELECT product_id, comment FROM reviews WHERE id = ?', [id]);
        if (reviewData.length === 0) {
            await connection.rollback();
            return res.status(404).json({ message: 'Ulasan tidak ditemukan' });
        }

        const { product_id } = reviewData[0];

        // Hapus review
        await connection.query('DELETE FROM reviews WHERE id = ?', [id]);

        // Update statistik produk (average_rating dan num_reviews)
        await connection.query(`
            UPDATE products p SET
            p.num_reviews = (SELECT COUNT(*) FROM reviews r WHERE r.product_id = ?),
            p.average_rating = COALESCE((SELECT AVG(r.rating) FROM reviews r WHERE r.product_id = ?), 0)
            WHERE p.id = ?
        `, [product_id, product_id, product_id]);

        await connection.commit();
        res.json({ message: 'Ulasan berhasil dihapus' });

    } catch (error) {
        if (connection) await connection.rollback();
        console.error('Delete review error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server saat menghapus ulasan' });
    } finally {
        if (connection) connection.release();
    }
};

// === DASHBOARD STATISTICS ===

exports.getDashboardStats = async (req, res) => {
    try {
        // Ambil semua statistik dalam satu transaksi
        const [productCount] = await pool.query('SELECT COUNT(*) as count FROM products');
        const [orderCount] = await pool.query('SELECT COUNT(*) as count FROM orders');
        const [reviewCount] = await pool.query('SELECT COUNT(*) as count FROM reviews');
        const [revenueData] = await pool.query(`
            SELECT SUM(total_amount) as total 
            FROM orders 
            WHERE status = 'Completed'
        `);
        
        // Order statistics by status
        const [orderStats] = await pool.query(`
            SELECT 
                status,
                COUNT(*) as count
            FROM orders 
            GROUP BY status
        `);

        // Recent orders
        const [recentOrders] = await pool.query(`
            SELECT 
                o.*, 
                u.name as userName, 
                u.email as userEmail 
            FROM orders o 
            JOIN users u ON o.user_id = u.id 
            ORDER BY o.order_date DESC 
            LIMIT 5
        `);

        // Recent reviews
        const [recentReviews] = await pool.query(`
            SELECT 
                r.id, 
                r.rating, 
                r.comment, 
                r.created_at, 
                p.name as productName, 
                u.name as userName
            FROM reviews r
            JOIN products p ON r.product_id = p.id
            JOIN users u ON r.user_id = u.id
            ORDER BY r.created_at DESC 
            LIMIT 5
        `);

        // Format order stats
        const orderStatsFormatted = {
            pending: 0,
            shipped: 0,
            completed: 0,
            cancelled: 0
        };

        orderStats.forEach(stat => {
            const statusKey = stat.status.toLowerCase();
            if (orderStatsFormatted.hasOwnProperty(statusKey)) {
                orderStatsFormatted[statusKey] = stat.count;
            }
        });

        res.json({
            totalProducts: productCount[0].count,
            totalOrders: orderCount[0].count,
            totalReviews: reviewCount[0].count,
            totalRevenue: revenueData[0].total || 0,
            orderStats: orderStatsFormatted,
            recentOrders: recentOrders.map(order => ({
                ...order,
                formatted_total: formatPrice(order.total_amount)
            })),
            recentReviews
        });

    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server saat mengambil statistik dashboard' });
    }
};

// === USER MANAGEMENT (BONUS) ===

exports.getAllUsers = async (req, res) => {
    try {
        const [users] = await pool.query(`
            SELECT 
                u.id,
                u.name,
                u.email,
                u.created_at,
                COUNT(DISTINCT o.id) as total_orders,
                COALESCE(SUM(CASE WHEN o.status = 'Completed' THEN o.total_amount ELSE 0 END), 0) as total_spent
            FROM users u
            LEFT JOIN orders o ON u.id = o.user_id
            WHERE u.role != 'admin'
            GROUP BY u.id, u.name, u.email, u.created_at
            ORDER BY u.created_at DESC
        `);

        const formattedUsers = users.map(user => ({
            ...user,
            formatted_total_spent: formatPrice(user.total_spent)
        }));

        res.json(formattedUsers);
    } catch (error) {
        console.error('Get all users error:', error);
        res.status(500).json({ message: 'Terjadi kesalahan server saat mengambil data pengguna' });
    }
};

// === ERROR HANDLING MIDDLEWARE ===

exports.handleNotFound = (req, res) => {
    res.status(404).json({ message: 'Endpoint tidak ditemukan' });
};

exports.handleServerError = (error, req, res, next) => {
    console.error('Server Error:', error);
    res.status(500).json({ 
        message: 'Terjadi kesalahan internal server',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
};

module.exports = exports;