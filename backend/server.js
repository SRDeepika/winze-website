const express = require('express');
const cors = require('cors');
const db = require('./config/database');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Create tables on startup
const initDatabase = async () => {
    try {
        // Create social_links table
        await db.query(`
            CREATE TABLE IF NOT EXISTS social_links (
                id SERIAL PRIMARY KEY,
                platform_name VARCHAR(50) NOT NULL,
                platform_url VARCHAR(255) NOT NULL,
                icon_class VARCHAR(50) NOT NULL,
                color_code VARCHAR(20) NOT NULL,
                display_order INT DEFAULT 0,
                is_active INT DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ social_links table ready');

        // Insert default data if empty
        const result = await db.query('SELECT COUNT(*) FROM social_links');
        if (parseInt(result.rows[0].count) === 0) {
            await db.query(`
                INSERT INTO social_links (platform_name, platform_url, icon_class, color_code, display_order) VALUES
                ('LinkedIn', 'https://www.linkedin.com/company/winze-technologies', 'faLinkedin', '#0077b5', 1),
                ('WhatsApp', 'https://wa.me/919880010417', 'faWhatsapp', '#25D366', 2),
                ('Facebook', 'https://www.facebook.com/winzetechnologies', 'faFacebook', '#1877f2', 3),
                ('Instagram', 'https://www.instagram.com/winzetechnologies', 'faInstagram', '#e4405f', 4)
            `);
            console.log('✅ Default social links inserted');
        }

        // Create clicks table
        await db.query(`
            CREATE TABLE IF NOT EXISTS clicks (
                id SERIAL PRIMARY KEY,
                link_url VARCHAR(255) NOT NULL,
                link_title VARCHAR(255) NOT NULL,
                ip_address VARCHAR(45),
                clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ clicks table ready');

    } catch (err) {
        console.error('Database init error:', err.message);
    }
};

initDatabase();

// ========== API ENDPOINTS ==========

// Root
app.get('/', (req, res) => {
    res.json({ 
        message: 'Winze API is running', 
        endpoints: ['/api/health', '/api/social-links', '/api/track', '/api/clicks', '/api/clicks/stats'] 
    });
});

// Health check
app.get('/api/health', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW() as time');
        res.json({ status: 'ok', database: 'PostgreSQL', time: result.rows[0].time });
    } catch (err) {
        res.json({ status: 'error', message: err.message });
    }
});

// GET all social links
app.get('/api/social-links', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM social_links WHERE is_active = 1 ORDER BY display_order');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching social links:', err);
        res.status(500).json({ error: err.message });
    }
});

// POST - Track click
app.post('/api/track', async (req, res) => {
    const { link_url, link_title, ip_address } = req.body;
    
    if (!link_url || !link_title) {
        return res.status(400).json({ 
            success: false, 
            error: 'Missing required fields: link_url and link_title are required' 
        });
    }
    
    try {
        const result = await db.query(
            'INSERT INTO clicks (link_url, link_title, ip_address) VALUES ($1, $2, $3) RETURNING id',
            [link_url, link_title, ip_address || '0.0.0.0']
        );
        res.json({ success: true, id: result.rows[0].id });
    } catch (err) {
        console.error('Error tracking click:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET all clicks
app.get('/api/clicks', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM clicks ORDER BY clicked_at DESC');
        res.json({ success: true, clicks: result.rows, total: result.rows.length });
    } catch (err) {
        console.error('Error fetching clicks:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// GET click statistics
app.get('/api/clicks/stats', async (req, res) => {
    try {
        const totalResult = await db.query('SELECT COUNT(*) as count FROM clicks');
        const todayResult = await db.query("SELECT COUNT(*) as count FROM clicks WHERE DATE(clicked_at) = CURRENT_DATE");
        
        res.json({ 
            success: true, 
            stats: {
                total: parseInt(totalResult.rows[0].count),
                today: parseInt(todayResult.rows[0].count)
            }
        });
    } catch (err) {
        console.error('Error getting stats:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Debug endpoint
app.get('/api/debug-db', async (req, res) => {
    res.json({
        database_url_exists: !!process.env.DATABASE_URL,
        postgres_connected: true,
        environment: process.env.NODE_ENV || 'development'
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`✅ Database: PostgreSQL`);
    console.log(`📡 Endpoints ready: /api/health, /api/social-links, /api/track, /api/clicks`);
});