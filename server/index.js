// server/index.js (Versi Baru dengan MySQL)

const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise'); // Menggunakan mysql2/promise

const app = express();
const PORT = 5000;

// --- KONEKSI DATABASE ---
const pool = mysql.createPool({
    host: 'localhost',      // Alamat server MySQL
    user: 'root',           // User default XAMPP
    password: '',           // Password default XAMPP (kosong)
    database: 'toko_baju_db', // Nama database yang kita buat
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
// -------------------------

// Middleware
app.use(cors());
app.use(express.json());

// --- API ENDPOINTS (Sekarang Menggunakan Database) ---

// Endpoint untuk mendapatkan semua produk
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products');

        // Mengubah string 'S,M,L' menjadi array ['S', 'M', 'L']
        const products = rows.map(product => ({
            ...product,
            sizes: product.sizes ? product.sizes.split(',') : []
        }));

        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Gagal mengambil data produk' });
    }
});

// Endpoint untuk mendapatkan satu produk berdasarkan ID
app.get('/api/products/:id', async (req, res) => {
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
});

// Endpoint untuk "Checkout" (simulasi)
// Di masa depan, ini bisa menyimpan data ke tabel `orders`
app.post('/api/checkout', (req, res) => {
    const { userDetails, cartItems } = req.body;
    console.log('--- PESANAN DITERIMA (akan disimpan ke DB) ---');
    console.log('Detail Pelanggan:', userDetails);
    console.log('Item yang Dipesan:', cartItems);
    console.log('-------------------------------------------');
    res.status(200).json({ message: 'Pesanan berhasil diterima! Kami akan segera memprosesnya.' });
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT} dan terhubung ke MySQL.`);
});