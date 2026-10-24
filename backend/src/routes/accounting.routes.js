const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Accounting routes
router.get('/expenses', auth, (req, res) => {
  res.json({ message: 'Get all expenses' });
});

router.post('/expenses', auth, (req, res) => {
  res.json({ message: 'Create expense entry' });
});

router.get('/income', auth, (req, res) => {
  res.json({ message: 'Get all income' });
});

router.post('/income', auth, (req, res) => {
  res.json({ message: 'Create income entry' });
});

router.get('/budget', auth, (req, res) => {
  res.json({ message: 'Get budget overview' });
});

router.get('/net-worth', auth, (req, res) => {
  res.json({ message: 'Get net worth' });
});

module.exports = router;
