const { LearningModule, Stock } = require('../models');

const seedDemoData = async () => {
  const stocks = [
    { symbol: 'FNV1', companyName: 'Finova Demo Technology', exchange: 'DEMO', currentPrice: 125.00, openPrice: 123.00, highPrice: 127.00, lowPrice: 122.00, closePrice: 124.00, volume: 250000, sector: 'Technology' },
    { symbol: 'FNV2', companyName: 'Finova Demo Energy', exchange: 'DEMO', currentPrice: 82.50, openPrice: 81.00, highPrice: 84.00, lowPrice: 80.50, closePrice: 81.75, volume: 180000, sector: 'Energy' },
    { symbol: 'FNV3', companyName: 'Finova Demo Finance', exchange: 'DEMO', currentPrice: 64.25, openPrice: 63.50, highPrice: 65.00, lowPrice: 62.75, closePrice: 63.00, volume: 120000, sector: 'Finance' }
  ];

  for (const stock of stocks) {
    await Stock.findOrCreate({ where: { symbol: stock.symbol }, defaults: stock });
  }

  const modules = [
    {
      title: 'Understanding a Bank Account',
      description: 'Learn how account balances and transfers work in the simulator.',
      category: 'banking',
      level: 'beginner',
      content: { sections: [{ heading: 'Balances', text: 'An account balance is the amount available in that account.' }, { heading: 'Transfers', text: 'A transfer subtracts funds from one account and adds the same amount to another.' }] },
      duration: 5,
      order: 1
    },
    {
      title: 'Stock Trading Basics',
      description: 'Practice buying and selling shares using sample market data.',
      category: 'stocks',
      level: 'beginner',
      content: { sections: [{ heading: 'Shares', text: 'A share represents a unit of ownership in a company.' }, { heading: 'Demo orders', text: 'FINNOVA uses static demonstration prices; orders do not reach a real exchange.' }] },
      duration: 7,
      order: 2
    },
    {
      title: 'Budgeting Your Money',
      description: 'Understand how tracking income and expenses supports a budget.',
      category: 'budgeting',
      level: 'beginner',
      content: { sections: [{ heading: 'Income and expenses', text: 'Compare money received with money spent over a chosen period.' }, { heading: 'Plan', text: 'Set spending limits that reflect your needs and goals.' }] },
      duration: 6,
      order: 3
    }
  ];

  for (const module of modules) {
    await LearningModule.findOrCreate({ where: { title: module.title }, defaults: module });
  }
};

module.exports = seedDemoData;
