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
  
  
  // Then try database
  try {
    const result = await db.query(`SELECT * FROM admins WHERE username = $1`, [username]);
    
    if (result.rows.length > 0) {
      const admin = result.rows[0];
      const passwordHash = admin.password_hash || admin.password;
      const validPassword = await bcrypt.compare(password, passwordHash);
      if (validPassword) {
        const token = jwt.sign({ id: admin.id, username: admin.username, role: admin.role }, JWT_SECRET, { expiresIn: '24h' });
        return res.json({ 
          success: true, 
          token, 
          admin: { id: admin.id, username: admin.username, role: admin.role || 'admin' }
        });
      }
    }
    
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== CHANGE USERNAME ==========
app.post('/api/admin/change-username', authenticateToken, async (req, res) => {
  const { newUsername, password } = req.body;
  const adminId = req.user.id;
  
  console.log('Change username request for admin ID:', adminId);
  
  try {
    const result = await db.query(`SELECT * FROM admins WHERE id = $1`, [adminId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }
    
    const admin = result.rows[0];
    const passwordHash = admin.password_hash || admin.password;
    
    // Verify password
    const validPassword = await bcrypt.compare(password, passwordHash);
    if (!validPassword) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect' });
    }
    
    // Check if new username already exists
    const existing = await db.query(`SELECT id FROM admins WHERE username = $1 AND id != $2`, [newUsername, adminId]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Username already exists' });
    }
    
    // Update username
    await db.query(`UPDATE admins SET username = $1, updated_at = NOW() WHERE id = $2`, [newUsername, adminId]);
    
    // Generate new token with new username
    const token = jwt.sign({ id: admin.id, username: newUsername, role: admin.role }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ success: true, message: 'Username changed successfully', token });
  } catch (error) {
    console.error('Change username error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== CHANGE PASSWORD ==========
app.post('/api/admin/change-password', authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const adminId = req.user.id;
  
  console.log('Change password request for admin ID:', adminId);
  
  try {
    const result = await db.query(`SELECT * FROM admins WHERE id = $1`, [adminId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }
    
    const admin = result.rows[0];
    const passwordHash = admin.password_hash || admin.password;
    
    // Verify old password
    const validPassword = await bcrypt.compare(oldPassword, passwordHash);
    if (!validPassword) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect' });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password
    await db.query(`UPDATE admins SET password_hash = $1, updated_at = NOW() WHERE id = $2`, [hashedPassword, adminId]);
    
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
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
      `INSERT INTO social_links (platform_name, platform_url, icon_class, color_code, display_order, is_active, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
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
      `UPDATE social_links SET platform_name=$1, platform_url=$2, icon_class=$3, color_code=$4, display_order=$5, is_active=$6 WHERE id=$7`,
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
    res.json({ success: true, blogs: [] });
  }
});

app.get('/api/admin/blogs', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM blogs ORDER BY created_at DESC`);
    console.log('Blogs fetched, first read_time:', result.rows[0]?.read_time);
    res.json({ success: true, blogs: result.rows });
  } catch (error) {
    res.json({ success: true, blogs: [] });
  }
});

app.post('/api/admin/blogs', authenticateToken, async (req, res) => {
  try {
    const { title, excerpt, content, category, author, author_role, read_time, status } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    await db.query(
      `INSERT INTO blogs (title, slug, excerpt, content, category, author, author_role, read_time, status, created_at, updated_at, views) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW(), 0)`,
      [title, slug, excerpt || '', content, category || 'General', author || 'Admin', author_role || 'Author', read_time || 5, status || 'draft']
    );
    res.json({ success: true, message: 'Blog created' });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/admin/blogs/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, category, author, author_role, read_time, status } = req.body;
    
    console.log('Updating blog ID:', id, 'read_time:', read_time);
    
    if (title) {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await db.query(`UPDATE blogs SET title=$1, slug=$2, updated_at=NOW() WHERE id=$3`, [title, slug, id]);
    }
    if (excerpt !== undefined) await db.query(`UPDATE blogs SET excerpt=$1, updated_at=NOW() WHERE id=$2`, [excerpt, id]);
    if (content) await db.query(`UPDATE blogs SET content=$1, updated_at=NOW() WHERE id=$2`, [content, id]);
    if (category) await db.query(`UPDATE blogs SET category=$1, updated_at=NOW() WHERE id=$2`, [category, id]);
    if (author) await db.query(`UPDATE blogs SET author=$1, updated_at=NOW() WHERE id=$2`, [author, id]);
    if (author_role !== undefined) await db.query(`UPDATE blogs SET author_role=$1, updated_at=NOW() WHERE id=$2`, [author_role, id]);
    if (read_time !== undefined) await db.query(`UPDATE blogs SET read_time=$1, updated_at=NOW() WHERE id=$2`, [read_time, id]);
    if (status) await db.query(`UPDATE blogs SET status=$1, updated_at=NOW() WHERE id=$2`, [status, id]);
    
    res.json({ success: true, message: 'Blog updated' });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/admin/blogs/:id', authenticateToken, async (req, res) => {
  try {
    await db.query(`DELETE FROM blogs WHERE id = $1`, [req.params.id]);
    res.json({ success: true, message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
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
  try {
    const { title, department, location, type, description, salary, status } = req.body;
    await db.query(
      `INSERT INTO jobs (title, department, location, type, description, salary, status, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())`,
      [title, department || '', location || '', type || 'Full-time', description || '', salary || '', status || 'active']
    );
    res.json({ success: true, message: 'Job created' });
  } catch (error) {
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
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/admin/jobs/:id', authenticateToken, async (req, res) => {
  try {
    await db.query(`DELETE FROM jobs WHERE id = $1`, [req.params.id]);
    res.json({ success: true, message: 'Job deleted' });
  } catch (error) {
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
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== QUOTES ==========
app.post('/api/quotes', async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;
    await db.query(`INSERT INTO quotes (name, email, phone, service, message, created_at) VALUES ($1, $2, $3, $4, $5, NOW())`, 
      [name, email, phone, service, message]);
    res.json({ success: true, message: 'Quote submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
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
  const { link_url, link_title, ip_address } = req.body;
  try {
    await db.query(`INSERT INTO clicks (link_url, link_title, ip_address, clicked_at) VALUES ($1, $2, $3, NOW())`, 
      [link_url, link_title, ip_address || '0.0.0.0']);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
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
  try {
    const jobCount = await db.query(`SELECT COUNT(*) FROM jobs`);
    const activeJobCount = await db.query(`SELECT COUNT(*) FROM jobs WHERE status = 'active'`);
    const appCount = await db.query(`SELECT COUNT(*) FROM job_applications`);
    const quoteCount = await db.query(`SELECT COUNT(*) FROM quotes`);
    const blogCount = await db.query(`SELECT COUNT(*) FROM blogs`);
    const publishedBlogs = await db.query(`SELECT COUNT(*) FROM blogs WHERE status = 'published'`);
    const socialCount = await db.query(`SELECT COUNT(*) FROM social_links`);
    const clickCount = await db.query(`SELECT COUNT(*) FROM clicks`);
    
    res.json({
      success: true,
      stats: {
        totalJobs: parseInt(jobCount.rows[0].count) || 0,
        activeJobs: parseInt(activeJobCount.rows[0].count) || 0,
        totalApplications: parseInt(appCount.rows[0].count) || 0,
        totalQuotes: parseInt(quoteCount.rows[0].count) || 0,
        totalBlogs: parseInt(blogCount.rows[0].count) || 0,
        publishedBlogs: parseInt(publishedBlogs.rows[0].count) || 0,
        totalSocialLinks: parseInt(socialCount.rows[0].count) || 0,
        totalClicks: parseInt(clickCount.rows[0].count) || 0
      }
    });
  } catch (error) {
    res.json({ success: true, stats: {} });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
});