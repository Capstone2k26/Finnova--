import React from 'react';
import { useQuery } from 'react-query';
import { portfolioService } from '../services';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const Portfolio = () => {
  const { data: portfolioData } = useQuery('portfolio', portfolioService.getPortfolio);
  const { data: summaryData } = useQuery('portfolio-summary', portfolioService.getPortfolioSummary);
  const { data: allocationData } = useQuery('asset-allocation', portfolioService.getAssetAllocation);

  const portfolio = portfolioData?.data?.portfolio || [];
  const summary = summaryData?.data?.summary || {};
  const allocation = allocationData?.data?.allocation || {};

  const COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
  
  const allocationChartData = Object.entries(allocation).map(([key, value]) => ({
    name: key.replace('_', ' ').toUpperCase(),
    value: parseFloat(value)
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Portfolio</h1>
        <p className="text-gray-600 mt-1">Track your investment performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <p className="text-sm text-gray-600">Total Invested</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            ${summary.totalInvested?.toFixed(2) || '0.00'}
          </p>
        </div>

        <div className="card">
          <p className="text-sm text-gray-600">Current Value</p>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            ${summary.currentValue?.toFixed(2) || '0.00'}
          </p>
        </div>

        <div className="card">
          <p className="text-sm text-gray-600">Total P/L</p>
          <p className={`text-2xl font-bold mt-2 ${
            summary.totalProfitLoss >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            ${summary.totalProfitLoss?.toFixed(2) || '0.00'}
          </p>
        </div>

        <div className="card">
          <p className="text-sm text-gray-600">P/L %</p>
          <p className={`text-2xl font-bold mt-2 ${
            summary.profitLossPercentage >= 0 ? 'text-green-600' : 'text-red-600'
          }`}>
            {summary.profitLossPercentage || '0.00'}%
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Holdings</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Asset</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Qty</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Avg Price</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Current</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">P/L</th>
                </tr>
              </thead>
              <tbody>
                {portfolio.map((item) => (
                  <tr key={item.id} className="border-b border-gray-100">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-800">{item.stock?.symbol || 'N/A'}</p>
                        <p className="text-xs text-gray-500 capitalize">{item.assetType.replace('_', ' ')}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">{parseFloat(item.quantity).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">${parseFloat(item.averagePurchasePrice).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-medium">${parseFloat(item.currentValue).toFixed(2)}</td>
                    <td className="px-4 py-3 text-right">
                      <span className={`font-medium ${
                        parseFloat(item.profitLoss) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ${parseFloat(item.profitLoss).toFixed(2)}
                      </span>
                      <span className={`block text-xs ${
                        parseFloat(item.profitLossPercentage) >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        ({parseFloat(item.profitLossPercentage).toFixed(2)}%)
                      </span>
                    </td>
                  </tr>
                ))}
                {portfolio.length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                      No holdings yet. Start investing to build your portfolio!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Asset Allocation</h3>
          {allocationChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={allocationChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {allocationChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              No data available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
