const { Op } = require('sequelize');
const Stock = require('../models/Stock');
const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const Account = require('../models/Account');

exports.getStocks = async (req, res) => {
  try {
    const { search, sector } = req.query;
    const where = { isActive: true };

    if (search) {
      where[Op.or] = [
        { symbol: { [Op.iLike]: `%${search}%` } },
        { companyName: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (sector) {
      where.sector = sector;
    }

    const stocks = await Stock.findAll({ where });
    res.json({ stocks });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stocks' });
  }
};

exports.getStockDetails = async (req, res) => {
  try {
    const stock = await Stock.findOne({
      where: { symbol: req.params.symbol }
    });

    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    res.json({ stock });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch stock details' });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const { stockId, orderType, quantity, accountId } = req.body;

    const stock = await Stock.findByPk(stockId);
    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    const account = await Account.findOne({
      where: { id: accountId, userId: req.userId }
    });

    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }

    const totalAmount = parseFloat(stock.currentPrice) * quantity;

    if (orderType === 'buy') {
      if (parseFloat(account.balance) < totalAmount) {
        return res.status(400).json({ error: 'Insufficient balance' });
      }

      // Create transaction
      const transaction = await Transaction.create({
        fromAccountId: accountId,
        transactionType: 'stock_buy',
        amount: totalAmount,
        description: `Buy ${quantity} shares of ${stock.symbol}`,
        status: 'completed',
        metadata: { stockId, quantity, price: stock.currentPrice }
      });

      // Update account balance
      await account.decrement('balance', { by: totalAmount });

      // Update or create portfolio entry
      const [portfolio, created] = await Portfolio.findOrCreate({
        where: { userId: req.userId, stockId, assetType: 'stock' },
        defaults: {
          quantity,
          averagePurchasePrice: stock.currentPrice,
          currentValue: totalAmount
        }
      });

      if (!created) {
        const newQuantity = parseFloat(portfolio.quantity) + quantity;
        const newAvgPrice = ((parseFloat(portfolio.averagePurchasePrice) * parseFloat(portfolio.quantity)) + totalAmount) / newQuantity;
        
        await portfolio.update({
          quantity: newQuantity,
          averagePurchasePrice: newAvgPrice,
          currentValue: newQuantity * parseFloat(stock.currentPrice)
        });
      }

      res.json({ 
        message: 'Order placed successfully',
        transaction,
        portfolio
      });
    } else if (orderType === 'sell') {
      const portfolio = await Portfolio.findOne({
        where: { userId: req.userId, stockId, assetType: 'stock' }
      });

      if (!portfolio || parseFloat(portfolio.quantity) < quantity) {
        return res.status(400).json({ error: 'Insufficient shares' });
      }

      // Create transaction
      const transaction = await Transaction.create({
        toAccountId: accountId,
        transactionType: 'stock_sell',
        amount: totalAmount,
        description: `Sell ${quantity} shares of ${stock.symbol}`,
        status: 'completed',
        metadata: { stockId, quantity, price: stock.currentPrice }
      });

      // Update account balance
      await account.increment('balance', { by: totalAmount });

      // Update portfolio
      const newQuantity = parseFloat(portfolio.quantity) - quantity;
      if (newQuantity === 0) {
        await portfolio.destroy();
      } else {
        await portfolio.update({
          quantity: newQuantity,
          currentValue: newQuantity * parseFloat(stock.currentPrice)
        });
      }

      res.json({ 
        message: 'Order placed successfully',
        transaction
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to place order' });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const accounts = await Account.findAll({
      where: { userId: req.userId },
      attributes: ['id']
    });

    const accountIds = accounts.map(acc => acc.id);

    const orders = await Transaction.findAll({
      where: {
        transactionType: ['stock_buy', 'stock_sell'],
        [Op.or]: [
          { fromAccountId: accountIds },
          { toAccountId: accountIds }
        ]
      },
      order: [['createdAt', 'DESC']],
      limit: 50
    });

    res.json({ orders });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

exports.getMarketData = async (req, res) => {
  try {
    const stock = await Stock.findOne({
      where: { symbol: req.params.symbol }
    });

    if (!stock) {
      return res.status(404).json({ error: 'Stock not found' });
    }

    // In production, fetch real-time data from market API
    res.json({ 
      symbol: stock.symbol,
      price: stock.currentPrice,
      open: stock.openPrice,
      high: stock.highPrice,
      low: stock.lowPrice,
      volume: stock.volume,
      timestamp: new Date()
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch market data' });
  }
};

exports.getChartData = async (req, res) => {
  try {
    // In production, fetch historical candlestick data
    res.json({ 
      message: 'Chart data endpoint',
      symbol: req.params.symbol
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch chart data' });
  }
};

exports.getWatchlist = async (req, res) => {
  try {
    res.json({ message: 'Get watchlist' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
};

exports.addToWatchlist = async (req, res) => {
  try {
    res.json({ message: 'Add to watchlist' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add to watchlist' });
  }
};
