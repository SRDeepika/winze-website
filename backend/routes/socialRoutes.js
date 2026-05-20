const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Your PostgreSQL connection

// ========== GET all active social links (PUBLIC) ==========
router.get('/', async (req, res) => {
    try {
        const query = 'SELECT * FROM social_links WHERE is_active = 1 ORDER BY display_order ASC';
        
        db.query(query, (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ success: false, error: 'Database error' });
            }
            
            // Format the response for frontend
            const links = results.rows.map(link => ({
                id: link.id,
                platform: link.platform_name.toLowerCase(),
                url: link.platform_url,
                icon: link.icon_class,
                color: link.color_code,
                is_active: link.is_active === 1 || link.is_active === true,
                display_order: link.display_order
            }));
            
            res.json({ success: true, links });
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== GET single social link by ID ==========
router.get('/:id', async (req, res) => {
    try {
        const query = 'SELECT * FROM social_links WHERE id = $1';
        db.query(query, [req.params.id], (err, results) => {
            if (err) {
                return res.status(500).json({ success: false, error: 'Database error' });
            }
            if (results.rows.length === 0) {
                return res.status(404).json({ success: false, error: 'Link not found' });
            }
            
            const link = {
                id: results.rows[0].id,
                platform: results.rows[0].platform_name.toLowerCase(),
                url: results.rows[0].platform_url,
                icon: results.rows[0].icon_class,
                color: results.rows[0].color_code,
                is_active: results.rows[0].is_active === 1 || results.rows[0].is_active === true,
                display_order: results.rows[0].display_order
            };
            
            res.json({ success: true, link });
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== CREATE new social link (ADMIN) ==========
router.post('/', async (req, res) => {
    const { platform_name, platform_url, icon_class, color_code, display_order, is_active } = req.body;
    
    const query = `INSERT INTO social_links (platform_name, platform_url, icon_class, color_code, display_order, is_active) 
                   VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
    
    db.query(query, [platform_name, platform_url, icon_class, color_code, display_order || 0, is_active !== undefined ? is_active : 1], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, error: 'Database error' });
        }
        res.status(201).json({ success: true, id: result.rows[0].id, message: 'Link added successfully' });
    });
});

// ========== UPDATE social link (ADMIN) ==========
router.put('/:id', async (req, res) => {
    const { platform_name, platform_url, icon_class, color_code, display_order, is_active } = req.body;
    
    const query = `UPDATE social_links 
                   SET platform_name = $1, platform_url = $2, icon_class = $3, 
                       color_code = $4, display_order = $5, is_active = $6, updated_at = CURRENT_TIMESTAMP
                   WHERE id = $7`;
    
    db.query(query, [platform_name, platform_url, icon_class, color_code, display_order, is_active, req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, error: 'Database error' });
        }
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, error: 'Link not found' });
        }
        res.json({ success: true, message: 'Link updated successfully' });
    });
});

// ========== DELETE social link (ADMIN) ==========
router.delete('/:id', async (req, res) => {
    const query = 'DELETE FROM social_links WHERE id = $1';
    db.query(query, [req.params.id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, error: 'Database error' });
        }
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, error: 'Link not found' });
        }
        res.json({ success: true, message: 'Link deleted successfully' });
    });
});

module.exports = router;