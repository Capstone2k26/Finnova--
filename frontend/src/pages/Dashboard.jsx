import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  BanknotesIcon, 
  ChartBarIcon,
  AcademicCapIcon,
  ArrowTrendingUpIcon 
} from '@heroicons/react/24/outline';
import { bankingService, learningService, portfolioService } from '../services';

const Dashboard = () => {
  const { data: portfolioSummary } = useQuery('portfolio-summary', portfolioService.getPortfolioSummary);
  const { data: accountsData } = useQuery('accounts', bankingService.getAccounts);
  const { data: transactionsData } = useQuery('transactions', bankingService.getTransactions);
  const { data: modulesData } = useQuery('learning-modules', learningService.getModules);
  const { data: progressData } = useQuery('learning-progress', learningService.getUserProgress);

  const accounts = accountsData?.data?.accounts || [];
  const transactions = transactionsData?.data?.transactions || [];
  const modules = modulesData?.data?.modules || [];
  const progress = progressData?.data?.progress || [];
  const completedModules = progress.filter((item) => item.status === 'completed').length;
  const totalBalance = accounts.reduce((total, account) => total + Number(account.balance), 0);
  const stats = [
    {
      name: 'Total Balance',
      value: `$${totalBalance.toFixed(2)}`,
      icon: BanknotesIcon,
      change: `${accounts.length} account${accounts.length === 1 ? '' : 's'}`,
      changeType: 'neutral'
    },
    {
      name: 'Portfolio Value',
      value: portfolioSummary?.data?.summary?.currentValue 
        ? `$${portfolioSummary.data.summary.currentValue.toFixed(2)}` 
        : '$0.00',
      icon: ChartBarIcon,
      change: portfolioSummary?.data?.summary?.profitLossPercentage 
        ? `${portfolioSummary.data.summary.profitLossPercentage}%` 
        : '0%',
      changeType: portfolioSummary?.data?.summary?.totalProfitLoss >= 0 ? 'positive' : 'negative'
    },
    {
      name: 'Learning Progress',
      value: `${completedModules}/${modules.length}`,
      icon: AcademicCapIcon,
      change: modules.length ? `${Math.round((completedModules / modules.length) * 100)}% Complete` : 'No modules available',
      changeType: 'neutral'
    },
    {
      name: 'Portfolio Assets',
      value: portfolioSummary?.data?.summary?.numberOfAssets ?? 0,
      icon: ArrowTrendingUpIcon,
      change: 'Current holdings',
      changeType: 'neutral'
    }
  ];

  return (
    <div>
      <div className="mb-6">
        <section className="dashboard-hero rounded-3xl p-7 text-white sm:p-9">
          <div className="relative z-10 max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-200">Your money, your practice</p>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">Build confidence with every decision.</h1>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-emerald-50/70 sm:text-base">
              Explore your practice accounts, learn financial basics, and try simulated investing in one workspace.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/banking" className="rounded-xl bg-lime-300 px-4 py-2.5 text-sm font-bold text-emerald-950 hover:bg-lime-200">Manage accounts</Link>
              <Link to="/trading" className="rounded-xl border border-white/20 px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10">Explore demo market</Link>
            </div>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-800 mt-2">{stat.value}</p>
                <p className={`text-sm mt-2 ${
                  stat.changeType === 'positive' ? 'text-green-600' :
                  stat.changeType === 'negative' ? 'text-red-600' :
                  'text-gray-600'
                }`}>
                  {stat.change}
                </p>
              </div>
              <stat.icon className="w-12 h-12 text-indigo-600 opacity-80" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <div className="space-y-3">
            {transactions.slice(0, 5).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-medium text-gray-800 capitalize">{transaction.transactionType.replace('_', ' ')}</p>
                  <p className="text-sm text-gray-500">{new Date(transaction.createdAt).toLocaleDateString()}</p>
                </div>
                <span className="font-medium">${Number(transaction.amount).toFixed(2)}</span>
              </div>
            ))}
            {transactions.length === 0 && <p className="text-gray-500 py-4">No transactions yet.</p>}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Learning Modules</h3>
          <div className="space-y-3">
            {modules.slice(0, 3).map((module) => {
              const moduleProgress = progress.find((item) => item.moduleId === module.id)?.progress || 0;
              return <div key={module.id} className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-sm font-medium text-gray-800">{module.title}</p>
                  <span className="text-sm text-gray-600">{moduleProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ width: `${moduleProgress}%` }}
                  />
                </div>
              </div>
            })}
            {modules.length === 0 && <p className="text-gray-500 py-4">No learning modules available.</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
