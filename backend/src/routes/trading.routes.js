const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const tradingController = require('../controllers/trading.controller');

// Get all stocks
router.get('/stocks', auth, tradingController.getStocks);

// Get stock details
router.get('/stocks/:symbol', auth, tradingController.getStockDetails);

// Place order (buy/sell)
router.post('/orders', auth, tradingController.placeOrder);

// Get user orders
router.get('/orders', auth, tradingController.getUserOrders);

// Get market data (real-time)
router.get('/market-data/:symbol', auth, tradingController.getMarketData);

// Get candlestick chart data
router.get('/charts/:symbol', auth, tradingController.getChartData);

// Get watchlist
router.get('/watchlist', auth, tradingController.getWatchlist);

// Add to watchlist
router.post('/watchlist', auth, tradingController.addToWatchlist);

module.exports = router;
