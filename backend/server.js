const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();

// ========== IMPORTANT: Body parsers MUST be before routes ==========
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========== CORS Configuration ==========
app.use(cors({
  origin: ['https://winze-backend-api.onrender.com', 'http://localhost:3000', 'https://winze-frontend.onrender.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// ========== Database Connection ==========
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'winze_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
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

// ========== IMPORT SOCIAL LINKS ROUTER ==========
const socialLinksRouter = require('./routes/socialRoutes');

// ========== Routes ==========

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date() });
});

// ========== MOUNT SOCIAL LINKS ROUTES ==========
// Public routes (no authentication needed for GET)
app.use('/api/social-links', socialLinksRouter);

// Admin routes (authentication required for POST, PUT, DELETE)
app.use('/api/admin/social-links', authenticateToken, socialLinksRouter);

// ========== BLOG ROUTES ==========

// Get all published blogs (public)
app.get('/api/blogs', async (req, res) => {
  try {
    const [blogs] = await db.execute(
      'SELECT * FROM blogs WHERE status = "published" ORDER BY created_at DESC'
    );
    res.json({ success: true, blogs });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get blog by slug (public)
app.get('/api/blogs/:slug', async (req, res) => {
  try {
    const [blogs] = await db.execute(
      'SELECT * FROM blogs WHERE slug = ? AND status = "published"',
      [req.params.slug]
    );
    
    if (blogs.length === 0) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    
    await db.execute(
      'UPDATE blogs SET views = views + 1 WHERE id = ?',
      [blogs[0].id]
    );
    
    res.json({ success: true, blog: blogs[0] });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all blogs for admin
app.get('/api/admin/blogs', authenticateToken, async (req, res) => {
  try {
    const [blogs] = await db.execute(
      'SELECT * FROM blogs ORDER BY created_at DESC'
    );
    res.json({ success: true, blogs });
  } catch (error) {
    console.error('Error fetching admin blogs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create blog
app.post('/api/admin/blogs', authenticateToken, upload.single('image'), async (req, res) => {
  try {
    console.log('Create blog request body:', req.body);
    console.log('Uploaded file:', req.file);
    
    const { 
      title, excerpt, content, category, 
      author, author_role, read_time, status 
    } = req.body;
    
    const slug = title.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '');
    
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;
    
    const [result] = await db.execute(
      `INSERT INTO blogs 
      (title, slug, excerpt, content, category, author, author_role, read_time, status, featured_image, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [title, slug, excerpt || '', content, category || 'General', 
       author || 'Admin', author_role || 'Author', parseInt(read_time) || 5, 
       status || 'draft', image_url]
    );
    
    const [newBlog] = await db.execute('SELECT * FROM blogs WHERE id = ?', [result.insertId]);
    
    res.json({ 
      success: true, 
      message: 'Blog created successfully',
      blog: newBlog[0]
    });
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// UPDATE BLOG
app.put('/api/admin/blogs/:id', authenticateToken, async (req, res) => {
  try {
    console.log('=== UPDATE BLOG REQUEST ===');
    console.log('Blog ID:', req.params.id);
    console.log('Request body:', req.body);
    
    const { id } = req.params;
    
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        success: false, 
        error: 'No data provided for update' 
      });
    }
    
    const { title, excerpt, content, category, author, author_role, read_time, status } = req.body;
    
    const updates = [];
    const values = [];
    
    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (excerpt !== undefined) {
      updates.push('excerpt = ?');
      values.push(excerpt);
    }
    if (content !== undefined) {
      updates.push('content = ?');
      values.push(content);
    }
    if (category !== undefined) {
      updates.push('category = ?');
      values.push(category);
    }
    if (author !== undefined) {
      updates.push('author = ?');
      values.push(author);
    }
    if (author_role !== undefined) {
      updates.push('author_role = ?');
      values.push(author_role);
    }
    if (read_time !== undefined) {
      updates.push('read_time = ?');
      values.push(parseInt(read_time));
    }
    if (status !== undefined) {
      updates.push('status = ?');
      values.push(status);
    }
    
    updates.push('updated_at = NOW()');
    
    if (updates.length === 1) {
      return res.status(400).json({ 
        success: false, 
        error: 'No valid fields to update' 
      });
    }
    
    values.push(id);
    const query = `UPDATE blogs SET ${updates.join(', ')} WHERE id = ?`;
    
    console.log('Executing query:', query);
    console.log('With values:', values);
    
    const [result] = await db.execute(query, values);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false, 
        error: 'Blog not found' 
      });
    }
    
    const [updatedBlog] = await db.execute('SELECT * FROM blogs WHERE id = ?', [id]);
    
    res.json({ 
      success: true, 
      message: 'Blog updated successfully',
      blog: updatedBlog[0]
    });
    
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Delete blog
app.delete('/api/admin/blogs/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const [result] = await db.execute('DELETE FROM blogs WHERE id = ?', [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, error: 'Blog not found' });
    }
    
    res.json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== ADMIN LOGIN ==========
app.post('/api/admin/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (username === 'admin' && password === 'Winzebglr') {
      const token = jwt.sign({ username, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({ 
        success: true, 
        token, 
        username, 
        role: 'admin',
        message: 'Login successful' 
      });
    }
    
    const [users] = await db.execute('SELECT * FROM admin_users WHERE username = ?', [username]);
    
    if (users.length === 0) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    const user = users[0];
    const validPassword = await bcrypt.compare(password, user.password);
    
    if (!validPassword) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user.id, username: user.username, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
    
    res.json({ 
      success: true, 
      token, 
      username: user.username, 
      role: user.role,
      message: 'Login successful' 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== ADMIN STATS ==========
app.get('/api/admin/stats', authenticateToken, async (req, res) => {
  try {
    const [totalBlogs] = await db.execute('SELECT COUNT(*) as count FROM blogs');
    const [publishedBlogs] = await db.execute('SELECT COUNT(*) as count FROM blogs WHERE status = "published"');
    const [totalJobs] = await db.execute('SELECT COUNT(*) as count FROM jobs');
    const [activeJobs] = await db.execute('SELECT COUNT(*) as count FROM jobs WHERE status = "active"');
    const [totalApplications] = await db.execute('SELECT COUNT(*) as count FROM applications');
    const [totalQuotes] = await db.execute('SELECT COUNT(*) as count FROM quotes');
    
    res.json({ 
      success: true, 
      stats: {
        totalBlogs: totalBlogs[0].count,
        publishedBlogs: publishedBlogs[0].count,
        totalJobs: totalJobs[0].count,
        activeJobs: activeJobs[0].count,
        totalApplications: totalApplications[0].count,
        totalQuotes: totalQuotes[0].count
      }
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== JOB ROUTES ==========
app.get('/api/jobs', async (req, res) => {
  try {
    const [jobs] = await db.execute(
      'SELECT * FROM jobs WHERE status = "active" ORDER BY created_at DESC'
    );
    res.json({ success: true, jobs });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/admin/jobs', authenticateToken, async (req, res) => {
  try {
    const [jobs] = await db.execute('SELECT * FROM jobs ORDER BY created_at DESC');
    res.json({ success: true, jobs });
  } catch (error) {
    console.error('Error fetching admin jobs:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/admin/jobs', authenticateToken, async (req, res) => {
  try {
    const { title, department, location, type, experience, salary, description, requirements, benefits, status } = req.body;
    
    const [result] = await db.execute(
      `INSERT INTO jobs 
      (title, department, location, type, experience, salary, description, requirements, benefits, status, created_at, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [title, department, location, type, experience, salary, description, requirements, benefits, status || 'active']
    );
    
    const [newJob] = await db.execute('SELECT * FROM jobs WHERE id = ?', [result.insertId]);
    
    res.json({ success: true, message: 'Job created successfully', job: newJob[0] });
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/admin/jobs/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = [];
    const values = [];
    
    Object.keys(req.body).forEach(key => {
      updates.push(`${key} = ?`);
      values.push(req.body[key]);
    });
    
    updates.push('updated_at = NOW()');
    values.push(id);
    
    await db.execute(`UPDATE jobs SET ${updates.join(', ')} WHERE id = ?`, values);
    
    const [updatedJob] = await db.execute('SELECT * FROM jobs WHERE id = ?', [id]);
    
    res.json({ success: true, message: 'Job updated successfully', job: updatedJob[0] });
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete('/api/admin/jobs/:id', authenticateToken, async (req, res) => {
  try {
    await db.execute('DELETE FROM jobs WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== APPLICATION ROUTES ==========
app.get('/api/admin/applications', authenticateToken, async (req, res) => {
  try {
    const [applications] = await db.execute(`
      SELECT a.*, j.title as job_title 
      FROM applications a 
      LEFT JOIN jobs j ON a.job_id = j.id 
      ORDER BY a.created_at DESC
    `);
    res.json({ success: true, applications });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/admin/applications/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    await db.execute('UPDATE applications SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true, message: 'Application status updated' });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== QUOTE ROUTES ==========
app.post('/api/quotes', async (req, res) => {
  try {
    const { name, email, phone, service, message } = req.body;
    
    const [result] = await db.execute(
      'INSERT INTO quotes (name, email, phone, service, message, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [name, email, phone, service, message]
    );
    
    res.json({ success: true, message: 'Quote submitted successfully', id: result.insertId });
  } catch (error) {
    console.error('Error submitting quote:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/admin/quotes', authenticateToken, async (req, res) => {
  try {
    const [quotes] = await db.execute('SELECT * FROM quotes ORDER BY created_at DESC');
    res.json({ success: true, quotes });
  } catch (error) {
    console.error('Error fetching quotes:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ========== CLICK TRACKING ==========
app.post('/api/track', async (req, res) => {
  try {
    const { link_title, link_url, page_url, ip_address } = req.body;
    
    const [result] = await db.execute(
      'INSERT INTO clicks (link_title, link_url, page_url, ip_address, clicked_at) VALUES (?, ?, ?, ?, NOW())',
      [link_title, link_url, page_url, ip_address]
    );
    
    res.json({ success: true, message: 'Click tracked', id: result.insertId });
  } catch (error) {
    console.error('Error tracking click:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/clicks', async (req, res) => {
  try {
    const [clicks] = await db.execute('SELECT * FROM clicks ORDER BY clicked_at DESC');
    res.json({ success: true, clicks });
  } catch (error) {
    console.error('Error fetching clicks:', error);
    res.status(500).json({ success: false, error: error.message });
  }
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
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  process.exit(0);
});