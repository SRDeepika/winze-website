const express = require('express');
const cors = require('cors');
const db = require('./config/database');
require('dotenv').config();

const app = express();

// IMPORTANT: These must be in this order
app.use(cors());
app.use(express.json());  // This parses JSON bodies
app.use(express.urlencoded({ extended: true }));  // This parses form data

// ========== AUTO-CREATE SOCIAL LINKS TABLE ON STARTUP ==========
// This runs once when the backend starts
const createSocialLinksTable = async () => {
    try {
        // Create table if it doesn't exist (PostgreSQL syntax)
        const createTableQuery = `
            CREATE TABLE IF NOT EXISTS social_links (
                id SERIAL PRIMARY KEY,
                platform_name VARCHAR(50) NOT NULL,
                platform_url VARCHAR(255) NOT NULL,
                icon_class VARCHAR(50) NOT NULL,
                color_code VARCHAR(20) NOT NULL,
                display_order INT DEFAULT 0,
                is_active SMALLINT DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `;
        
        await db.query(createTableQuery);
        console.log('✅ social_links table ready');
        
        // Check if table is empty
        const [rows] = await db.query('SELECT COUNT(*) as count FROM social_links');
        
        if (rows[0].count === 0) {
            // Insert default social links
            const insertQuery = `
                INSERT INTO social_links (platform_name, platform_url, icon_class, color_code, display_order, is_active) VALUES
                ('LinkedIn', 'https://www.linkedin.com/company/winze-technologies', 'faLinkedin', '#0077b5', 1, 1),
                ('WhatsApp', 'https://wa.me/919880010417', 'faWhatsapp', '#25D366', 2, 1),
                ('Facebook', 'https://www.facebook.com/winzetechnologies', 'faFacebook', '#1877f2', 3, 1),
                ('Instagram', 'https://www.instagram.com/winzetechnologies', 'faInstagram', '#e4405f', 4, 1)
            `;
            await db.query(insertQuery);
            console.log('✅ Default social links inserted');
        }
    } catch (err) {
        console.error('❌ Error setting up social_links table:', err.message);
    }
};

// Call the function to create table on startup
createSocialLinksTable();

// ========== SOCIAL LINKS ROUTES ==========
// GET all active social links
app.get('/api/social-links', async (req, res) => {
    try {
        const query = 'SELECT * FROM social_links WHERE is_active = 1 ORDER BY display_order ASC';
        const [rows] = await db.query(query);
        res.json(rows);
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Database error' });
    }
});

// GET single social link by ID
app.get('/api/social-links/:id', async (req, res) => {
    try {
        const query = 'SELECT * FROM social_links WHERE id = ?';
        const [rows] = await db.query(query, [req.params.id]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Link not found' });
        }
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// POST - Add new social link
app.post('/api/social-links', async (req, res) => {
    const { platform_name, platform_url, icon_class, color_code, display_order, is_active } = req.body;
    
    try {
        const query = `INSERT INTO social_links (platform_name, platform_url, icon_class, color_code, display_order, is_active) 
                       VALUES (?, ?, ?, ?, ?, ?)`;
        const [result] = await db.query(query, [
            platform_name, 
            platform_url, 
            icon_class, 
            color_code, 
            display_order || 0, 
            is_active !== undefined ? is_active : 1
        ]);
        res.status(201).json({ id: result.insertId, message: 'Link added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// PUT - Update social link
app.put('/api/social-links/:id', async (req, res) => {
    const { platform_name, platform_url, icon_class, color_code, display_order, is_active } = req.body;
    
    try {
        const query = `UPDATE social_links 
                       SET platform_name = ?, platform_url = ?, icon_class = ?, 
                           color_code = ?, display_order = ?, is_active = ?
                       WHERE id = ?`;
        await db.query(query, [platform_name, platform_url, icon_class, color_code, display_order, is_active, req.params.id]);
        res.json({ message: 'Link updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// DELETE - Remove social link
app.delete('/api/social-links/:id', async (req, res) => {
    try {
        const query = 'DELETE FROM social_links WHERE id = ?';
        await db.query(query, [req.params.id]);
        res.json({ message: 'Link deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// ========== CLICK TRACKING ROUTES ==========
// Health check endpoint
app.get('/api/health', async (req, res) => {
    try {
        await db.query('SELECT 1 as health');
        res.json({ status: 'ok', database: process.env.DB_NAME, table: 'clicks', social_table: 'social_links' });
    } catch (err) {
        res.json({ status: 'error', message: err.message });
    }
});

// Track click endpoint
app.post('/api/track', async (req, res) => {
    console.log('Received body:', req.body);
    
    const { link_url, link_title, ip_address } = req.body;
    
    if (!link_url || !link_title) {
        return res.status(400).json({ 
            success: false, 
            error: 'Missing required fields: link_url and link_title are required' 
        });
    }
    
    console.log('📊 Tracking click:', link_title);
    
    try {
        const query = 'INSERT INTO clicks (link_url, link_title, ip_address) VALUES (?, ?, ?)';
        const [result] = await db.query(query, [link_url, link_title, ip_address || '127.0.0.1']);
        console.log('✅ Click tracked! ID:', result.insertId);
        res.json({ success: true, message: 'Click tracked!', id: result.insertId });
    } catch (err) {
        console.error('❌ Insert error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get all clicks endpoint
app.get('/api/clicks', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM clicks ORDER BY clicked_at DESC');
        res.json({ success: true, clicks: rows, total: rows.length });
    } catch (err) {
        console.error('❌ Query error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get click statistics
app.get('/api/clicks/stats', async (req, res) => {
    try {
        const [total] = await db.query('SELECT COUNT(*) as total FROM clicks');
        const [unique] = await db.query('SELECT COUNT(DISTINCT link_title) as unique_links FROM clicks');
        const [today] = await db.query('SELECT COUNT(*) as today FROM clicks WHERE DATE(clicked_at) = CURDATE()');
        
        res.json({
            success: true,
            stats: {
                total: total[0].total,
                uniqueLinks: unique[0].unique_links,
                last24Hours: today[0].today
            }
        });
    } catch (err) {
        console.error('❌ Stats error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Available endpoints:`);
    console.log(`   GET  http://localhost:${PORT}/api/health`);
    console.log(`   POST http://localhost:${PORT}/api/track`);
    console.log(`   GET  http://localhost:${PORT}/api/clicks`);
    console.log(`   GET  http://localhost:${PORT}/api/clicks/stats`);
    console.log(`   GET  http://localhost:${PORT}/api/social-links`);
    console.log(`   POST http://localhost:${PORT}/api/social-links`);
    console.log(`   PUT  http://localhost:${PORT}/api/social-links/:id`);
    console.log(`   DEL  http://localhost:${PORT}/api/social-links/:id`);
    console.log(`\n✅ Ready to track clicks and manage social links!\n`);
});