const { sequelize } = require('../models');
const seedDemoData = require('./seedDemoData');

const migrate = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    await seedDemoData();
    console.log('Database tables and demonstration data are ready.');
  } catch (error) {
    console.error('Database migration failed:', error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
};

migrate();
