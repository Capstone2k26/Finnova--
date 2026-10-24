const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const portfolioController = require('../controllers/portfolio.controller');

// Get user portfolio
router.get('/', auth, portfolioController.getPortfolio);

// Get portfolio summary
router.get('/summary', auth, portfolioController.getPortfolioSummary);

// Get portfolio performance
router.get('/performance', auth, portfolioController.getPerformance);

// Get asset allocation
router.get('/allocation', auth, portfolioController.getAssetAllocation);

module.exports = router;
