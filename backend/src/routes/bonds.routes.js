const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Bonds routes
router.get('/', auth, (req, res) => {
  res.json({ message: 'Get all bonds' });
});

router.get('/:id', auth, (req, res) => {
  res.json({ message: 'Get bond details' });
});

router.post('/purchase', auth, (req, res) => {
  res.json({ message: 'Purchase bond' });
});

router.post('/yield/calculate', auth, (req, res) => {
  res.json({ message: 'Calculate bond yield' });
});

module.exports = router;
