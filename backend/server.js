const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const bcrypt = require('bcrypt');
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

        // Insert default social links if empty
        const socialResult = await db.query('SELECT COUNT(*) FROM social_links');
        if (parseInt(socialResult.rows[0].count) === 0) {
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

        // Create admins table for authentication
        await db.query(`
            CREATE TABLE IF NOT EXISTS admins (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ admins table ready');

        // Check if default admin exists
        const adminResult = await db.query('SELECT COUNT(*) FROM admins');
        if (parseInt(adminResult.rows[0].count) === 0) {
            const saltRounds = 10;
            const hashedPassword = await bcrypt.hash('Winze@2026', saltRounds);
            await db.query(
                'INSERT INTO admins (username, password_hash) VALUES ($1, $2)',
                ['admin', hashedPassword]
            );
            console.log('✅ Default admin created (username: admin, password: Winze@2026)');
        }

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
        endpoints: ['/api/health', '/api/social-links', '/api/track', '/api/clicks', '/api/clicks/stats', '/api/admin/login'] 
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

// POST - Add new social link (Admin only - no auth check for now)
app.post('/api/social-links', async (req, res) => {
    const { platform_name, platform_url, icon_class, color_code, display_order, is_active } = req.body;
    
    try {
        const query = `INSERT INTO social_links (platform_name, platform_url, icon_class, color_code, display_order, is_active) 
                       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
        const result = await db.query(query, [
            platform_name, 
            platform_url, 
            icon_class, 
            color_code, 
            display_order || 0, 
            is_active !== undefined ? is_active : 1
        ]);
        res.status(201).json({ id: result.rows[0].id, message: 'Link added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// PUT - Update social link
app.put('/api/social-links/:id', async (req, res) => {
    const { platform_name, platform_url, icon_class, color_code, display_order, is_active } = req.body;
    
    try {
        const query = `UPDATE social_links 
                       SET platform_name = $1, platform_url = $2, icon_class = $3, 
                           color_code = $4, display_order = $5, is_active = $6
                       WHERE id = $7`;
        await db.query(query, [platform_name, platform_url, icon_class, color_code, display_order, is_active, req.params.id]);
        res.json({ message: 'Link updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// DELETE - Remove social link
app.delete('/api/social-links/:id', async (req, res) => {
    try {
        const query = 'DELETE FROM social_links WHERE id = $1';
        await db.query(query, [req.params.id]);
        res.json({ message: 'Link deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error', details: err.message });
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

// ========== ADMIN AUTHENTICATION ROUTES ==========

// Login endpoint
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ success: false, error: 'Username and password required' });
    }
    
    try {
        const result = await db.query('SELECT * FROM admins WHERE username = $1', [username]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        
        const admin = result.rows[0];
        const validPassword = await bcrypt.compare(password, admin.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }
        
        // Don't send password hash back
        delete admin.password_hash;
        res.json({ success: true, admin: { id: admin.id, username: admin.username } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Change password endpoint
app.post('/api/admin/change-password', async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;
    
    if (!username || !oldPassword || !newPassword) {
        return res.status(400).json({ success: false, error: 'All fields required' });
    }
    
    if (newPassword.length < 6) {
        return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }
    
    try {
        const result = await db.query('SELECT * FROM admins WHERE username = $1', [username]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, error: 'User not found' });
        }
        
        const admin = result.rows[0];
        const validPassword = await bcrypt.compare(oldPassword, admin.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ success: false, error: 'Current password is incorrect' });
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE admins SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE username = $2', 
            [hashedPassword, username]);
        
        res.json({ success: true, message: 'Password changed successfully' });
    } catch (err) {
        console.error('Change password error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// Create new admin (for super admin)
app.post('/api/admin/create', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ success: false, error: 'Username and password required' });
    }
    
    if (password.length < 6) {
        return res.status(400).json({ success: false, error: 'Password must be at least 6 characters' });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await db.query('INSERT INTO admins (username, password_hash) VALUES ($1, $2)', 
            [username, hashedPassword]);
        
        res.json({ success: true, message: 'Admin created successfully' });
    } catch (err) {
        if (err.code === '23505') { // Unique violation
            res.status(400).json({ success: false, error: 'Username already exists' });
        } else {
            console.error('Create admin error:', err);
            res.status(500).json({ success: false, error: 'Server error' });
        }
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
    console.log(`📡 Endpoints ready: /api/health, /api/social-links, /api/track, /api/clicks, /api/admin/login`);
});