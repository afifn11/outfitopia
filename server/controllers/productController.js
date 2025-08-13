const pool = require('../config/db');

const getAllProducts = async (req, res) => {
    try {
        // Ambil page dan limit dari query, beri nilai default
        const { search, sortBy, order, category, page = 1, limit = 12 } = req.query;

        // --- Logika Pagination ---
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);
        const offset = (pageNum - 1) * limitNum;

        // Query untuk menghitung total produk yang cocok dengan filter
        let countSql = `
            SELECT COUNT(DISTINCT p.id) as total
            FROM products p
            LEFT JOIN product_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON pc.category_id = c.id
        `;
        
        // Query utama untuk mengambil data produk pada halaman tertentu
        let dataSql = `
            SELECT DISTINCT p.* FROM products p
            LEFT JOIN product_categories pc ON p.id = pc.product_id
            LEFT JOIN categories c ON pc.category_id = c.id
        `;
        
        const params = [];
        let whereClauses = [];

        if (search) {
            whereClauses.push('p.name LIKE ?');
            params.push(`%${search}%`);
        }

        if (category) {
            whereClauses.push('c.name = ?');
            params.push(category);
        }

        if (whereClauses.length > 0) {
            const whereString = ' WHERE ' + whereClauses.join(' AND ');
            countSql += whereString;
            dataSql += whereString;
        }

        // Jalankan query hitung total terlebih dahulu
        const [countRows] = await pool.query(countSql, params);
        const totalProducts = countRows[0].total;
        const totalPages = Math.ceil(totalProducts / limitNum);

        // Tambahkan ORDER BY dan LIMIT ke query untuk mengambil data
        const allowedSortBy = ['name', 'price'];
        const sortKey = allowedSortBy.includes(sortBy) ? `p.${sortBy}` : 'p.name';
        const sortOrder = (order && order.toUpperCase() === 'DESC') ? 'DESC' : 'ASC';
        dataSql += ` ORDER BY ${sortKey} ${sortOrder} LIMIT ? OFFSET ?`;
        
        // Buat parameter baru untuk query data
        const dataParams = [...params, limitNum, offset];

        // Jalankan query untuk mengambil data produk
        const [rows] = await pool.query(dataSql, dataParams);
        
        const products = rows.map(product => ({
            ...product,
            sizes: product.sizes ? product.sizes.split(',') : []
        }));

        // Kirim response dalam bentuk objek yang berisi data dan info pagination
        res.json({
            products,
            currentPage: pageNum,
            totalPages,
            totalProducts
        });

    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Gagal mengambil data produk' });
    }
};

const getProductById = async (req, res) => {
    const { id } = req.params;
    const connection = await pool.getConnection();
    try {
        const [productRows] = await connection.query('SELECT * FROM products WHERE id = ?', [id]);
        if (productRows.length === 0) {
            return res.status(404).json({ message: 'Produk tidak ditemukan' });
        }
        
        const [categoryRows] = await connection.query(`
            SELECT c.id, c.name FROM categories c
            JOIN product_categories pc ON c.id = pc.category_id
            WHERE pc.product_id = ?
        `, [id]);

        const product = {
            ...productRows[0],
            sizes: productRows[0].sizes ? productRows[0].sizes.split(',') : [],
            categories: categoryRows
        };
        
        res.json(product);
    } catch (error) {
        console.error(`Error fetching product with id ${id}:`, error);
        res.status(500).json({ message: 'Gagal mengambil data produk' });
    } finally {
        if (connection) connection.release();
    }
};

const getFeaturedProducts = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products WHERE is_featured = 1 LIMIT 8');
        const products = rows.map(p => ({ ...p, sizes: p.sizes ? p.sizes.split(',') : [] }));
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getBestsellingProducts = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT p.*, SUM(oi.quantity) as total_sold
            FROM order_items oi
            JOIN products p ON oi.product_id = p.id
            GROUP BY p.id
            ORDER BY total_sold DESC
            LIMIT 8
        `);
        const products = rows.map(p => ({ ...p, sizes: p.sizes ? p.sizes.split(',') : [] }));
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


module.exports = {
    getAllProducts,
    getProductById,
    getFeaturedProducts,
    getBestsellingProducts,
};