// server/controllers/aiController.js
require('dotenv').config();
const pool = require('../config/db');

// ── AI Fashion Assistant chat ─────────────────────────────────────────────────
const chat = async (req, res) => {
    const { message, history = [] } = req.body;
    if (!message?.trim())
        return res.status(400).json({ message: 'Pesan tidak boleh kosong' });
    if (!process.env.GEMINI_API_KEY)
        return res.status(503).json({ message: 'AI service belum dikonfigurasi. Tambahkan GEMINI_API_KEY di .env' });

    try {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const [products] = await pool.query(
            'SELECT name, price FROM products WHERE is_featured = 1 LIMIT 12'
        );
        const productList = products.map(p =>
            `- ${p.name} (Rp ${Number(p.price).toLocaleString('id-ID')})`
        ).join('\n');

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

        const chatHistory = [
            {
                role: 'user', parts: [{ text:
                    `Kamu adalah asisten fashion personal Outfitopia yang ramah dan berpengetahuan luas.\n\nProduk unggulan saat ini:\n${productList}\n\nAturan: Jawab dalam Bahasa Indonesia, maksimal 3 paragraf, fokus fashion & produk Outfitopia.`
                }]
            },
            {
                role: 'model', parts: [{ text: 'Halo! Saya asisten fashion Outfitopia. Ada yang bisa saya bantu?' }]
            },
            ...history.slice(-10).map(h => ({
                role: h.role === 'user' ? 'user' : 'model',
                parts: [{ text: h.content }],
            })),
        ];

        const chatSession = model.startChat({ history: chatHistory });
        const result = await chatSession.sendMessage(message);
        res.json({ reply: result.response.text() });

    } catch (err) {
        console.error('[AI Chat] Error:', err.message);
        res.status(500).json({ message: 'AI sedang tidak tersedia. Coba lagi nanti.' });
    }
};

// ── AI Product Analysis (admin only) ─────────────────────────────────────────
const analyzeProducts = async (req, res) => {
    if (!process.env.GEMINI_API_KEY)
        return res.status(503).json({ message: 'Tambahkan GEMINI_API_KEY di server/.env' });

    try {
        const { GoogleGenerativeAI } = require('@google/generative-ai');
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const [products] = await pool.query(`
            SELECT p.name, p.price, p.average_rating, p.num_reviews,
                   COALESCE(SUM(oi.quantity), 0) as total_sold
            FROM products p
            LEFT JOIN order_items oi ON p.id = oi.product_id
            GROUP BY p.id
            ORDER BY total_sold DESC
            LIMIT 20
        `);

        const [orderStats] = await pool.query(`
            SELECT
                COUNT(*) as total_orders,
                SUM(CASE WHEN status='Completed' THEN total_amount ELSE 0 END) as revenue,
                SUM(CASE WHEN status='Pending' THEN 1 ELSE 0 END) as pending_count
            FROM orders
        `);

        const stats = orderStats[0];
        const topProducts = products.slice(0, 5);
        const lowProducts = products.filter(p => Number(p.total_sold) < 2).slice(0, 3);

        const prompt = `Kamu adalah konsultan bisnis e-commerce fashion. Analisis data toko berikut dan berikan 3 insight bisnis yang actionable dalam format JSON.

Data Toko Outfitopia:
- Total Pesanan: ${stats.total_orders}
- Revenue (Completed): Rp ${Number(stats.revenue || 0).toLocaleString('id-ID')}
- Pesanan Pending: ${stats.pending_count}
- Top Produk: ${topProducts.map(p => `${p.name} (${p.total_sold} terjual, ⭐${p.average_rating})`).join(', ')}
- Produk Kurang Laku: ${lowProducts.map(p => p.name).join(', ') || 'Tidak ada'}

Berikan response HANYA dalam format JSON array berikut, tanpa teks lain:
[{"title":"...","insight":"...","action":"...","type":"success|warning|info"}]`;

        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent(prompt);
        const text = result.response.text();

        let insights = [];
        try {
            const cleaned = text.replace(/```json|```/g, '').trim();
            insights = JSON.parse(cleaned);
        } catch {
            insights = [{ title: 'Analisis Selesai', insight: text.substring(0, 200), action: 'Lihat detail di atas', type: 'info' }];
        }

        res.json({ insights, stats });
    } catch (err) {
        console.error('[AI Analyze] Error:', err.message);
        res.status(500).json({ message: 'Gagal menganalisis: ' + err.message });
    }
};

module.exports = { chat, analyzeProducts };
