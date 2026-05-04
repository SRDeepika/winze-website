const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();

// IMPORTANT: These must be in this order
app.use(cors());
app.use(express.json());  // This parses JSON bodies
app.use(express.urlencoded({ extended: true }));  // This parses form data

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'click_analytics'
});

// Connect to database
db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        process.exit(1);
    }
    console.log('✅ Connected to database:', process.env.DB_NAME || 'click_analytics');
});

// Health check endpoint
app.get('/api/health', (req, res) => {
    db.query('SELECT 1 as health', (err) => {
        if (err) {
            res.json({ status: 'error', message: err.message });
        } else {
            res.json({ status: 'ok', database: 'click_analytics', table: 'clicks' });
        }
    });
});

// Track click endpoint - FIXED VERSION
app.post('/api/track', (req, res) => {
    console.log('Received body:', req.body);  // Debug log
    
    const { link_url, link_title, ip_address } = req.body;
    
    // Check if data is received
    if (!link_url || !link_title) {
        return res.status(400).json({ 
            success: false, 
            error: 'Missing required fields: link_url and link_title are required' 
        });
    }
    
    console.log('📊 Tracking click:', link_title);
    
    const query = 'INSERT INTO clicks (link_url, link_title, ip_address) VALUES (?, ?, ?)';
    db.query(query, [link_url, link_title, ip_address || '127.0.0.1'], (err, result) => {
        if (err) {
            console.error('❌ Insert error:', err);
            res.status(500).json({ success: false, error: err.message });
        } else {
            console.log('✅ Click tracked! ID:', result.insertId);
            res.json({ success: true, message: 'Click tracked!', id: result.insertId });
        }
    });
});

// Get all clicks endpoint
app.get('/api/clicks', (req, res) => {
    db.query('SELECT * FROM clicks ORDER BY clicked_at DESC', (err, results) => {
        if (err) {
            console.error('❌ Query error:', err);
            res.status(500).json({ success: false, error: err.message });
        } else {
            res.json({ success: true, clicks: results, total: results.length });
        }
    });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Available endpoints:`);
    console.log(`   GET  http://localhost:${PORT}/api/health`);
    console.log(`   POST http://localhost:${PORT}/api/track`);
    console.log(`   GET  http://localhost:${PORT}/api/clicks`);
    console.log(`\n✅ Ready to track clicks!\n`);
});