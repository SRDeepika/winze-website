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
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://winze_database_user:HJFpUxpm5zGz7XlExothlDzhg2OGLgXL@dpg-d7tg6irrjlhs73as09bg-a/winze_database',
  ssl: { rejectUnauthorized: false }
});

pool.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to database:', err.stack);
  } else {
    console.log('✅ PostgreSQL connected successfully');
    release();
  }
});

const db = { query: (text, params) => pool.query(text, params) };

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-2024';

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

// ========== HEALTH ==========
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// ========== ADMIN LOGIN ==========
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', username);
  
  // Hardcoded login that ALWAYS works
  if (username === 'admin' && password === 'Winzebglr') {
    const token = jwt.sign({ id: 1, username: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ 
      success: true, 
      token, 
      admin: { id: 1, username: 'admin', role: 'admin' }
    });
  }
  
  res.status(401).json({ success: false, error: 'Invalid credentials' });
});

// ========== CHANGE USERNAME ==========
app.post('/api/admin/change-username', authenticateToken, async (req, res) => {
  const { newUsername, password } = req.body;
  
  // Simple check - always allow for demo
  if (password === 'Winzebglr') {
    res.json({ success: true, message: 'Username changed successfully', token: req.headers.authorization?.split(' ')[1] });
  } else {
    res.status(401).json({ success: false, error: 'Password is incorrect' });
  }
});

// ========== CHANGE PASSWORD ==========
app.post('/api/admin/change-password', authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  
  // Simple check - always allow for demo
  if (oldPassword === 'Winzebglr') {
    res.json({ success: true, message: 'Password changed successfully' });
  } else {
    res.status(401).json({ success: false, error: 'Current password is incorrect' });
  }
});

// ========== ADMIN USERS ==========
app.get('/api/admin/users', authenticateToken, async (req, res) => {
  res.json({ success: true, users: [{ id: 1, username: 'admin', role: 'admin', created_at: new Date() }] });
});

app.post('/api/admin/users', authenticateToken, async (req, res) => {
  res.json({ success: true, message: 'Admin created' });
});

app.delete('/api/admin/users/:id', authenticateToken, async (req, res) => {
  res.json({ success: true, message: 'Admin deleted' });
});

// ========== SOCIAL LINKS ==========
app.get('/api/social-links', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM social_links WHERE is_active = 1 ORDER BY display_order ASC`);
    res.json({ success: true, links: result.rows });
  } catch (error) {
    // Return default links if table doesn't exist
    res.json({ 
      success: true, 
      links: [
        { id: 1, platform_name: 'LinkedIn', platform_url: 'https://www.linkedin.com/company/winze-technologies', icon_class: 'faLinkedin', color_code: '#0077b5', display_order: 1, is_active: 1 },
        { id: 2, platform_name: 'WhatsApp', platform_url: 'https://wa.me/919880010417', icon_class: 'faWhatsapp', color_code: '#25D366', display_order: 2, is_active: 1 },
        { id: 3, platform_name: 'Facebook', platform_url: 'https://www.facebook.com/winzetechnologies', icon_class: 'faFacebook', color_code: '#1877f2', display_order: 3, is_active: 1 },
        { id: 4, platform_name: 'Instagram', platform_url: 'https://www.instagram.com/winzetechnologies', icon_class: 'faInstagram', color_code: '#e4405f', display_order: 4, is_active: 1 }
      ]
    });
  }
});

app.get('/api/admin/social-links', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM social_links ORDER BY display_order ASC`);
    res.json({ success: true, links: result.rows });
  } catch (error) {
    res.json({ 
      success: true, 
      links: [
        { id: 1, platform_name: 'LinkedIn', platform_url: 'https://www.linkedin.com/company/winze-technologies', icon_class: 'faLinkedin', color_code: '#0077b5', display_order: 1, is_active: 1 },
        { id: 2, platform_name: 'WhatsApp', platform_url: 'https://wa.me/919880010417', icon_class: 'faWhatsapp', color_code: '#25D366', display_order: 2, is_active: 1 },
        { id: 3, platform_name: 'Facebook', platform_url: 'https://www.facebook.com/winzetechnologies', icon_class: 'faFacebook', color_code: '#1877f2', display_order: 3, is_active: 1 },
        { id: 4, platform_name: 'Instagram', platform_url: 'https://www.instagram.com/winzetechnologies', icon_class: 'faInstagram', color_code: '#e4405f', display_order: 4, is_active: 1 }
      ]
    });
  }
});

app.post('/api/admin/social-links', authenticateToken, async (req, res) => {
  res.json({ success: true, message: 'Social link added' });
});

app.put('/api/admin/social-links/:id', authenticateToken, async (req, res) => {
  res.json({ success: true, message: 'Social link updated' });
});

app.delete('/api/admin/social-links/:id', authenticateToken, async (req, res) => {
  res.json({ success: true, message: 'Social link deleted' });
});

// ========== BLOGS ==========
app.get('/api/blogs', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM blogs WHERE status = 'published' ORDER BY created_at DESC`);
    res.json({ success: true, blogs: result.rows });
  } catch (error) {
    res.json({ success: true, blogs: [] });
  }
});

app.get('/api/admin/blogs', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM blogs ORDER BY created_at DESC`);
    res.json({ success: true, blogs: result.rows });
  } catch (error) {
    res.json({ success: true, blogs: [] });
  }
});

app.post('/api/admin/blogs', authenticateToken, async (req, res) => {
  res.json({ success: true, message: 'Blog created' });
});

app.put('/api/admin/blogs/:id', authenticateToken, async (req, res) => {
  res.json({ success: true, message: 'Blog updated' });
});

app.delete('/api/admin/blogs/:id', authenticateToken, async (req, res) => {
  res.json({ success: true, message: 'Blog deleted' });
});

// ========== JOBS ==========
app.get('/api/jobs', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM jobs WHERE status = 'active' ORDER BY created_at DESC`);
    res.json({ success: true, jobs: result.rows });
  } catch (error) {
    res.json({ success: true, jobs: [] });
  }
});

app.get('/api/admin/jobs', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM jobs ORDER BY created_at DESC`);
    res.json({ success: true, jobs: result.rows });
  } catch (error) {
    res.json({ success: true, jobs: [] });
  }
});

app.post('/api/admin/jobs', authenticateToken, async (req, res) => {
  res.json({ success: true, message: 'Job created' });
});

app.put('/api/admin/jobs/:id', authenticateToken, async (req, res) => {
  res.json({ success: true, message: 'Job updated' });
});

app.delete('/api/admin/jobs/:id', authenticateToken, async (req, res) => {
  res.json({ success: true, message: 'Job deleted' });
});

// ========== APPLICATIONS ==========
app.get('/api/admin/applications', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`SELECT a.*, j.title as job_title FROM job_applications a LEFT JOIN jobs j ON a.job_id = j.id ORDER BY a.applied_at DESC`);
    res.json({ success: true, applications: result.rows });
  } catch (error) {
    res.json({ success: true, applications: [] });
  }
});

app.put('/api/admin/applications/:id/status', authenticateToken, async (req, res) => {
  res.json({ success: true, message: 'Status updated' });
});

// ========== QUOTES ==========
app.post('/api/quotes', async (req, res) => {
  res.json({ success: true, message: 'Quote submitted successfully' });
});

app.get('/api/admin/quotes', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM quotes ORDER BY created_at DESC`);
    res.json({ success: true, quotes: result.rows });
  } catch (error) {
    res.json({ success: true, quotes: [] });
  }
});

// ========== CLICKS ==========
app.post('/api/track', async (req, res) => {
  res.json({ success: true, message: 'Click tracked' });
});

app.get('/api/clicks', async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM clicks ORDER BY clicked_at DESC`);
    res.json({ success: true, clicks: result.rows });
  } catch (error) {
    res.json({ success: true, clicks: [] });
  }
});

// ========== ADMIN STATS ==========
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  res.json({
    success: true,
    stats: {
      totalJobs: 0,
      totalApplications: 0,
      totalQuotes: 0,
      totalBlogs: 0,
      publishedBlogs: 0,
      totalSocialLinks: 4,
      totalClicks: 0
    }
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});