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

// ========== HEALTH CHECK ==========
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// ========== ADMIN LOGIN ==========
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Login attempt:', username);
  
  try {
    // Try to find admin by username
    const result = await db.query(`SELECT * FROM admins WHERE username = $1`, [username]);
    
    if (result.rows.length === 0) {
      console.log('User not found:', username);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    const admin = result.rows[0];
    
    // Check which password column exists
    let passwordHash = admin.password_hash || admin.password;
    
    if (!passwordHash) {
      console.log('No password hash found for user:', username);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    const validPassword = await bcrypt.compare(password, passwordHash);
    
    if (!validPassword) {
      console.log('Invalid password for user:', username);
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role || 'admin' }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );
    
    res.json({ 
      success: true, 
      token, 
      admin: { id: admin.id, username: admin.username, role: admin.role || 'admin' }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== CHANGE PASSWORD ==========
app.post('/api/admin/change-password', authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const adminId = req.user.id;
  
  try {
    const result = await db.query(`SELECT * FROM admins WHERE id = $1`, [adminId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }
    
    const admin = result.rows[0];
    const passwordHash = admin.password_hash || admin.password;
    const validPassword = await bcrypt.compare(oldPassword, passwordHash);
    
    if (!validPassword) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update using correct column name
    if (admin.password_hash !== undefined) {
      await db.query(`UPDATE admins SET password_hash = $1, updated_at = NOW() WHERE id = $2`, [hashedPassword, adminId]);
    } else {
      await db.query(`UPDATE admins SET password = $1, updated_at = NOW() WHERE id = $2`, [hashedPassword, adminId]);
    }
    
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
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    const { username, password, role } = req.body;
    
    const existing = await db.query(`SELECT id FROM admins WHERE username = $1`, [username]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Username already exists' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert using password_hash column
    await db.query(
      `INSERT INTO admins (username, password_hash, role, created_at, updated_at) 
       VALUES ($1, $2, $3, NOW(), NOW())`,
      [username, hashedPassword, role || 'admin']
    );
    
    res.json({ success: true, message: 'Admin created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/admin/users/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const countResult = await db.query(`SELECT COUNT(*) FROM admins`);
    if (parseInt(countResult.rows[0].count) <= 1) {
      return res.status(400).json({ success: false, error: 'Cannot delete the last admin' });
    }
    
    await db.query(`DELETE FROM admins WHERE id = $1`, [id]);
    res.json({ success: true, message: 'Admin deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
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
    res.json({ success: true, message: 'Social link added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/admin/social-links/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { platform_name, platform_url, icon_class, color_code, display_order, is_active } = req.body;
    await db.query(
      `UPDATE social_links 
       SET platform_name = $1, platform_url = $2, icon_class = $3, color_code = $4, display_order = $5, is_active = $6, updated_at = NOW() 
       WHERE id = $7`,
      [platform_name, platform_url, icon_class, color_code, display_order, is_active, id]
    );
    res.json({ success: true, message: 'Social link updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/admin/social-links/:id', authenticateToken, async (req, res) => {
  try {
    await db.query(`DELETE FROM social_links WHERE id = $1`, [req.params.id]);
    res.json({ success: true, message: 'Social link deleted successfully' });
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
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/admin/blogs', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM blogs ORDER BY created_at DESC`);
    res.json({ success: true, blogs: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
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
    res.json({ success: true, message: 'Blog created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/admin/blogs/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, category, author, status } = req.body;
    
    if (title) {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await db.query(`UPDATE blogs SET title = $1, slug = $2 WHERE id = $3`, [title, slug, id]);
    }
    if (excerpt !== undefined) await db.query(`UPDATE blogs SET excerpt = $1 WHERE id = $2`, [excerpt, id]);
    if (content) await db.query(`UPDATE blogs SET content = $1 WHERE id = $2`, [content, id]);
    if (category) await db.query(`UPDATE blogs SET category = $1 WHERE id = $2`, [category, id]);
    if (author) await db.query(`UPDATE blogs SET author = $1 WHERE id = $2`, [author, id]);
    if (status) await db.query(`UPDATE blogs SET status = $1 WHERE id = $2`, [status, id]);
    
    await db.query(`UPDATE blogs SET updated_at = NOW() WHERE id = $1`, [id]);
    res.json({ success: true, message: 'Blog updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/admin/blogs/:id', authenticateToken, async (req, res) => {
  try {
    await db.query(`DELETE FROM blogs WHERE id = $1`, [req.params.id]);
    res.json({ success: true, message: 'Blog deleted successfully' });
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
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/admin/jobs', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM jobs ORDER BY created_at DESC`);
    res.json({ success: true, jobs: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
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
    res.json({ success: true, message: 'Job created successfully' });
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
    res.json({ success: true, message: 'Job updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/admin/jobs/:id', authenticateToken, async (req, res) => {
  try {
    await db.query(`DELETE FROM jobs WHERE id = $1`, [req.params.id]);
    res.json({ success: true, message: 'Job deleted successfully' });
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
    res.status(500).json({ success: false, error: error.message });
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
app.get('/api/admin/quotes', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`SELECT * FROM quotes ORDER BY created_at DESC`);
    res.json({ success: true, quotes: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
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
    res.status(500).json({ success: false, error: error.message });
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
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});