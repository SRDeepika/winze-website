const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all social links
router.get('/', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM social_links WHERE is_active = 1 ORDER BY display_order ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET single social link by ID
router.get('/:id', async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM social_links WHERE id = $1', [req.params.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Link not found' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// CREATE new social link
router.post('/', async (req, res) => {
    const { platform_name, platform_url, icon_class, color_code, display_order, is_active } = req.body;
    
    const query = `INSERT INTO social_links (platform_name, platform_url, icon_class, color_code, display_order, is_active) 
                   VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
    
    try {
        const result = await db.query(query, [platform_name, platform_url, icon_class, color_code, display_order || 0, is_active !== undefined ? is_active : 1]);
        res.status(201).json({ id: result.rows[0].id, message: 'Link added successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// UPDATE social link
router.put('/:id', async (req, res) => {
    const { platform_name, platform_url, icon_class, color_code, display_order, is_active } = req.body;
    
    const query = `UPDATE social_links 
                   SET platform_name = $1, platform_url = $2, icon_class = $3, 
                       color_code = $4, display_order = $5, is_active = $6, updated_at = CURRENT_TIMESTAMP
                   WHERE id = $7`;
    
    try {
        await db.query(query, [platform_name, platform_url, icon_class, color_code, display_order, is_active, req.params.id]);
        res.json({ message: 'Link updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

// DELETE social link
router.delete('/:id', async (req, res) => {
    const query = 'DELETE FROM social_links WHERE id = $1';
    try {
        await db.query(query, [req.params.id]);
        res.json({ message: 'Link deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Database error' });
    }
});

module.exports = router;