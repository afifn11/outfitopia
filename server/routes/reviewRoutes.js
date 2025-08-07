// /server/routes/reviewRoutes.js
const express = require('express');
const router = express.Router();
const { getProductReviews, createProductReview } = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.get('/product/:id', getProductReviews);
router.post('/product/:id', protect, createProductReview);

module.exports = router;