const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// File upload
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

app.use('/uploads', express.static(uploadDir));
app.use(cors({ origin: ['https://winze-frontend.onrender.com', 'http://localhost:3000'], credentials: true }));
app.use(express.json());

// ========== HEALTH ==========
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// ========== BLOGS ==========
app.get('/api/blogs', async (req, res) => {
    try {
        const result = await db.query(`SELECT id, title, slug, excerpt, content, category, image, author, created_at FROM blogs WHERE status = 'published' ORDER BY created_at DESC`);
        res.json({ success: true, blogs: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/admin/blogs', async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM blogs ORDER BY created_at DESC`);
        res.json({ success: true, blogs: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/admin/blogs', upload.single('image'), async (req, res) => {
    try {
        const { title, excerpt, content, category, author, status } = req.body;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const image = req.file ? `/uploads/${req.file.filename}` : '';
        await db.query(
            `INSERT INTO blogs (title, slug, excerpt, content, category, image, author, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [title, slug, excerpt, content, category, image, author || 'Admin', status || 'published']
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.put('/api/admin/blogs/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, excerpt, content, category, author, status } = req.body;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        if (req.file) {
            await db.query(
                `UPDATE blogs SET title=$1, slug=$2, excerpt=$3, content=$4, category=$5, author=$6, status=$7, image=$8 WHERE id=$9`,
                [title, slug, excerpt, content, category, author, status, `/uploads/${req.file.filename}`, req.params.id]
            );
        } else {
            await db.query(
                `UPDATE blogs SET title=$1, slug=$2, excerpt=$3, content=$4, category=$5, author=$6, status=$7 WHERE id=$8`,
                [title, slug, excerpt, content, category, author, status, req.params.id]
            );
        }
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.delete('/api/admin/blogs/:id', async (req, res) => {
    try {
        await db.query(`DELETE FROM blogs WHERE id = $1`, [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== JOBS ==========
app.get('/api/jobs', async (req, res) => {
    try {
        const result = await db.query(`SELECT id, title, department, location, type, description, salary, experience FROM jobs WHERE status = 'active' ORDER BY created_at DESC`);
        res.json({ success: true, jobs: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/admin/jobs', async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM jobs ORDER BY created_at DESC`);
        res.json({ success: true, jobs: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/admin/jobs', async (req, res) => {
    try {
        const { title, department, location, type, description, salary, experience, status } = req.body;
        await db.query(
            `INSERT INTO jobs (title, department, location, type, description, salary, experience, status) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
            [title, department || '', location || '', type || 'Full-time', description || '', salary || '', experience || '', status || 'active']
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.delete('/api/admin/jobs/:id', async (req, res) => {
    try {
        await db.query(`DELETE FROM jobs WHERE id = $1`, [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== JOB APPLICATION - 6 COLUMNS ==========
app.post('/api/jobs/:id/apply', async (req, res) => {
    try {
        const jobId = req.params.id;
        const { name, email, phone, cover_letter } = req.body;
        
        console.log('Application for job:', jobId);
        console.log('Name:', name);
        console.log('Email:', email);
        
        const result = await db.query(
            `INSERT INTO job_applications (job_id, name, email, phone, cover_letter, status) 
             VALUES ($1, $2, $3, $4, $5, 'pending') RETURNING id`,
            [jobId, name, email, phone || '', cover_letter || '']
        );
        
        res.json({ success: true, message: 'Application submitted successfully', id: result.rows[0].id });
    } catch (err) {
        console.error('Error:', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/admin/applications', async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM job_applications ORDER BY applied_at DESC`);
        res.json({ success: true, applications: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== QUOTES ==========
app.post('/api/quotes', async (req, res) => {
    try {
        const { name, email, phone, service, message } = req.body;
        await db.query(`INSERT INTO quotes (name, email, phone, service, message) VALUES ($1, $2, $3, $4, $5)`, [name, email, phone, service, message]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/admin/quotes', async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM quotes ORDER BY created_at DESC`);
        res.json({ success: true, quotes: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== CLICKS ==========
app.post('/api/track', async (req, res) => {
    const { link_url, link_title, ip_address } = req.body;
    try {
        await db.query(`INSERT INTO clicks (link_url, link_title, ip_address) VALUES ($1, $2, $3)`, [link_url, link_title, ip_address || '0.0.0.0']);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/clicks', async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM clicks ORDER BY clicked_at DESC`);
        res.json({ success: true, clicks: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== ADMIN LOGIN ==========
app.post('/api/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'Winzebglr') {
        res.json({ success: true, admin: { username: 'admin', role: 'admin' }, token: 'admin-token' });
    } else {
        res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
});

// ========== ADMIN STATS ==========
app.get('/api/admin/stats', async (req, res) => {
    try {
        const jobCount = await db.query(`SELECT COUNT(*) FROM jobs`);
        const appCount = await db.query(`SELECT COUNT(*) FROM job_applications`);
        const quoteCount = await db.query(`SELECT COUNT(*) FROM quotes`);
        const blogCount = await db.query(`SELECT COUNT(*) FROM blogs`);
        res.json({
            success: true,
            stats: {
                totalJobs: parseInt(jobCount.rows[0].count),
                totalApplications: parseInt(appCount.rows[0].count),
                totalQuotes: parseInt(quoteCount.rows[0].count),
                totalBlogs: parseInt(blogCount.rows[0].count)
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));