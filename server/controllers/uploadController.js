// server/controllers/uploadController.js
const uploadImage = (req, res) => {
    if (!req.file)
        return res.status(400).json({ message: 'Tidak ada file yang diupload' });

    const baseUrl  = process.env.BACKEND_URL || `http://localhost:${process.env.PORT || 5000}`;
    const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;

    res.json({ message: 'Upload berhasil', imageUrl, filename: req.file.filename });
};

module.exports = { uploadImage };
