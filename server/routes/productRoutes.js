// /server/routes/productRoutes.js
const express = require('express');
const { getAllProducts, getProductById } = require('../controllers/productController');

const router = express.Router();

// Rute untuk GET /api/products/
router.get('/', getAllProducts);

// Rute untuk GET /api/products/:id
router.get('/:id', getProductById);

module.exports = router;