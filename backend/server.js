const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();

// ========== Body parsers ==========
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== CORS Configuration ==========
app.use(cors({
  origin: ['https://winze-backend-api.onrender.com', 'http://localhost:3000', 'https://winze-frontend.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ========== PostgreSQL Database Connection ==========
const db = new Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'winze_db',
  port: process.env.DB_PORT || 5432,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test database connection
db.connect((err, client, release) => {
  if (err) {
    console.error('Error connecting to PostgreSQL:', err.stack);
  } else {
    console.log('✅ PostgreSQL connected successfully');
    release();
  }
});

// ========== JWT Secret ==========
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this';

// ========== File Upload Configuration ==========
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);
  
  if (mimetype && extname) {
    cb(null, true);
  } else {
    cb(new Error('Only images are allowed'));
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: fileFilter
});

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

// ========== SOCIAL LINKS ROUTES (CRUD) ==========

// GET all social links
app.get('/api/social-links', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM social_links WHERE is_active = 1 ORDER BY display_order ASC');
    res.json({ success: true, links: result.rows });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET single social link
app.get('/api/social-links/:id', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM social_links WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Link not found' });
    }
    res.json({ success: true, link: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// CREATE social link
app.post('/api/admin/social-links', authenticateToken, async (req, res) => {
  const { platform_name, platform_url, icon_class, color_code, display_order, is_active } = req.body;
  
  const query = `INSERT INTO social_links (platform_name, platform_url, icon_class, color_code, display_order, is_active) 
                 VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
  
  try {
    const result = await db.query(query, [platform_name, platform_url, icon_class, color_code, display_order || 0, is_active !== undefined ? is_active : 1]);
    res.status(201).json({ success: true, id: result.rows[0].id, message: 'Link added successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// UPDATE social link
app.put('/api/admin/social-links/:id', authenticateToken, async (req, res) => {
  const { platform_name, platform_url, icon_class, color_code, display_order, is_active } = req.body;
  
  const query = `UPDATE social_links 
                 SET platform_name = $1, platform_url = $2, icon_class = $3, 
                     color_code = $4, display_order = $5, is_active = $6, updated_at = CURRENT_TIMESTAMP
                 WHERE id = $7`;
  
  try {
    await db.query(query, [platform_name, platform_url, icon_class, color_code, display_order, is_active, req.params.id]);
    res.json({ success: true, message: 'Link updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// DELETE social link
app.delete('/api/admin/social-links/:id', authenticateToken, async (req, res) => {
  const query = 'DELETE FROM social_links WHERE id = $1';
  try {
    await db.query(query, [req.params.id]);
    res.json({ success: true, message: 'Link deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Database error' });
  }
});

// ========== BLOG CRUD ROUTES ==========

// GET all published blogs (public)
app.get('/api/blogs', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM blogs WHERE status = $1 ORDER BY created_at DESC', ['published']);
    res.json({ success: true, blogs: result.rows });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET blog by slug (public)
app.get('/api/blogs/:slug', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM blogs WHERE slug = $1 AND status = $2', [req.params.slug, 'published']);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    await db.query('UPDATE blogs SET views = views + 1 WHERE id = $1', [result.rows[0].id]);
    res.json({ success: true, blog: result.rows[0] });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET all blogs for admin
app.get('/api/admin/blogs', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM blogs ORDER BY created_at DESC');
    res.json({ success: true, blogs: result.rows });
  } catch (error) {
    console.error('Error fetching admin blogs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE blog
app.post('/api/admin/blogs', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    const { title, excerpt, content, category, author, author_role, read_time, status } = req.body;
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    
    const result = await db.query(
      `INSERT INTO blogs (title, slug, excerpt, content, category, author, author_role, read_time, status, featured_image, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()) RETURNING id`,
      [title, slug, excerpt || '', content, category || 'General', author || 'Admin', author_role || 'Author', parseInt(read_time) || 5, status || 'draft', image_url]
    );
    
    const newBlog = await db.query('SELECT * FROM blogs WHERE id = $1', [result.rows[0].id]);
    res.json({ success: true, message: 'Blog created successfully', blog: newBlog.rows[0] });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE blog
app.put('/api/admin/blogs/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { title, excerpt, content, category, author, author_role, read_time, status } = req.body;
    
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    if (title !== undefined) { updates.push(`title = $${paramCount++}`); values.push(title); }
    if (excerpt !== undefined) { updates.push(`excerpt = $${paramCount++}`); values.push(excerpt); }
    if (content !== undefined) { updates.push(`content = $${paramCount++}`); values.push(content); }
    if (category !== undefined) { updates.push(`category = $${paramCount++}`); values.push(category); }
    if (author !== undefined) { updates.push(`author = $${paramCount++}`); values.push(author); }
    if (author_role !== undefined) { updates.push(`author_role = $${paramCount++}`); values.push(author_role); }
    if (read_time !== undefined) { updates.push(`read_time = $${paramCount++}`); values.push(parseInt(read_time)); }
    if (status !== undefined) { updates.push(`status = $${paramCount++}`); values.push(status); }
    
    updates.push(`updated_at = NOW()`);
    values.push(id);
    
    await db.query(`UPDATE blogs SET ${updates.join(', ')} WHERE id = $${paramCount}`, values);
    const updatedBlog = await db.query('SELECT * FROM blogs WHERE id = $1', [id]);
    
    res.json({ success: true, message: 'Blog updated successfully', blog: updatedBlog.rows[0] });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE blog
app.delete('/api/admin/blogs/:id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM blogs WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== JOB CRUD ROUTES ==========

// GET all active jobs (public)
app.get('/api/jobs', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM jobs WHERE status = $1 ORDER BY created_at DESC', ['active']);
    res.json({ success: true, jobs: result.rows });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET single job (public)
app.get('/api/jobs/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM jobs WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Job not found' });
    }
    res.json({ success: true, job: result.rows[0] });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET all jobs for admin
app.get('/api/admin/jobs', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM jobs ORDER BY created_at DESC');
    res.json({ success: true, jobs: result.rows });
  } catch (error) {
    console.error('Error fetching admin jobs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE job
app.post('/api/admin/jobs', authenticateToken, async (req, res) => {
  try {
    const { title, department, location, type, experience, salary, description, requirements, benefits, status } = req.body;
    
    const result = await db.query(
      `INSERT INTO jobs (title, department, location, type, experience, salary, description, requirements, benefits, status, created_at, updated_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW(), NOW()) RETURNING id`,
      [title, department, location, type, experience, salary, description, requirements, benefits, status || 'active']
    );
    
    const newJob = await db.query('SELECT * FROM jobs WHERE id = $1', [result.rows[0].id]);
    res.json({ success: true, message: 'Job created successfully', job: newJob.rows[0] });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE job
app.put('/api/admin/jobs/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = [];
    const values = [];
    let paramCount = 1;
    
    Object.keys(req.body).forEach(key => {
      updates.push(`${key} = $${paramCount++}`);
      values.push(req.body[key]);
    });
    
    updates.push(`updated_at = NOW()`);
    values.push(id);
    
    await db.query(`UPDATE jobs SET ${updates.join(', ')} WHERE id = $${paramCount}`, values);
    const updatedJob = await db.query('SELECT * FROM jobs WHERE id = $1', [id]);
    
    res.json({ success: true, message: 'Job updated successfully', job: updatedJob.rows[0] });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE job
app.delete('/api/admin/jobs/:id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM jobs WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== JOB APPLICATION CRUD ROUTES ==========

// Apply for job (public)
app.post('/api/jobs/:id/apply', upload.single('resume'), async (req, res) => {
  try {
    const { name, email, phone, experience, current_company, cover_letter } = req.body;
    const resume_url = req.file ? `/uploads/${req.file.filename}` : null;
    
    const result = await db.query(
      `INSERT INTO applications (job_id, name, email, phone, experience, current_company, cover_letter, resume_url, status, created_at) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'pending', NOW()) RETURNING id`,
      [req.params.id, name, email, phone, experience, current_company, cover_letter, resume_url]
    );
    
    res.json({ success: true, message: 'Application submitted successfully', id: result.rows[0].id });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET all applications (admin)
app.get('/api/admin/applications', authenticateToken, async (req, res) => {
  try {
    const result = await db.query(`
      SELECT a.*, j.title as job_title 
      FROM applications a 
      LEFT JOIN jobs j ON a.job_id = j.id 
      ORDER BY a.created_at DESC
    `);
    res.json({ success: true, applications: result.rows });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE application status (admin)
app.put('/api/admin/applications/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    await db.query('UPDATE applications SET status = $1 WHERE id = $2', [status, req.params.id]);
    res.json({ success: true, message: 'Application status updated' });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== QUOTE CRUD ROUTES ==========

// Submit quote (public)
app.post('/api/quotes', async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;
    
    const result = await db.query(
      'INSERT INTO quotes (name, email, phone, service, message, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING id',
      [name, email, phone, service, message]
    );
    
    res.json({ success: true, message: 'Quote submitted successfully', id: result.rows[0].id });
  } catch (error) {
    console.error('Error submitting quote:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET all quotes (admin)
app.get('/api/admin/quotes', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM quotes ORDER BY created_at DESC');
    res.json({ success: true, quotes: result.rows });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE quote (admin)
app.delete('/api/admin/quotes/:id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM quotes WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Quote deleted successfully' });
  } catch (error) {
    console.error('Error deleting quote:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== ADMIN CRUD ROUTES ==========

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check in admin_users table first
    const userResult = await db.query('SELECT * FROM admin_users WHERE username = $1', [username]);
    
    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      const validPassword = await bcrypt.compare(password, user.password);
      if (validPassword) {
        const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        return res.json({ success: true, token, username: user.username, role: user.role, message: 'Login successful' });
      }
    }
    
    // Default admin account
    if (username === 'admin' && password === 'Winzebglr') {
      const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({ success: true, token, username, role: 'admin', message: 'Login successful' });
    }
    
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// GET all admin users (super admin)
app.get('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    const result = await db.query('SELECT id, username, role, created_at FROM admin_users ORDER BY created_at DESC');
    res.json({ success: true, users: result.rows });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// CREATE admin user (super admin)
app.post('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    const { username, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const result = await db.query(
      'INSERT INTO admin_users (username, password, role, created_at) VALUES ($1, $2, $3, NOW()) RETURNING id',
      [username, hashedPassword, role || 'admin']
    );
    
    res.json({ success: true, id: result.rows[0].id, message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// DELETE admin user (super admin)
app.delete('/api/admin/users/:id', authenticateToken, async (req, res) => {
  try {
    await db.query('DELETE FROM admin_users WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== ADMIN STATS ==========
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  try {
    const totalBlogs = await db.query('SELECT COUNT(*) as count FROM blogs');
    const publishedBlogs = await db.query('SELECT COUNT(*) as count FROM blogs WHERE status = $1', ['published']);
    const totalJobs = await db.query('SELECT COUNT(*) as count FROM jobs');
    const activeJobs = await db.query('SELECT COUNT(*) as count FROM jobs WHERE status = $1', ['active']);
    const totalApplications = await db.query('SELECT COUNT(*) as count FROM applications');
    const totalQuotes = await db.query('SELECT COUNT(*) as count FROM quotes');
    
    res.json({ 
      success: true, 
      stats: {
        totalBlogs: parseInt(totalBlogs.rows[0].count),
        publishedBlogs: parseInt(publishedBlogs.rows[0].count),
        totalJobs: parseInt(totalJobs.rows[0].count),
        activeJobs: parseInt(activeJobs.rows[0].count),
        totalApplications: parseInt(totalApplications.rows[0].count),
        totalQuotes: parseInt(totalQuotes.rows[0].count)
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== CLICK TRACKING ==========
app.post('/api/track', async (req, res) => {
  try {
    const { link_title, link_url, page_url, ip_address } = req.body;
    
    const result = await db.query(
      'INSERT INTO clicks (link_title, link_url, page_url, ip_address, clicked_at) VALUES ($1, $2, $3, $4, NOW()) RETURNING id',
      [link_title, link_url, page_url, ip_address]
    );
    
    res.json({ success: true, message: 'Click tracked', id: result.rows[0].id });
  } catch (error) {
    console.error('Error tracking click:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/clicks', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM clicks ORDER BY clicked_at DESC');
    res.json({ success: true, clicks: result.rows });
  } catch (error) {
    console.error('Error fetching clicks:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== HEALTH CHECK ==========
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date() });
});

// ========== SERVE UPLOADED FILES ==========
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ========== ERROR HANDLING MIDDLEWARE ==========
app.use((err, req, res, next) => {
  console.error('Global error handler:', err);
  
  if (err instanceof multer.MulterError) {
    if (err.code === 'FILE_TOO_LARGE') {
      return res.status(400).json({ success: false, error: 'File too large (max 5MB)' });
    }
    return res.status(400).json({ success: false, error: err.message });
  }
  
  res.status(500).json({ success: false, error: err.message || 'Internal server error' });
});

// ========== START SERVER ==========
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 API available at http://localhost:${PORT}/api`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📍 Social links: http://localhost:${PORT}/api/social-links`);
  console.log(`📍 Blogs: http://localhost:${PORT}/api/blogs`);
  console.log(`📍 Jobs: http://localhost:${PORT}/api/jobs`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});