const Portfolio = require('../models/Portfolio');
const Stock = require('../models/Stock');
const Account = require('../models/Account');

exports.getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findAll({
      where: { userId: req.userId },
      include: [{ model: Stock, as: 'stock' }]
    });

    res.json({ portfolio });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
};

exports.getPortfolioSummary = async (req, res) => {
  try {
    const portfolio = await Portfolio.findAll({
      where: { userId: req.userId }
    });

    const totalInvested = portfolio.reduce((sum, item) => 
      sum + (parseFloat(item.averagePurchasePrice) * parseFloat(item.quantity)), 0
    );

    const currentValue = portfolio.reduce((sum, item) => 
      sum + parseFloat(item.currentValue), 0
    );

    const totalProfitLoss = currentValue - totalInvested;
    const profitLossPercentage = totalInvested > 0 
      ? ((totalProfitLoss / totalInvested) * 100).toFixed(2)
      : 0;

    res.json({
      summary: {
        totalInvested,
        currentValue,
        totalProfitLoss,
        profitLossPercentage,
        numberOfAssets: portfolio.length
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch portfolio summary' });
  }
};

exports.getPerformance = async (req, res) => {
  try {
    // Calculate portfolio performance metrics
    res.json({ message: 'Portfolio performance data' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch performance' });
  }
};

exports.getAssetAllocation = async (req, res) => {
  try {
    const portfolio = await Portfolio.findAll({
      where: { userId: req.userId }
    });

    const allocation = portfolio.reduce((acc, item) => {
      if (!acc[item.assetType]) {
        acc[item.assetType] = 0;
      }
      acc[item.assetType] += parseFloat(item.currentValue);
      return acc;
    }, {});

    res.json({ allocation });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch asset allocation' });
  }
};
