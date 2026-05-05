const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Adjust path to your database connection

// GET all active social links
router.get('/', async (req, res) => {
    try {
        const query = 'SELECT * FROM social_links WHERE is_active = 1 ORDER BY display_order ASC';
        db.query(query, (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.status(500).json({ error: 'Database error' });
            }
            res.json(results);
        });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: err.message });
    }
});

// GET single social link by ID
router.get('/:id', async (req, res) => {
    try {
        const query = 'SELECT * FROM social_links WHERE id = ?';
        db.query(query, [req.params.id], (err, results) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            if (results.length === 0) {
                return res.status(404).json({ error: 'Link not found' });
            }
            res.json(results[0]);
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// POST - Add new social link
router.post('/', async (req, res) => {
    const { platform_name, platform_url, icon_class, color_code, display_order, is_active } = req.body;
    
    const query = `INSERT INTO social_links (platform_name, platform_url, icon_class, color_code, display_order, is_active) 
                   VALUES (?, ?, ?, ?, ?, ?)`;
    
    db.query(query, [platform_name, platform_url, icon_class, color_code, display_order || 0, is_active !== undefined ? is_active : 1], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.status(201).json({ id: result.insertId, message: 'Link added successfully' });
    });
});

// PUT - Update social link
router.put('/:id', async (req, res) => {
    const { platform_name, platform_url, icon_class, color_code, display_order, is_active } = req.body;
    
    const query = `UPDATE social_links 
                   SET platform_name = ?, platform_url = ?, icon_class = ?, 
                       color_code = ?, display_order = ?, is_active = ?
                   WHERE id = ?`;
    
    db.query(query, [platform_name, platform_url, icon_class, color_code, display_order, is_active, req.params.id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Link updated successfully' });
    });
});

// DELETE - Remove social link
router.delete('/:id', async (req, res) => {
    const query = 'DELETE FROM social_links WHERE id = ?';
    db.query(query, [req.params.id], (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Database error' });
        }
        res.json({ message: 'Link deleted successfully' });
    });
});

module.exports = router;