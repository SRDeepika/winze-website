const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// ========== HEALTH ==========
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// ========== BLOGS - GET FOR WEBSITE ==========
app.get('/api/blogs', async (req, res) => {
    try {
        const result = await db.query(`SELECT id, title, slug, excerpt, content, category, image, author, created_at FROM blogs WHERE status = 'published' ORDER BY created_at DESC`);
        console.log('Blogs found:', result.rows.length);
        res.json({ success: true, blogs: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== BLOGS - ADMIN ==========
app.get('/api/admin/blogs', async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM blogs ORDER BY created_at DESC`);
        res.json({ success: true, blogs: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/admin/blogs', async (req, res) => {
    try {
        const { title, excerpt, content, category, author, status } = req.body;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        await db.query(
            `INSERT INTO blogs (title, slug, excerpt, content, category, author, status) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [title, slug, excerpt, content, category, author || 'Admin', status || 'published']
        );
        res.json({ success: true, message: 'Blog created' });
    } catch (err) {
        console.error('Error creating blog:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== SIMPLIFIED WORKING BLOG UPDATE ==========
app.put('/api/admin/blogs/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { title, excerpt, content, category, author, status } = req.body;
        
        console.log('Updating blog ID:', id);
        console.log('Title:', title);
        
        // Check if blog exists
        const checkBlog = await db.query(`SELECT id FROM blogs WHERE id = $1`, [id]);
        if (checkBlog.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Blog not found' });
        }
        
        // Update blog
        await db.query(
            `UPDATE blogs 
             SET title = $1, 
                 excerpt = $2, 
                 content = $3, 
                 category = $4, 
                 author = $5, 
                 status = $6,
                 updated_at = NOW()
             WHERE id = $7`,
            [title, excerpt || '', content || '', category || '', author || 'Admin', status || 'published', id]
        );
        
        res.json({ success: true, message: 'Blog updated successfully' });
    } catch (err) {
        console.error('Error updating blog:', err);
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
        const result = await db.query(`SELECT id, title, department, location, type, description, salary FROM jobs WHERE status = 'active' ORDER BY created_at DESC`);
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
        const { title, department, location, type, description, salary, status } = req.body;
        await db.query(
            `INSERT INTO jobs (title, department, location, type, description, salary, status) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
            [title, department || '', location || '', type || 'Full-time', description || '', salary || '', status || 'active']
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

// ========== JOB APPLICATION ==========
app.post('/api/jobs/:id/apply', async (req, res) => {
    try {
        const jobId = req.params.id;
        const { name, email, phone, experience, current_company, cover_letter } = req.body;
        
        // Get job title
        const jobResult = await db.query(`SELECT title FROM jobs WHERE id = $1`, [jobId]);
        const jobTitle = jobResult.rows[0]?.title || 'Unknown Job';
        
        console.log('Application:', { jobId, jobTitle, name, email });
        
        // Add columns if missing
        await db.query(`ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS experience VARCHAR(255)`);
        await db.query(`ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS current_company VARCHAR(255)`);
        await db.query(`ALTER TABLE job_applications ADD COLUMN IF NOT EXISTS job_title VARCHAR(255)`);
        
        const result = await db.query(
            `INSERT INTO job_applications (job_id, job_title, name, email, phone, experience, current_company, cover_letter, status) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending') RETURNING id`,
            [jobId, jobTitle, name, email, phone || '', experience || '', current_company || '', cover_letter || '']
        );
        
        res.json({ success: true, message: 'Application submitted', id: result.rows[0].id });
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

app.put('/api/admin/applications/:id/status', async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        await db.query(`UPDATE job_applications SET status = $1 WHERE id = $2`, [status, id]);
        res.json({ success: true, message: 'Status updated' });
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