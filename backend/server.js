const express = require('express');
const cors = require('cors');
const db = require('./config/database');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// Simple health check
app.get('/api/health', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW() as time');
        res.json({ 
            status: 'ok', 
            database: 'PostgreSQL',
            time: result.rows[0].time
        });
    } catch (err) {
        res.json({ status: 'error', message: err.message });
    }
});

// Debug endpoint
app.get('/api/debug-db', async (req, res) => {
    res.json({
        database_url_exists: !!process.env.DATABASE_URL,
        node_env: process.env.NODE_ENV,
        db_url_prefix: process.env.DATABASE_URL ? process.env.DATABASE_URL.substring(0, 20) : 'none'
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ message: 'API is running', endpoints: ['/api/health', '/api/debug-db'] });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`Database URL exists: ${!!process.env.DATABASE_URL}`);
});