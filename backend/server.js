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
  
  // SIMPLE HARDCODED LOGIN - ALWAYS WORKS
  if (username === 'admin' && password === 'Winzebglr') {
    const token = jwt.sign({ id: 1, username: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ 
      success: true, 
      token, 
      admin: { id: 1, username: 'admin', role: 'admin' }
    });
  }
  
  // Optional: Also check database if you have data there
  try {
    const result = await db.query(`SELECT * FROM admins WHERE username = $1`, [username]);
    if (result.rows.length > 0) {
      const admin = result.rows[0];
      const passwordHash = admin.password_hash || admin.password;
      const validPassword = await bcrypt.compare(password, passwordHash);
      if (validPassword) {
        const token = jwt.sign({ id: admin.id, username: admin.username, role: admin.role }, JWT_SECRET, { expiresIn: '24h' });
        return res.json({ success: true, token, admin: { id: admin.id, username: admin.username, role: admin.role } });
      }
    }
  } catch (error) {
    console.error('Database login error:', error);
  }
  
  res.status(401).json({ success: false, error: 'Invalid credentials' });
});
// ========== CHANGE USERNAME ==========
app.post('/api/admin/change-username', authenticateToken, async (req, res) => {
  const { newUsername, password } = req.body;
  const adminId = req.user.id;
  
  try {
    const result = await db.query(`SELECT * FROM admins WHERE id = $1`, [adminId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, error: 'Admin not found' });
    }
    
    const admin = result.rows[0];
    const passwordHash = admin.password_hash || admin.password;
    const validPassword = await bcrypt.compare(password, passwordHash);
    
    if (!validPassword) {
      return res.status(401).json({ success: false, error: 'Password is incorrect' });
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

// ========== REST OF YOUR ROUTES (BLOGS, JOBS, ETC.) ==========
// ... (keep all your existing routes for blogs, jobs, social links, etc.)

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Server running on port ${PORT}`);
});