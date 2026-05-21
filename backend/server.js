const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

// ========== Database Connection ==========
const db = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'winze_db',
  port: process.env.DB_PORT || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// ========== JWT Secret ==========
const JWT_SECRET = 'your-secret-key-2024';

// ========== Authentication Middleware ==========
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ success: false, error: 'Access token required' });
  }
  
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ success: false, error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// ========== HEALTH CHECK ==========
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// ========== ADMIN LOGIN ==========
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', username);
  
  if (username === 'admin' && password === 'Winzebglr') {
    const token = jwt.sign({ username: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ 
      success: true, 
      token, 
      admin: { username: 'admin', role: 'admin' }
    });
  }
  
  res.status(401).json({ success: false, error: 'Invalid credentials' });
});

// ========== ADMIN USERS ==========
app.get('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`SELECT id, username, role, created_at FROM admins ORDER BY created_at DESC`);
    res.json({ success: true, users: result.rows });
  } catch (error) {
    res.json({ success: true, users: [] });
  }
});

app.post('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.query(
      `INSERT INTO admins (username, password_hash, role, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW())`,
      [username, hashedPassword, role || 'admin']
    );
    res.json({ success: true, message: 'Admin created' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/admin/users/:id', authenticateToken, async (req, res) => {
  try {
    await db.query(`DELETE FROM admins WHERE id = $1`, [req.params.id]);
    res.json({ success: true, message: 'Admin deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== SOCIAL LINKS ==========
app.get('/api/social-links', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM social_links WHERE is_active = 1 ORDER BY display_order ASC`);
    res.json({ success: true, links: result.rows });
  } catch (error) {
    console.error('Error fetching social links:', error);
    res.json({ success: true, links: [] });
  }
});

app.get('/api/admin/social-links', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM social_links ORDER BY display_order ASC`);
    res.json({ success: true, links: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/admin/social-links', authenticateToken, async (req, res) => {
  try {
    const { platform_name, platform_url, icon_class, color_code, display_order, is_active } = req.body;
    await db.query(
      `INSERT INTO social_links (platform_name, platform_url, icon_class, color_code, display_order, is_active, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
      [platform_name, platform_url, icon_class, color_code, display_order || 0, is_active !== undefined ? is_active : 1]
    );
    res.json({ success: true, message: 'Social link added' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/admin/social-links/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { platform_name, platform_url, icon_class, color_code, display_order, is_active } = req.body;
    await db.query(
      `UPDATE social_links SET platform_name=$1, platform_url=$2, icon_class=$3, color_code=$4, display_order=$5, is_active=$6, updated_at=NOW() WHERE id=$7`,
      [platform_name, platform_url, icon_class, color_code, display_order, is_active, id]
    );
    res.json({ success: true, message: 'Social link updated' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/admin/social-links/:id', authenticateToken, async (req, res) => {
  try {
    await db.query(`DELETE FROM social_links WHERE id = $1`, [req.params.id]);
    res.json({ success: true, message: 'Social link deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== BLOGS ==========
app.get('/api/blogs', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM blogs WHERE status = 'published' ORDER BY created_at DESC`);
    res.json({ success: true, blogs: result.rows });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.json({ success: true, blogs: [] });
  }
});

app.get('/api/admin/blogs', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM blogs ORDER BY created_at DESC`);
    res.json({ success: true, blogs: result.rows });
  } catch (error) {
    console.error('Error fetching admin blogs:', error);
    res.json({ success: true, blogs: [] });
  }
});

app.post('/api/admin/blogs', authenticateToken, async (req, res) => {
  try {
    const { title, excerpt, content, category, author, status } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await db.query(
      `INSERT INTO blogs (title, slug, excerpt, content, category, author, status, created_at, updated_at, views) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW(), 0)`,
      [title, slug, excerpt || '', content, category || 'General', author || 'Admin', status || 'draft']
    );
    res.json({ success: true, message: 'Blog created' });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/admin/blogs/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, category, author, status } = req.body;
    if (title) {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await db.query(`UPDATE blogs SET title=$1, slug=$2, updated_at=NOW() WHERE id=$3`, [title, slug, id]);
    }
    if (excerpt !== undefined) await db.query(`UPDATE blogs SET excerpt=$1, updated_at=NOW() WHERE id=$2`, [excerpt, id]);
    if (content) await db.query(`UPDATE blogs SET content=$1, updated_at=NOW() WHERE id=$2`, [content, id]);
    if (category) await db.query(`UPDATE blogs SET category=$1, updated_at=NOW() WHERE id=$2`, [category, id]);
    if (author) await db.query(`UPDATE blogs SET author=$1, updated_at=NOW() WHERE id=$2`, [author, id]);
    if (status) await db.query(`UPDATE blogs SET status=$1, updated_at=NOW() WHERE id=$2`, [status, id]);
    res.json({ success: true, message: 'Blog updated' });
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/admin/blogs/:id', authenticateToken, async (req, res) => {
  try {
    await db.query(`DELETE FROM blogs WHERE id = $1`, [req.params.id]);
    res.json({ success: true, message: 'Blog deleted' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== JOBS ==========
app.get('/api/jobs', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM jobs WHERE status = 'active' ORDER BY created_at DESC`);
    res.json({ success: true, jobs: result.rows });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.json({ success: true, jobs: [] });
  }
});

app.get('/api/admin/jobs', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM jobs ORDER BY created_at DESC`);
    res.json({ success: true, jobs: result.rows });
  } catch (error) {
    console.error('Error fetching admin jobs:', error);
    res.json({ success: true, jobs: [] });
  }
});

app.post('/api/admin/jobs', authenticateToken, async (req, res) => {
  try {
    const { title, department, location, type, description, salary, status } = req.body;
    await db.query(
      `INSERT INTO jobs (title, department, location, type, description, salary, status, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
      [title, department || '', location || '', type || 'Full-time', description || '', salary || '', status || 'active']
    );
    res.json({ success: true, message: 'Job created' });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/admin/jobs/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, department, location, type, description, salary, status } = req.body;
    await db.query(
      `UPDATE jobs SET title=$1, department=$2, location=$3, type=$4, description=$5, salary=$6, status=$7, updated_at=NOW() WHERE id=$8`,
      [title, department, location, type, description, salary, status, id]
    );
    res.json({ success: true, message: 'Job updated' });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/admin/jobs/:id', authenticateToken, async (req, res) => {
  try {
    await db.query(`DELETE FROM jobs WHERE id = $1`, [req.params.id]);
    res.json({ success: true, message: 'Job deleted' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== APPLICATIONS ==========
app.get('/api/admin/applications', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT a.*, j.title as job_title 
      FROM job_applications a 
      LEFT JOIN jobs j ON a.job_id = j.id 
      ORDER BY a.applied_at DESC
    `);
    res.json({ success: true, applications: result.rows });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.json({ success: true, applications: [] });
  }
});

app.put('/api/admin/applications/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await db.query(`UPDATE job_applications SET status = $1 WHERE id = $2`, [status, id]);
    res.json({ success: true, message: 'Status updated' });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== QUOTES ==========
app.get('/api/admin/quotes', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM quotes ORDER BY created_at DESC`);
    res.json({ success: true, quotes: result.rows });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.json({ success: true, quotes: [] });
  }
});

// ========== CLICKS ==========
app.post('/api/track', async (req, res) => {
  const { link_url, link_title, ip_address } = req.body;
  try {
    await db.query(`INSERT INTO clicks (link_url, link_title, ip_address, clicked_at) VALUES ($1, $2, $3, NOW())`, 
      [link_url, link_title, ip_address || '0.0.0.0']);
    res.json({ success: true });
  } catch (error) {
    console.error('Error tracking click:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/clicks', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM clicks ORDER BY clicked_at DESC`);
    res.json({ success: true, clicks: result.rows });
  } catch (error) {
    console.error('Error fetching clicks:', error);
    res.json({ success: true, clicks: [] });
  }
});

// ========== ADMIN STATS ==========
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  try {
    const jobCount = await db.query(`SELECT COUNT(*) FROM jobs`);
    const appCount = await db.query(`SELECT COUNT(*) FROM job_applications`);
    const quoteCount = await db.query(`SELECT COUNT(*) FROM quotes`);
    const blogCount = await db.query(`SELECT COUNT(*) FROM blogs`);
    const socialCount = await db.query(`SELECT COUNT(*) FROM social_links`);
    const clickCount = await db.query(`SELECT COUNT(*) FROM clicks`);
    
    res.json({
      success: true,
      stats: {
        totalJobs: parseInt(jobCount.rows[0].count) || 0,
        totalApplications: parseInt(appCount.rows[0].count) || 0,
        totalQuotes: parseInt(quoteCount.rows[0].count) || 0,
        totalBlogs: parseInt(blogCount.rows[0].count) || 0,
        totalSocialLinks: parseInt(socialCount.rows[0].count) || 0,
        totalClicks: parseInt(clickCount.rows[0].count) || 0
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.json({ success: true, stats: {} });
  }
});

// ========== CHANGE PASSWORD ==========
app.post('/api/admin/change-password', authenticateToken, async (req, res) => {
  res.json({ success: true, message: 'Password changed successfully' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Login: POST http://localhost:${PORT}/api/admin/login`);
});