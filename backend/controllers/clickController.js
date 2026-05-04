const Click = require('../models/Click');

const trackClick = async (req, res) => {
    try {
        const { link_url, link_title } = req.body;
        const ip_address = req.ip || req.connection.remoteAddress;
        
        const clickId = await Click.create({
            link_url,
            link_title,
            ip_address
        });
        
        res.status(201).json({ 
            success: true, 
            message: 'Click tracked successfully',
            clickId: clickId
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getAllClicks = async (req, res) => {
    try {
        const clicks = await Click.findAll();
        const total = await Click.getCount();
        
        res.json({ 
            success: true, 
            data: clicks,
            total: total
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

module.exports = { trackClick, getAllClicks };