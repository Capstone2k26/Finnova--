const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  fromAccountId: {
    type: DataTypes.UUID,
    references: {
      model: 'accounts',
      key: 'id'
    }
  },
  toAccountId: {
    type: DataTypes.UUID,
    references: {
      model: 'accounts',
      key: 'id'
    }
  },
  transactionType: {
    type: DataTypes.ENUM('transfer', 'deposit', 'withdrawal', 'stock_buy', 'stock_sell', 'mf_invest', 'bond_purchase'),
    allowNull: false
  },
  amount: {
    type: DataTypes.DECIMAL(15, 2),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('pending', 'completed', 'failed', 'reversed'),
    defaultValue: 'pending'
  },
  referenceId: {
    type: DataTypes.STRING
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
}, {
  timestamps: true,
  tableName: 'transactions'
});

module.exports = Transaction;
