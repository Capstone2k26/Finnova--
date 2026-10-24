import api from './api';

export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getCurrentUser: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data)
};

export const bankingService = {
  getAccounts: () => api.get('/banking/accounts'),
  createAccount: (data) => api.post('/banking/accounts', data),
  getBalance: (accountId) => api.get(`/banking/accounts/${accountId}/balance`),
  transferFunds: (data) => api.post('/banking/transfer', data),
  getTransactions: () => api.get('/banking/transactions'),
  getLedger: (accountId) => api.get(`/banking/ledger?accountId=${accountId}`)
};

export const tradingService = {
  getStocks: (params) => api.get('/trading/stocks', { params }),
  getStockDetails: (symbol) => api.get(`/trading/stocks/${symbol}`),
  placeOrder: (data) => api.post('/trading/orders', data),
  getUserOrders: () => api.get('/trading/orders'),
  getMarketData: (symbol) => api.get(`/trading/market-data/${symbol}`),
  getChartData: (symbol) => api.get(`/trading/charts/${symbol}`),
  getWatchlist: () => api.get('/trading/watchlist'),
  addToWatchlist: (data) => api.post('/trading/watchlist', data)
};

export const learningService = {
  getModules: (params) => api.get('/learning/modules', { params }),
  getModuleById: (id) => api.get(`/learning/modules/${id}`),
  getModulesByCategory: (category) => api.get(`/learning/modules/category/${category}`),
  getUserProgress: () => api.get('/learning/progress'),
  updateProgress: (moduleId, data) => api.put(`/learning/progress/${moduleId}`, data),
  completeModule: (moduleId, data) => api.post(`/learning/complete/${moduleId}`, data)
};

export const portfolioService = {
  getPortfolio: () => api.get('/portfolio'),
  getPortfolioSummary: () => api.get('/portfolio/summary'),
  getPerformance: () => api.get('/portfolio/performance'),
  getAssetAllocation: () => api.get('/portfolio/allocation')
};

export const analyticsService = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getHealthScore: () => api.get('/analytics/health-score'),
  getInsights: () => api.get('/analytics/insights')
};
