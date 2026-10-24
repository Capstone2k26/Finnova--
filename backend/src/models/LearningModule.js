const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LearningModule = sequelize.define('LearningModule', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  category: {
    type: DataTypes.ENUM('banking', 'stocks', 'mutual_funds', 'bonds', 'accounting', 'budgeting'),
    allowNull: false
  },
  level: {
    type: DataTypes.ENUM('beginner', 'intermediate', 'advanced'),
    allowNull: false
  },
  content: {
    type: DataTypes.JSONB,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    comment: 'Duration in minutes'
  },
  order: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'learning_modules'
});

module.exports = LearningModule;
