// /server/controllers/categoryController.js
const pool = require('../config/db');

exports.getAllCategories = async (req, res) => {
    try {
        const [categories] = await pool.query('SELECT * FROM categories ORDER BY name ASC');
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};