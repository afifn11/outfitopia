// server/routes/wishlistRoutes.js
const express  = require('express');
const router   = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getWishlist, addToWishlist, removeFromWishlist, checkWishlist } = require('../controllers/wishlistController');

router.use(protect); // semua wishlist routes butuh login

router.get('/',                  getWishlist);
router.post('/:productId',       addToWishlist);
router.delete('/:productId',     removeFromWishlist);
router.get('/check/:productId',  checkWishlist);

module.exports = router;
