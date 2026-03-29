// server/routes/uploadRoutes.js
const express  = require('express');
const router   = express.Router();
const { protect }   = require('../middleware/authMiddleware');
const { isAdmin }   = require('../middleware/adminMiddleware');
const upload        = require('../middleware/uploadMiddleware');
const { uploadImage } = require('../controllers/uploadController');

// POST /api/upload/image — admin only
router.post('/image', protect, isAdmin, upload.single('image'), (err, req, res, next) => {
    // Multer error handler
    if (err) return res.status(400).json({ message: err.message });
    next();
}, uploadImage);

module.exports = router;
