const express = require('express');
const cors = require('cors');
const db = require('./config/database');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// File upload configuration
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Serve uploaded files
app.use('/uploads', express.static(uploadDir));

// CORS configuration
app.use(cors({
    origin: [
        'https://winze-website.onrender.com',
        'https://winze-frontend.onrender.com',
        'https://creative-belekoy-0cae1a.netlify.app',
        'http://localhost:5000',
        'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// ========== HEALTH CHECK ==========
app.get('/api/health', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW() as time');
        res.json({ status: 'ok', database: 'PostgreSQL', time: result.rows[0].time });
    } catch (err) {
        res.json({ status: 'error', message: err.message });
    }
});

// ========== SOCIAL LINKS (NO AUTH) ==========
app.get('/api/social-links', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM social_links WHERE is_active = 1 ORDER BY display_order');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/social-links', async (req, res) => {
    const { platform_name, platform_url, icon_class, color_code, display_order, is_active } = req.body;
    try {
        const query = `INSERT INTO social_links (platform_name, platform_url, icon_class, color_code, display_order, is_active) 
                       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
        const result = await db.query(query, [
            platform_name, platform_url, icon_class, color_code, display_order || 0, is_active !== undefined ? is_active : 1
        ]);
        res.status(201).json({ id: result.rows[0].id, message: 'Link added successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

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
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

app.delete('/api/social-links/:id', async (req, res) => {
    try {
        await db.query('DELETE FROM social_links WHERE id = $1', [req.params.id]);
        res.json({ message: 'Link deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

// ========== CLICK TRACKING ==========
app.post('/api/track', async (req, res) => {
    const { link_url, link_title, ip_address } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO clicks (link_url, link_title, ip_address) VALUES ($1, $2, $3) RETURNING id',
            [link_url, link_title, ip_address || '0.0.0.0']
        );
        res.json({ success: true, id: result.rows[0].id });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== CLICKS (NO AUTH) ==========
app.get('/api/clicks', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM clicks ORDER BY clicked_at DESC');
        res.json({ success: true, clicks: result.rows, total: result.rows.length });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/clicks/stats', async (req, res) => {
    try {
        const totalResult = await db.query('SELECT COUNT(*) as count FROM clicks');
        const todayResult = await db.query("SELECT COUNT(*) as count FROM clicks WHERE DATE(clicked_at) = CURRENT_DATE");
        res.json({ 
            success: true, 
            stats: { total: parseInt(totalResult.rows[0].count), today: parseInt(todayResult.rows[0].count) }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== ADMIN LOGIN ==========
app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
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
        res.json({ success: true, admin: { id: admin.id, username: admin.username, role: admin.role }, token: 'admin-session-token' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// ========== ADMIN STATS (NO AUTH) ==========
app.get('/api/admin/stats', async (req, res) => {
    try {
        const blogCount = await db.query(`SELECT COUNT(*) FROM blogs`);
        const publishedBlogs = await db.query(`SELECT COUNT(*) FROM blogs WHERE status = 'published'`);
        const jobCount = await db.query(`SELECT COUNT(*) FROM jobs`);
        const activeJobs = await db.query(`SELECT COUNT(*) FROM jobs WHERE status = 'active'`);
        const applicationCount = await db.query(`SELECT COUNT(*) FROM job_applications`);
        const quoteCount = await db.query(`SELECT COUNT(*) FROM quotes`);
        const clickCount = await db.query(`SELECT COUNT(*) FROM clicks`);
        res.json({
            success: true,
            stats: {
                totalBlogs: parseInt(blogCount.rows[0].count),
                publishedBlogs: parseInt(publishedBlogs.rows[0].count),
                totalJobs: parseInt(jobCount.rows[0].count),
                activeJobs: parseInt(activeJobs.rows[0].count),
                totalApplications: parseInt(applicationCount.rows[0].count),
                totalQuotes: parseInt(quoteCount.rows[0].count),
                totalClicks: parseInt(clickCount.rows[0].count)
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== ADMIN USERS (NO AUTH) ==========
app.get('/api/admin/users', async (req, res) => {
    try {
        const result = await db.query(`SELECT id, username, role, created_at FROM admins`);
        res.json({ success: true, users: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/admin/users', async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(`INSERT INTO admins (username, password_hash, role) VALUES ($1, $2, $3)`, [username, hashedPassword, role || 'admin']);
        res.json({ success: true, message: 'Admin created successfully' });
    } catch (err) {
        if (err.code === '23505') {
            res.status(400).json({ success: false, error: 'Username already exists' });
        } else {
            res.status(500).json({ success: false, error: err.message });
        }
    }
});

app.delete('/api/admin/users/:id', async (req, res) => {
    try {
        await db.query(`DELETE FROM admins WHERE id = $1`, [req.params.id]);
        res.json({ success: true, message: 'Admin deleted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== BLOGS (NO AUTH) ==========
// Public route - Get published blogs for website
app.get('/api/blogs', async (req, res) => {
    try {
        const result = await db.query(`SELECT id, title, slug, excerpt, category, image, author, author_role, read_time, views, created_at FROM blogs WHERE status = 'published' ORDER BY created_at DESC`);
        res.json({ success: true, blogs: result.rows });
    } catch (err) {
        console.error('Error fetching blogs:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Get single blog by slug (for blog detail page)
app.get('/api/blogs/:slug', async (req, res) => {
    try {
        const { slug } = req.params;
        // Increment view count
        await db.query(`UPDATE blogs SET views = views + 1 WHERE slug = $1`, [slug]);
        // Get blog
        const result = await db.query(`SELECT * FROM blogs WHERE slug = $1 AND status = 'published'`, [slug]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Blog not found' });
        }
        res.json({ success: true, blog: result.rows[0] });
    } catch (err) {
        console.error('Error fetching blog:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Admin route - Get all blogs (including drafts)
app.get('/api/admin/blogs', async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM blogs ORDER BY created_at DESC`);
        res.json({ success: true, blogs: result.rows });
    } catch (err) {
        console.error('Error fetching admin blogs:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Create blog
app.post('/api/admin/blogs', upload.single('image'), async (req, res) => {
    try {
        const { title, excerpt, content, category, author, author_role, read_time, status } = req.body;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const image = req.file ? `/uploads/${req.file.filename}` : '';
        
        const result = await db.query(
            `INSERT INTO blogs (title, slug, excerpt, content, category, image, author, author_role, read_time, status, views) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
            [title, slug, excerpt, content, category, image, author, author_role, read_time || 5, status || 'draft', 0]
        );
        
        res.json({ success: true, message: 'Blog created successfully', blogId: result.rows[0].id });
    } catch (err) {
        console.error('Error creating blog:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Update blog
app.put('/api/admin/blogs/:id', upload.single('image'), async (req, res) => {
    try {
        const { title, excerpt, content, category, author, author_role, read_time, status } = req.body;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        
        let query, params;
        if (req.file) {
            query = `UPDATE blogs SET title=$1, slug=$2, excerpt=$3, content=$4, category=$5, author=$6, author_role=$7, read_time=$8, status=$9, image=$10, updated_at=NOW() WHERE id=$11`;
            params = [title, slug, excerpt, content, category, author, author_role, read_time, status, `/uploads/${req.file.filename}`, req.params.id];
        } else {
            query = `UPDATE blogs SET title=$1, slug=$2, excerpt=$3, content=$4, category=$5, author=$6, author_role=$7, read_time=$8, status=$9, updated_at=NOW() WHERE id=$10`;
            params = [title, slug, excerpt, content, category, author, author_role, read_time, status, req.params.id];
        }
        
        await db.query(query, params);
        res.json({ success: true, message: 'Blog updated successfully' });
    } catch (err) {
        console.error('Error updating blog:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// Delete blog
app.delete('/api/admin/blogs/:id', async (req, res) => {
    try {
        await db.query(`DELETE FROM blogs WHERE id = $1`, [req.params.id]);
        res.json({ success: true, message: 'Blog deleted successfully' });
    } catch (err) {
        console.error('Error deleting blog:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});
// ========== JOBS (NO AUTH) ==========
app.get('/api/jobs', async (req, res) => {
    try {
        const result = await db.query(`SELECT id, title, department, location, type, experience, salary, description, requirements, benefits FROM jobs WHERE status = 'active' ORDER BY created_at DESC`);
        res.json({ success: true, jobs: result.rows });
    } catch (err) {
        console.error('Error fetching jobs:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/admin/jobs', async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM jobs ORDER BY created_at DESC`);
        res.json({ success: true, jobs: result.rows });
    } catch (err) {
        console.error('Error fetching admin jobs:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// FIXED - Create Job
app.post('/api/admin/jobs', async (req, res) => {
    try {
        console.log('📝 Received job data:', req.body);
        
        const { title, department, location, type, experience, salary, description, requirements, benefits, status, deadline } = req.body;
        
        // Check if required fields exist
        if (!title) {
            return res.status(400).json({ success: false, error: 'Job title is required' });
        }
        
        const result = await db.query(
            `INSERT INTO jobs (title, department, location, type, experience, salary, description, requirements, benefits, status, deadline) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
            [
                title,
                department || '',
                location || '',
                type || 'Full-time',
                experience || '',
                salary || '',
                description || '',
                requirements || '',
                benefits || '',
                status || 'active',
                deadline || null
            ]
        );
        
        res.json({ success: true, message: 'Job posted successfully', jobId: result.rows[0].id });
    } catch (err) {
        console.error('❌ Error creating job:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.put('/api/admin/jobs/:id', async (req, res) => {
    try {
        const { title, department, location, type, experience, salary, description, requirements, benefits, status, deadline } = req.body;
        
        await db.query(
            `UPDATE jobs SET 
                title = $1, department = $2, location = $3, type = $4, 
                experience = $5, salary = $6, description = $7, 
                requirements = $8, benefits = $9, status = $10, deadline = $11,
                updated_at = NOW()
             WHERE id = $12`,
            [
                title, department, location, type, experience, salary,
                description, requirements, benefits, status, deadline,
                req.params.id
            ]
        );
        
        res.json({ success: true, message: 'Job updated successfully' });
    } catch (err) {
        console.error('Error updating job:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.delete('/api/admin/jobs/:id', async (req, res) => {
    try {
        await db.query(`DELETE FROM job_applications WHERE job_id = $1`, [req.params.id]);
        await db.query(`DELETE FROM jobs WHERE id = $1`, [req.params.id]);
        res.json({ success: true, message: 'Job deleted successfully' });
    } catch (err) {
        console.error('Error deleting job:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});
// ========== APPLICATIONS (NO AUTH) ==========
app.get('/api/admin/applications', async (req, res) => {
    try {
        const result = await db.query(`SELECT ja.*, j.title as job_title FROM job_applications ja LEFT JOIN jobs j ON ja.job_id = j.id ORDER BY ja.applied_at DESC`);
        res.json({ success: true, applications: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/jobs/:id/apply', upload.single('resume'), async (req, res) => {
    try {
        const { name, email, phone, experience, current_company, current_ctc, notice_period, cover_letter } = req.body;
        const resume_url = req.file ? `/uploads/${req.file.filename}` : '';
        await db.query(`INSERT INTO job_applications (job_id, name, email, phone, experience, current_company, current_ctc, notice_period, cover_letter, resume_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`, [req.params.id, name, email, phone, experience, current_company, current_ctc, notice_period, cover_letter, resume_url]);
        res.json({ success: true, message: 'Application submitted successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.put('/api/admin/applications/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        await db.query(`UPDATE job_applications SET status = $1 WHERE id = $2`, [status, req.params.id]);
        res.json({ success: true, message: 'Application status updated' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== QUOTES (NO AUTH) ==========
app.post('/api/quotes', async (req, res) => {
    try {
        const { name, email, phone, service, message } = req.body;
        await db.query(`INSERT INTO quotes (name, email, phone, service, message) VALUES ($1, $2, $3, $4, $5)`, [name, email, phone, service, message]);
        res.json({ success: true, message: 'Quote request submitted successfully' });
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

// ========== CHANGE PASSWORD/USERNAME (NO AUTH) ==========
app.post('/api/admin/change-password', async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;
    try {
        const result = await db.query('SELECT * FROM admins WHERE username = $1', [username]);
        if (result.rows.length === 0) return res.status(401).json({ success: false, error: 'User not found' });
        const admin = result.rows[0];
        const validPassword = await bcrypt.compare(oldPassword, admin.password_hash);
        if (!validPassword) return res.status(401).json({ success: false, error: 'Current password is incorrect' });
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE admins SET password_hash = $1 WHERE username = $2', [hashedPassword, username]);
        res.json({ success: true, message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

app.post('/api/admin/change-username', async (req, res) => {
    const { username, newUsername, password } = req.body;
    try {
        const result = await db.query('SELECT * FROM admins WHERE username = $1', [username]);
        if (result.rows.length === 0) return res.status(401).json({ success: false, error: 'User not found' });
        const admin = result.rows[0];
        const validPassword = await bcrypt.compare(password, admin.password_hash);
        if (!validPassword) return res.status(401).json({ success: false, error: 'Current password is incorrect' });
        const existingUser = await db.query('SELECT * FROM admins WHERE username = $1', [newUsername]);
        if (existingUser.rows.length > 0) return res.status(400).json({ success: false, error: 'Username already exists' });
        await db.query('UPDATE admins SET username = $1 WHERE username = $2', [newUsername, username]);
        res.json({ success: true, message: 'Username changed successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`✅ Database: PostgreSQL`);
    console.log(`📡 Endpoints ready (authentication disabled for admin routes)`);
});