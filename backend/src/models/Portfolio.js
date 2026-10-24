const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Portfolio = sequelize.define('Portfolio', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  stockId: {
    type: DataTypes.UUID,
    references: {
      model: 'stocks',
      key: 'id'
    }
  },
  assetType: {
    type: DataTypes.ENUM('stock', 'mutual_fund', 'bond'),
    allowNull: false
  },
  quantity: {
    type: DataTypes.DECIMAL(15, 4),
    allowNull: false
  },
  averagePurchasePrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  currentValue: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  profitLoss: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00
  },
  profitLossPercentage: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0.00
  }
}, {
  timestamps: true,
  tableName: 'portfolios'
});

module.exports = Portfolio;
