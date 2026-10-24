const sequelize = require('../config/database');

const Account = require('./Account');
const LearningModule = require('./LearningModule');
const Portfolio = require('./Portfolio');
const Stock = require('./Stock');
const Transaction = require('./Transaction');
const User = require('./User');
const UserProgress = require('./UserProgress');

Portfolio.belongsTo(Stock, { foreignKey: 'stockId', as: 'stock' });
Portfolio.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Stock.hasMany(Portfolio, { foreignKey: 'stockId', as: 'holdings' });
User.hasMany(Portfolio, { foreignKey: 'userId', as: 'portfolio' });
User.hasMany(Account, { foreignKey: 'userId', as: 'accounts' });
Account.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Account.hasMany(Transaction, { foreignKey: 'fromAccountId', as: 'outgoingTransactions' });
Account.hasMany(Transaction, { foreignKey: 'toAccountId', as: 'incomingTransactions' });
Transaction.belongsTo(Account, { foreignKey: 'fromAccountId', as: 'sourceAccount' });
Transaction.belongsTo(Account, { foreignKey: 'toAccountId', as: 'destinationAccount' });
User.hasMany(UserProgress, { foreignKey: 'userId', as: 'learningProgress' });
UserProgress.belongsTo(User, { foreignKey: 'userId', as: 'user' });
LearningModule.hasMany(UserProgress, { foreignKey: 'moduleId', as: 'progressRecords' });
UserProgress.belongsTo(LearningModule, { foreignKey: 'moduleId', as: 'module' });

module.exports = {
  sequelize,
  Account,
  LearningModule,
  Portfolio,
  Stock,
  Transaction,
  User,
  UserProgress
};
