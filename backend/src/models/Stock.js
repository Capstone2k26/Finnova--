const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Stock = sequelize.define('Stock', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  symbol: {
    type: DataTypes.STRING(10),
    allowNull: false,
    unique: true
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  exchange: {
    type: DataTypes.STRING(10),
    allowNull: false
  },
  currentPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  openPrice: {
    type: DataTypes.DECIMAL(10, 2)
  },
  closePrice: {
    type: DataTypes.DECIMAL(10, 2)
  },
  highPrice: {
    type: DataTypes.DECIMAL(10, 2)
  },
  lowPrice: {
    type: DataTypes.DECIMAL(10, 2)
  },
  volume: {
    type: DataTypes.BIGINT,
    defaultValue: 0
  },
  marketCap: {
    type: DataTypes.BIGINT
  },
  sector: {
    type: DataTypes.STRING
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'stocks'
});

module.exports = Stock;
