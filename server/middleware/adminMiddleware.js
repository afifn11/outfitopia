// /server/middleware/adminMiddleware.js
const isAdmin = (req, res, next) => {
    // Middleware ini harus dijalankan setelah middleware 'protect'
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ message: 'Not authorized as an admin' }); // 403 Forbidden
    }
};

module.exports = { isAdmin };