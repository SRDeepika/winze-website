const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Your PostgreSQL connection

// ========== GET all active social links (PUBLIC) ==========
router.get('/', async (req, res) => {
    try {
        const query = 'SELECT * FROM social_links WHERE is_active = 1 ORDER BY display_order ASC';
        
        const results = await db.query(query);
        
        // Transform to frontend expected format
        const links = results.rows.map(link => ({
            id: link.id,
            platform: link.platform_name.toLowerCase(),
            url: link.platform_url,
            icon: link.icon_class,
            color: link.color_code,
            is_active: link.is_active === 1,
            display_order: link.display_order
        }));
        
        res.json({ success: true, links });
    } catch (err) {
        console.error('Error fetching social links:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== UPDATE all social links (ADMIN) ==========
router.put('/', async (req, res) => {
    try {
        const { links } = req.body;
        
        if (!links || !Array.isArray(links)) {
            return res.status(400).json({ success: false, error: 'Invalid links data' });
        }
        
        // Update each link in database
        for (const link of links) {
            const platform_name = link.platform.charAt(0).toUpperCase() + link.platform.slice(1);
            const query = `
                UPDATE social_links 
                SET platform_url = $1, is_active = $2, display_order = $3, updated_at = CURRENT_TIMESTAMP
                WHERE platform_name = $4
            `;
            
            await db.query(query, [
                link.url,
                link.is_active ? 1 : 0,
                link.display_order || 0,
                platform_name
            ]);
        }
        
        // Fetch updated links
        const updatedLinks = await db.query('SELECT * FROM social_links ORDER BY display_order ASC');
        
        const formattedLinks = updatedLinks.rows.map(link => ({
            id: link.id,
            platform: link.platform_name.toLowerCase(),
            url: link.platform_url,
            icon: link.icon_class,
            color: link.color_code,
            is_active: link.is_active === 1,
            display_order: link.display_order
        }));
        
        res.json({ 
            success: true, 
            message: 'Social links updated successfully',
            links: formattedLinks
        });
    } catch (err) {
        console.error('Error updating social links:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== GET single social link by ID (ADMIN) ==========
router.get('/:id', async (req, res) => {
    try {
        const query = 'SELECT * FROM social_links WHERE id = $1';
        const result = await db.query(query, [req.params.id]);
        
        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, error: 'Link not found' });
        }
        
        const link = {
            id: result.rows[0].id,
            platform: result.rows[0].platform_name.toLowerCase(),
            url: result.rows[0].platform_url,
            icon: result.rows[0].icon_class,
            color: result.rows[0].color_code,
            is_active: result.rows[0].is_active === 1,
            display_order: result.rows[0].display_order
        };
        
        res.json({ success: true, link });
    } catch (err) {
        console.error('Error fetching social link:', err);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ========== CREATE new social link (ADMIN) ==========
router.post('/', async (req, res) => {
    const { platform_name, platform_url, icon_class, color_code, display_order, is_active } = req.body;
    
    const query = `INSERT INTO social_links (platform_name, platform_url, icon_class, color_code, display_order, is_active) 
                   VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`;
    
    try {
        const result = await db.query(query, [
            platform_name, 
            platform_url, 
            icon_class, 
            color_code, 
            display_order || 0, 
            is_active !== undefined ? is_active : 1
        ]);
        
        res.status(201).json({ 
            success: true, 
            id: result.rows[0].id, 
            message: 'Link added successfully' 
        });
    } catch (err) {
        console.error('Error creating social link:', err);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// ========== UPDATE single social link by ID (ADMIN) ==========
router.put('/:id', async (req, res) => {
    const { platform_name, platform_url, icon_class, color_code, display_order, is_active } = req.body;
    
    const query = `UPDATE social_links 
                   SET platform_name = $1, platform_url = $2, icon_class = $3, 
                       color_code = $4, display_order = $5, is_active = $6, updated_at = CURRENT_TIMESTAMP
                   WHERE id = $7`;
    
    try {
        const result = await db.query(query, [
            platform_name, 
            platform_url, 
            icon_class, 
            color_code, 
            display_order, 
            is_active, 
            req.params.id
        ]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, error: 'Link not found' });
        }
        
        res.json({ success: true, message: 'Link updated successfully' });
    } catch (err) {
        console.error('Error updating social link:', err);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

// ========== DELETE social link (ADMIN) ==========
router.delete('/:id', async (req, res) => {
    const query = 'DELETE FROM social_links WHERE id = $1';
    
    try {
        const result = await db.query(query, [req.params.id]);
        
        if (result.rowCount === 0) {
            return res.status(404).json({ success: false, error: 'Link not found' });
        }
        
        res.json({ success: true, message: 'Link deleted successfully' });
    } catch (err) {
        console.error('Error deleting social link:', err);
        res.status(500).json({ success: false, error: 'Database error' });
    }
});

module.exports = router;