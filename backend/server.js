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
        'https://creative-belekoy-0cae1a.netlify.app',
        'http://localhost:5000',
        'http://localhost:3000'
    ],
    credentials: true
}));
app.use(express.json());

// ========== AUTHENTICATION MIDDLEWARE ==========
const requireAuth = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    
    if (!authHeader) {
        return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!token || token !== 'admin-session-token') {
        return res.status(401).json({ success: false, error: 'Invalid or expired token' });
    }
    
    next();
};

const requireSuperAdmin = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.split(' ')[1];
    
    if (!token || token !== 'admin-session-token') {
        return res.status(401).json({ success: false, error: 'Authentication required' });
    }
    
    try {
        const result = await db.query(`SELECT role FROM admins WHERE username = 'superadmin'`);
        if (result.rows.length > 0 && result.rows[0].role === 'super_admin') {
            next();
        } else {
            res.status(403).json({ success: false, error: 'Super admin access required' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: 'Server error' });
    }
};

// ========== DATABASE INITIALIZATION ==========
const initDatabase = async () => {
    try {
        // Existing tables
        await db.query(`
            CREATE TABLE IF NOT EXISTS social_links (
                id SERIAL PRIMARY KEY,
                platform_name VARCHAR(50) NOT NULL,
                platform_url VARCHAR(255) NOT NULL,
                icon_class VARCHAR(50) NOT NULL,
                color_code VARCHAR(20) NOT NULL,
                display_order INT DEFAULT 0,
                is_active INT DEFAULT 1,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS clicks (
                id SERIAL PRIMARY KEY,
                link_url VARCHAR(255) NOT NULL,
                link_title VARCHAR(255) NOT NULL,
                ip_address VARCHAR(45),
                clicked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        await db.query(`
            CREATE TABLE IF NOT EXISTS admins (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                password_hash VARCHAR(255) NOT NULL,
                role VARCHAR(20) DEFAULT 'admin',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // NEW: Blogs table
        await db.query(`
            CREATE TABLE IF NOT EXISTS blogs (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                slug VARCHAR(255) UNIQUE NOT NULL,
                excerpt TEXT,
                content TEXT,
                category VARCHAR(100),
                image VARCHAR(500),
                author VARCHAR(100),
                author_role VARCHAR(100),
                read_time INT DEFAULT 5,
                views INT DEFAULT 0,
                status VARCHAR(20) DEFAULT 'draft',
                created_by INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // NEW: Jobs table
        await db.query(`
            CREATE TABLE IF NOT EXISTS jobs (
                id SERIAL PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                department VARCHAR(100),
                location VARCHAR(255),
                type VARCHAR(50) DEFAULT 'Full-time',
                experience VARCHAR(50),
                salary VARCHAR(100),
                description TEXT,
                requirements TEXT,
                benefits TEXT,
                status VARCHAR(20) DEFAULT 'active',
                deadline DATE,
                posted_by INT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // NEW: Job applications table
        await db.query(`
            CREATE TABLE IF NOT EXISTS job_applications (
                id SERIAL PRIMARY KEY,
                job_id INT REFERENCES jobs(id) ON DELETE CASCADE,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                phone VARCHAR(20),
                experience VARCHAR(50),
                current_company VARCHAR(100),
                current_ctc VARCHAR(50),
                notice_period VARCHAR(50),
                cover_letter TEXT,
                resume_url VARCHAR(500),
                status VARCHAR(20) DEFAULT 'pending',
                applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // NEW: Quotes table
        await db.query(`
            CREATE TABLE IF NOT EXISTS quotes (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                email VARCHAR(100) NOT NULL,
                phone VARCHAR(20),
                service VARCHAR(255),
                message TEXT,
                status VARCHAR(20) DEFAULT 'pending',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        // Add role column if not exists
        await db.query(`
            ALTER TABLE admins ADD COLUMN IF NOT EXISTS role VARCHAR(20) DEFAULT 'admin'
        `);

        // Insert default super admin
        const superAdminCheck = await db.query(`SELECT * FROM admins WHERE username = 'superadmin'`);
        if (superAdminCheck.rows.length === 0) {
            const hashedPassword = await bcrypt.hash('SuperAdmin@2024', 10);
            await db.query(
                `INSERT INTO admins (username, password_hash, role) VALUES ($1, $2, $3)`,
                ['superadmin', hashedPassword, 'super_admin']
            );
            console.log('✅ Super admin created (username: superadmin, password: SuperAdmin@2024)');
        }

        // Insert default admin
        const adminCheck = await db.query(`SELECT * FROM admins WHERE username = 'admin'`);
        if (adminCheck.rows.length === 0) {
            const hashedPassword = await bcrypt.hash('admin123', 10);
            await db.query(
                `INSERT INTO admins (username, password_hash, role) VALUES ($1, $2, $3)`,
                ['admin', hashedPassword, 'admin']
            );
            console.log('✅ Admin created (username: admin, password: admin123)');
        }

        // Insert default social links if empty
        const socialResult = await db.query('SELECT COUNT(*) FROM social_links');
        if (parseInt(socialResult.rows[0].count) === 0) {
            await db.query(`
                INSERT INTO social_links (platform_name, platform_url, icon_class, color_code, display_order) VALUES
                ('LinkedIn', 'https://www.linkedin.com/company/winze-technologies', 'faLinkedin', '#0077b5', 1),
                ('WhatsApp', 'https://wa.me/919880010417', 'faWhatsapp', '#25D366', 2),
                ('Facebook', 'https://www.facebook.com/winzetechnologies', 'faFacebook', '#1877f2', 3),
                ('Instagram', 'https://www.instagram.com/winzetechnologies', 'faInstagram', '#e4405f', 4)
            `);
            console.log('✅ Default social links inserted');
        }

        console.log('✅ All database tables ready');
    } catch (err) {
        console.error('Database init error:', err.message);
    }
};

initDatabase();

// ========== EXISTING ROUTES ==========
app.get('/', (req, res) => {
    res.json({ 
        message: 'Winze API is running', 
        endpoints: ['/api/health', '/api/social-links', '/api/track', '/api/clicks', '/api/blogs', '/api/jobs', '/api/admin/*'] 
    });
});

app.get('/api/health', async (req, res) => {
    try {
        const result = await db.query('SELECT NOW() as time');
        res.json({ status: 'ok', database: 'PostgreSQL', time: result.rows[0].time });
    } catch (err) {
        res.json({ status: 'error', message: err.message });
    }
});

app.get('/api/social-links', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM social_links WHERE is_active = 1 ORDER BY display_order');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching social links:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/social-links', requireAuth, async (req, res) => {
    const { platform_name, platform_url, icon_class, color_code, display_order, is_active } = req.body;
    
    try {
        const query = `INSERT INTO social_links (platform_name, platform_url, icon_class, color_code, display_order, is_active) 
                       VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
        const result = await db.query(query, [
            platform_name, platform_url, icon_class, color_code, display_order || 0, is_active !== undefined ? is_active : 1
        ]);
        res.status(201).json({ id: result.rows[0].id, message: 'Link added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

app.put('/api/social-links/:id', requireAuth, async (req, res) => {
    const { platform_name, platform_url, icon_class, color_code, display_order, is_active } = req.body;
    
    try {
        const query = `UPDATE social_links 
                       SET platform_name = $1, platform_url = $2, icon_class = $3, 
                           color_code = $4, display_order = $5, is_active = $6
                       WHERE id = $7`;
        await db.query(query, [platform_name, platform_url, icon_class, color_code, display_order, is_active, req.params.id]);
        res.json({ message: 'Link updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

app.delete('/api/social-links/:id', requireAuth, async (req, res) => {
    try {
        await db.query('DELETE FROM social_links WHERE id = $1', [req.params.id]);
        res.json({ message: 'Link deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error', details: err.message });
    }
});

app.post('/api/track', async (req, res) => {
    const { link_url, link_title, ip_address } = req.body;
    
    if (!link_url || !link_title) {
        return res.status(400).json({ success: false, error: 'Missing required fields' });
    }
    
    try {
        const result = await db.query(
            'INSERT INTO clicks (link_url, link_title, ip_address) VALUES ($1, $2, $3) RETURNING id',
            [link_url, link_title, ip_address || '0.0.0.0']
        );
        res.json({ success: true, id: result.rows[0].id });
    } catch (err) {
        console.error('Error tracking click:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/clicks', requireAuth, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM clicks ORDER BY clicked_at DESC');
        res.json({ success: true, clicks: result.rows, total: result.rows.length });
    } catch (err) {
        console.error('Error fetching clicks:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/clicks/stats', requireAuth, async (req, res) => {
    try {
        const totalResult = await db.query('SELECT COUNT(*) as count FROM clicks');
        const todayResult = await db.query("SELECT COUNT(*) as count FROM clicks WHERE DATE(clicked_at) = CURRENT_DATE");
        
        res.json({ 
            success: true, 
            stats: {
                total: parseInt(totalResult.rows[0].count),
                today: parseInt(todayResult.rows[0].count)
            }
        });
    } catch (err) {
        console.error('Error getting stats:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/admin/login', async (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ success: false, error: 'Username and password required' });
    }
    
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
        
        const token = 'admin-session-token';
        
        res.json({ 
            success: true, 
            admin: { id: admin.id, username: admin.username, role: admin.role },
            token: token
        });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

app.post('/api/admin/change-password', requireAuth, async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;
    
    try {
        const result = await db.query('SELECT * FROM admins WHERE username = $1', [username]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, error: 'User not found' });
        }
        
        const admin = result.rows[0];
        const validPassword = await bcrypt.compare(oldPassword, admin.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ success: false, error: 'Current password is incorrect' });
        }
        
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await db.query('UPDATE admins SET password_hash = $1, updated_at = CURRENT_TIMESTAMP WHERE username = $2', 
            [hashedPassword, username]);
        
        res.json({ success: true, message: 'Password changed successfully' });
    } catch (err) {
        console.error('Change password error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

app.post('/api/admin/change-username', requireAuth, async (req, res) => {
    const { username, newUsername, password } = req.body;
    
    try {
        const result = await db.query('SELECT * FROM admins WHERE username = $1', [username]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ success: false, error: 'User not found' });
        }
        
        const admin = result.rows[0];
        const validPassword = await bcrypt.compare(password, admin.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ success: false, error: 'Current password is incorrect' });
        }
        
        const existingUser = await db.query('SELECT * FROM admins WHERE username = $1', [newUsername]);
        if (existingUser.rows.length > 0) {
            return res.status(400).json({ success: false, error: 'Username already exists' });
        }
        
        await db.query('UPDATE admins SET username = $1, updated_at = CURRENT_TIMESTAMP WHERE username = $2', 
            [newUsername, username]);
        
        res.json({ success: true, message: 'Username changed successfully' });
    } catch (err) {
        console.error('Change username error:', err);
        res.status(500).json({ success: false, error: 'Server error' });
    }
});

// ========== BLOG ROUTES ==========
app.get('/api/blogs', async (req, res) => {
    try {
        const result = await db.query(
            `SELECT id, title, slug, excerpt, category, image, author, author_role, read_time, views, created_at 
             FROM blogs 
             WHERE status = 'published' 
             ORDER BY created_at DESC`
        );
        res.json({ success: true, blogs: result.rows });
    } catch (err) {
        console.error('Error fetching blogs:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/blogs/:slug', async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM blogs WHERE slug = $1 AND status = 'published'`, [req.params.slug]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Blog not found' });
        }
        
        await db.query(`UPDATE blogs SET views = views + 1 WHERE id = $1`, [result.rows[0].id]);
        
        res.json({ success: true, blog: result.rows[0] });
    } catch (err) {
        console.error('Error fetching blog:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/admin/blogs', requireAuth, async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM blogs ORDER BY created_at DESC`);
        res.json({ success: true, blogs: result.rows });
    } catch (err) {
        console.error('Error fetching admin blogs:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/admin/blogs', requireAuth, upload.single('image'), async (req, res) => {
    try {
        const { title, excerpt, content, category, author, author_role, read_time, status } = req.body;
        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        const image = req.file ? `/uploads/${req.file.filename}` : '';
        
        const result = await db.query(
            `INSERT INTO blogs (title, slug, excerpt, content, category, image, author, author_role, read_time, status) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING id`,
            [title, slug, excerpt, content, category, image, author, author_role, read_time || 5, status || 'draft']
        );
        
        res.json({ success: true, id: result.rows[0].id, message: 'Blog created successfully' });
    } catch (err) {
        console.error('Error creating blog:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.put('/api/admin/blogs/:id', requireAuth, upload.single('image'), async (req, res) => {
    try {
        const { title, excerpt, content, category, author, author_role, read_time, status } = req.body;
        let query = `UPDATE blogs SET title=$1, excerpt=$2, content=$3, category=$4, author=$5, author_role=$6, read_time=$7, status=$8, updated_at=CURRENT_TIMESTAMP`;
        let params = [title, excerpt, content, category, author, author_role, read_time, status];
        
        if (req.file) {
            query += `, image=$9`;
            params.push(`/uploads/${req.file.filename}`);
        }
        
        query += ` WHERE id=$${params.length + 1}`;
        params.push(req.params.id);
        
        await db.query(query, params);
        res.json({ success: true, message: 'Blog updated successfully' });
    } catch (err) {
        console.error('Error updating blog:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.delete('/api/admin/blogs/:id', requireAuth, async (req, res) => {
    try {
        await db.query(`DELETE FROM blogs WHERE id = $1`, [req.params.id]);
        res.json({ success: true, message: 'Blog deleted successfully' });
    } catch (err) {
        console.error('Error deleting blog:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== JOB ROUTES ==========
app.get('/api/jobs', async (req, res) => {
    try {
        const result = await db.query(
            `SELECT id, title, department, location, type, experience, salary, description, requirements, benefits, deadline, created_at 
             FROM jobs 
             WHERE status = 'active' AND (deadline IS NULL OR deadline > CURRENT_DATE)
             ORDER BY created_at DESC`
        );
        res.json({ success: true, jobs: result.rows });
    } catch (err) {
        console.error('Error fetching jobs:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/jobs/:id', async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM jobs WHERE id = $1`, [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Job not found' });
        }
        res.json({ success: true, job: result.rows[0] });
    } catch (err) {
        console.error('Error fetching job:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/jobs/:id/apply', upload.single('resume'), async (req, res) => {
    try {
        const { name, email, phone, experience, current_company, current_ctc, notice_period, cover_letter } = req.body;
        const resume_url = req.file ? `/uploads/${req.file.filename}` : '';
        
        await db.query(
            `INSERT INTO job_applications (job_id, name, email, phone, experience, current_company, current_ctc, notice_period, cover_letter, resume_url) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
            [req.params.id, name, email, phone, experience, current_company, current_ctc, notice_period, cover_letter, resume_url]
        );
        
        res.json({ success: true, message: 'Application submitted successfully' });
    } catch (err) {
        console.error('Error submitting application:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/admin/jobs', requireAuth, async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM jobs ORDER BY created_at DESC`);
        res.json({ success: true, jobs: result.rows });
    } catch (err) {
        console.error('Error fetching admin jobs:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/admin/jobs', requireAuth, async (req, res) => {
    try {
        const { title, department, location, type, experience, salary, description, requirements, benefits, status, deadline } = req.body;
        
        const result = await db.query(
            `INSERT INTO jobs (title, department, location, type, experience, salary, description, requirements, benefits, status, deadline) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id`,
            [title, department, location, type, experience, salary, description, requirements, benefits, status || 'active', deadline]
        );
        
        res.json({ success: true, id: result.rows[0].id, message: 'Job posted successfully' });
    } catch (err) {
        console.error('Error creating job:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.put('/api/admin/jobs/:id', requireAuth, async (req, res) => {
    try {
        const { title, department, location, type, experience, salary, description, requirements, benefits, status, deadline } = req.body;
        
        await db.query(
            `UPDATE jobs SET title=$1, department=$2, location=$3, type=$4, experience=$5, salary=$6, description=$7, requirements=$8, benefits=$9, status=$10, deadline=$11, updated_at=CURRENT_TIMESTAMP 
             WHERE id=$12`,
            [title, department, location, type, experience, salary, description, requirements, benefits, status, deadline, req.params.id]
        );
        
        res.json({ success: true, message: 'Job updated successfully' });
    } catch (err) {
        console.error('Error updating job:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.delete('/api/admin/jobs/:id', requireAuth, async (req, res) => {
    try {
        await db.query(`DELETE FROM jobs WHERE id = $1`, [req.params.id]);
        res.json({ success: true, message: 'Job deleted successfully' });
    } catch (err) {
        console.error('Error deleting job:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/admin/applications', requireAuth, async (req, res) => {
    try {
        const result = await db.query(
            `SELECT ja.*, j.title as job_title 
             FROM job_applications ja 
             LEFT JOIN jobs j ON ja.job_id = j.id 
             ORDER BY ja.applied_at DESC`
        );
        res.json({ success: true, applications: result.rows });
    } catch (err) {
        console.error('Error fetching applications:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.put('/api/admin/applications/:id/status', requireAuth, async (req, res) => {
    try {
        const { status } = req.body;
        await db.query(`UPDATE job_applications SET status = $1 WHERE id = $2`, [status, req.params.id]);
        res.json({ success: true, message: 'Application status updated' });
    } catch (err) {
        console.error('Error updating application:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== QUOTE ROUTES ==========
app.post('/api/quotes', async (req, res) => {
    try {
        const { name, email, phone, service, message } = req.body;
        await db.query(
            `INSERT INTO quotes (name, email, phone, service, message) VALUES ($1, $2, $3, $4, $5)`,
            [name, email, phone, service, message]
        );
        res.json({ success: true, message: 'Quote request submitted successfully' });
    } catch (err) {
        console.error('Error submitting quote:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/admin/quotes', requireAuth, async (req, res) => {
    try {
        const result = await db.query(`SELECT * FROM quotes ORDER BY created_at DESC`);
        res.json({ success: true, quotes: result.rows });
    } catch (err) {
        console.error('Error fetching quotes:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== USER MANAGEMENT (Super Admin only) ==========
app.get('/api/admin/users', requireAuth, requireSuperAdmin, async (req, res) => {
    try {
        const result = await db.query(`SELECT id, username, role, created_at FROM admins`);
        res.json({ success: true, users: result.rows });
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.post('/api/admin/users', requireAuth, requireSuperAdmin, async (req, res) => {
    try {
        const { username, password, role } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await db.query(
            `INSERT INTO admins (username, password_hash, role) VALUES ($1, $2, $3)`,
            [username, hashedPassword, role || 'admin']
        );
        
        res.json({ success: true, message: 'Admin created successfully' });
    } catch (err) {
        if (err.code === '23505') {
            res.status(400).json({ success: false, error: 'Username already exists' });
        } else {
            console.error('Error creating admin:', err);
            res.status(500).json({ success: false, error: err.message });
        }
    }
});

app.delete('/api/admin/users/:id', requireAuth, requireSuperAdmin, async (req, res) => {
    try {
        const superAdminCheck = await db.query(`SELECT COUNT(*) FROM admins WHERE role = 'super_admin'`);
        const userToDelete = await db.query(`SELECT role FROM admins WHERE id = $1`, [req.params.id]);
        
        if (userToDelete.rows.length > 0 && userToDelete.rows[0].role === 'super_admin' && parseInt(superAdminCheck.rows[0].count) <= 1) {
            return res.status(400).json({ success: false, error: 'Cannot delete the last super admin' });
        }
        
        await db.query(`DELETE FROM admins WHERE id = $1`, [req.params.id]);
        res.json({ success: true, message: 'Admin deleted successfully' });
    } catch (err) {
        console.error('Error deleting admin:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== DASHBOARD STATS ==========
app.get('/api/admin/stats', requireAuth, async (req, res) => {
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
        console.error('Error fetching stats:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`✅ Database: PostgreSQL`);
    console.log(`📡 Endpoints ready`);
});