// server/routes/aiRoutes.js
const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');
const { chat, analyzeProducts } = require('../controllers/aiController');

router.post('/chat', chat);                            // public — anyone can chat
router.get('/analyze', protect, isAdmin, analyzeProducts); // admin only

module.exports = router;
