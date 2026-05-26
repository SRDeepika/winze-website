// FORCE NEW DEPLOYMENT - $(date)
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
    
    const validPassword = await bcrypt.compare(password, passwordHash);
    if (!validPassword) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect' });
    }
    
    const existing = await db.query(`SELECT id FROM admins WHERE username = $1 AND id != $2`, [newUsername, adminId]);
    if (existing.rows.length > 0) {
      return res.status(400).json({ success: false, error: 'Username already exists' });
    }
    
    await db.query(`UPDATE admins SET username = $1, updated_at = NOW() WHERE id = $2`, [newUsername, adminId]);
    
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
    
    const validPassword = await bcrypt.compare(oldPassword, passwordHash);
    if (!validPassword) {
      return res.status(401).json({ success: false, error: 'Current password is incorrect' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
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
    const result = await db.query(`SELECT id, username, role, created_at, updated_at FROM admins ORDER BY created_at DESC`);
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
    const result = await db.query(`
      SELECT id, title, slug, excerpt, content, category, image, 
             author, author_role, read_time, status, created_at, updated_at
      FROM blogs 
      ORDER BY created_at DESC
    `);
    console.log('Blogs fetched count:', result.rows.length);
    res.json({ success: true, blogs: result.rows });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.json({ success: true, blogs: [] });
  }
});

app.post('/api/admin/blogs', authenticateToken, async (req, res) => {
  try {
    const { title, excerpt, content, category, author, author_role, read_time, status } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    await db.query(
      `INSERT INTO blogs (title, slug, excerpt, content, category, author, author_role, read_time, status, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
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
    
    if (title) {
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      await db.query(`UPDATE blogs SET title=$1, slug=$2, updated_at=NOW() WHERE id=$3`, [title, slug, id]);
    }
    if (excerpt !== undefined) await db.query(`UPDATE blogs SET excerpt=$1, updated_at=NOW() WHERE id=$2`, [excerpt, id]);
    if (content !== undefined) await db.query(`UPDATE blogs SET content=$1, updated_at=NOW() WHERE id=$2`, [content, id]);
    if (category !== undefined) await db.query(`UPDATE blogs SET category=$1, updated_at=NOW() WHERE id=$2`, [category, id]);
    if (author !== undefined) await db.query(`UPDATE blogs SET author=$1, updated_at=NOW() WHERE id=$2`, [author, id]);
    if (author_role !== undefined) await db.query(`UPDATE blogs SET author_role=$1, updated_at=NOW() WHERE id=$2`, [author_role, id]);
    if (read_time !== undefined) await db.query(`UPDATE blogs SET read_time=$1, updated_at=NOW() WHERE id=$2`, [read_time, id]);
    if (status !== undefined) await db.query(`UPDATE blogs SET status=$1, updated_at=NOW() WHERE id=$2`, [status, id]);
    
    const updated = await db.query(`SELECT * FROM blogs WHERE id = $1`, [id]);
    res.json({ success: true, message: 'Blog updated successfully', blog: updated.rows[0] });
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
    const result = await db.query(`
      SELECT * FROM jobs 
      WHERE status = 'active' 
      ORDER BY created_at DESC
    `);
    res.json({ success: true, jobs: result.rows });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.json({ success: true, jobs: [] });
  }
});

app.get('/api/admin/jobs', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT id, title, department, location, type, experience, salary, 
             description, requirements, benefits, status, created_at, updated_at
      FROM jobs 
      ORDER BY created_at DESC
    `);
    console.log('Jobs fetched:', result.rows.length);
    res.json({ success: true, jobs: result.rows });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/admin/jobs', authenticateToken, async (req, res) => {
  try {
    const { title, department, location, type, experience, salary, 
            description, requirements, benefits, status } = req.body;
    
    const result = await db.query(
      `INSERT INTO jobs (title, department, location, type, experience, salary, 
                         description, requirements, benefits, status, 
                         created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW())
       RETURNING *`,
      [title, department || '', location || '', type || 'Full-time', 
       experience || '', salary || '', description || '', requirements || '', 
       benefits || '', status || 'active']
    );
    
    res.json({ success: true, message: 'Job created', job: result.rows[0] });
  } catch (error) {
    console.error('Create job error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/admin/jobs/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, department, location, type, experience, salary, 
            description, requirements, benefits, status } = req.body;
    
    console.log('Updating job ID:', id);
    
    const result = await db.query(
      `UPDATE jobs SET 
        title = $1, 
        department = $2, 
        location = $3, 
        type = $4, 
        experience = $5, 
        salary = $6, 
        description = $7, 
        requirements = $8, 
        benefits = $9, 
        status = $10,
        updated_at = NOW()
       WHERE id = $11
       RETURNING *`,
      [title, department, location, type, experience, salary, 
       description, requirements, benefits, status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }
    
    res.json({ success: true, message: 'Job updated', job: result.rows[0] });
  } catch (error) {
    console.error('Update job error:', error);
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
// ========== JOB APPLICATIONS (Public - Apply for Job) ==========
app.post('/api/jobs/:id/apply', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, experience, current_company, resume } = req.body;
    
    console.log('=== JOB APPLICATION RECEIVED ===');
    console.log('Job ID:', id);
    console.log('Name:', name);
    console.log('Email:', email);
    console.log('Phone:', phone);
    console.log('Resume received:', resume ? 'Yes' : 'No');
    
    // Validate required fields
    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, error: 'Name, email and phone are required' });
    }
    
    // Check if job exists and is active
    const jobCheck = await db.query(`SELECT id, title FROM jobs WHERE id = $1 AND status = 'active'`, [id]);
    if (jobCheck.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Job not found or inactive' });
    }
    
    const jobTitle = jobCheck.rows[0].title;
    
    // Insert application
    const result = await db.query(
      `INSERT INTO job_applications (
        job_id, 
        job_title, 
        name, 
        email, 
        phone, 
        experience, 
        current_company, 
        resume, 
        status, 
        applied_at
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', NOW())
      RETURNING *`,
      [
        id, 
        jobTitle, 
        name, 
        email, 
        phone, 
        experience || null, 
        current_company || null, 
        resume || null
      ]
    );
    
    console.log('✅ Application saved! ID:', result.rows[0].id);
    
    res.json({ 
      success: true, 
      message: 'Application submitted successfully',
      applicationId: result.rows[0].id
    });
  } catch (error) {
    console.error('❌ Job application error:', error);
    console.error('Error details:', error.message);
    res.status(500).json({ success: false, error: error.message });
  }
});
// ========== APPLICATIONS ==========
app.get('/api/admin/applications', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        id, 
        job_id, 
        job_title, 
        name, 
        email, 
        phone, 
        experience, 
        current_company, 
        resume, 
        status, 
        applied_at
      FROM job_applications 
      ORDER BY applied_at DESC
    `);
    console.log('✅ Applications fetched:', result.rows.length);
    res.json({ success: true, applications: result.rows });
  } catch (error) {
    console.error('❌ Error fetching applications:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});
app.put('/api/admin/applications/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const result = await db.query(
      `UPDATE job_applications SET status = $1 WHERE id = $2 RETURNING *`,
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Application not found' });
    }
    
    console.log(`✅ Application ${id} status updated to: ${status}`);
    res.json({ success: true, message: 'Status updated' });
  } catch (error) {
    console.error('❌ Error updating status:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== QUOTES ==========
app.post('/api/quotes', async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;
    await db.query(`INSERT INTO quotes (name, email, phone, service, message, status, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, 'pending', NOW(), NOW())`, 
      [name, email, phone, service, message]);
    res.json({ success: true, message: 'Quote submitted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/admin/quotes', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`SELECT id, name, email, phone, service, message, status, created_at FROM quotes ORDER BY created_at DESC`);
    res.json({ success: true, quotes: result.rows });
  } catch (error) {
    res.json({ success: true, quotes: [] });
  }
});

app.put('/api/admin/quotes/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    console.log(`Updating quote ${id} status to: ${status}`);
    
    const result = await db.query(
      `UPDATE quotes SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *`,
      [status, id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Quote not found' });
    }
    
    res.json({ success: true, message: 'Quote status updated', quote: result.rows[0] });
  } catch (error) {
    console.error('Error updating quote status:', error);
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