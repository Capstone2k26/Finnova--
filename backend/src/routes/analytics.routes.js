const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Analytics routes
router.get('/dashboard', auth, (req, res) => {
  res.json({ message: 'Get dashboard analytics' });
});

router.get('/health-score', auth, (req, res) => {
  res.json({ message: 'Get financial health score' });
});

router.get('/insights', auth, (req, res) => {
  res.json({ message: 'Get AI insights' });
});

module.exports = router;
