const express = require('express');
const router = express.Router();
const { 
    getAllProducts, 
    getProductById,
    getFeaturedProducts,
    getBestsellingProducts
} = require('../controllers/productController');

// Urutan penting: Rute yang lebih spesifik ('featured', 'bestsellers') harus sebelum rute dinamis ('/:id')
router.get('/featured', getFeaturedProducts);
router.get('/bestsellers', getBestsellingProducts);
router.get('/', getAllProducts);
router.get('/:id', getProductById);

module.exports = router;