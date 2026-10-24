const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Account = sequelize.define('Account', {
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
  accountType: {
    type: DataTypes.ENUM('savings', 'checking', 'investment', 'simulation'),
    allowNull: false
  },
  accountNumber: {
    type: DataTypes.STRING,
    unique: true,
    allowNull: false
  },
  balance: {
    type: DataTypes.DECIMAL(15, 2),
    defaultValue: 0.00,
    allowNull: false
  },
  currency: {
    type: DataTypes.STRING(3),
    defaultValue: 'USD'
  },
  isSimulation: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  status: {
    type: DataTypes.ENUM('active', 'frozen', 'closed'),
    defaultValue: 'active'
  }
}, {
  timestamps: true,
  tableName: 'accounts'
});

module.exports = Account;
