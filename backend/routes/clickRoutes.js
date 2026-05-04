const express = require('express');
const router = express.Router();
const { trackClick, getAllClicks } = require('../controllers/clickController');

router.post('/track', trackClick);
router.get('/all', getAllClicks);

module.exports = router;