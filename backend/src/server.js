const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
require('dotenv').config();
const { sequelize } = require('./models');
const seedDemoData = require('./config/seedDemoData');

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(compression());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

// Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/banking', require('./routes/banking.routes'));
app.use('/api/trading', require('./routes/trading.routes'));
app.use('/api/mutual-funds', require('./routes/mutualFunds.routes'));
app.use('/api/bonds', require('./routes/bonds.routes'));
app.use('/api/accounting', require('./routes/accounting.routes'));
app.use('/api/learning', require('./routes/learning.routes'));
app.use('/api/portfolio', require('./routes/portfolio.routes'));
app.use('/api/analytics', require('./routes/analytics.routes'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal Server Error',
      status: err.status || 500
    }
  });
});

const startServer = async () => {
  await sequelize.authenticate();
  await sequelize.sync();
  await seedDemoData();

  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`FINNOVA Backend Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
  });
};

if (require.main === module) {
  startServer().catch((error) => {
    console.error('Failed to start FINNOVA backend:', error);
    process.exitCode = 1;
  });
}

module.exports = app;
