const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Mutual funds routes
router.get('/', auth, (req, res) => {
  res.json({ message: 'Get all mutual funds' });
});

router.get('/:id', auth, (req, res) => {
  res.json({ message: 'Get mutual fund details' });
});

router.post('/invest', auth, (req, res) => {
  res.json({ message: 'Invest in mutual fund' });
});

router.post('/sip/calculate', auth, (req, res) => {
  res.json({ message: 'Calculate SIP returns' });
});

module.exports = router;
