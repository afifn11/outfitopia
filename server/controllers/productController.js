// /server/controllers/productController.js
const pool = require('../config/db');

const getAllProducts = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products');

        const products = rows.map(product => ({
            ...product,
            sizes: product.sizes ? product.sizes.split(',') : []
        }));

        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Gagal mengambil data produk' });
    }
};

const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);

        if (rows.length > 0) {
            const product = {
                ...rows[0],
                sizes: rows[0].sizes ? rows[0].sizes.split(',') : []
            };
            res.json(product);
        } else {
            res.status(404).json({ message: 'Produk tidak ditemukan' });
        }
    } catch (error) {
        console.error(`Error fetching product with id ${req.params.id}:`, error);
        res.status(500).json({ message: 'Gagal mengambil data produk' });
    }
};

module.exports = {
    getAllProducts,
    getProductById,
};