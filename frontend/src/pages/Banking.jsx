import React, { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { bankingService } from '../services';
import toast from 'react-hot-toast';

const Banking = () => {
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  const [transactionSearch, setTransactionSearch] = useState('');
  const [transactionType, setTransactionType] = useState('all');
  const [transferAccounts, setTransferAccounts] = useState({ from: '', to: '' });
  
  const queryClient = useQueryClient();
  const { data: accountsData, refetch } = useQuery('accounts', bankingService.getAccounts);
  const { data: transactionsData, refetch: refetchTransactions } = useQuery('transactions', bankingService.getTransactions);

  const accounts = accountsData?.data?.accounts || [];
  const transactions = transactionsData?.data?.transactions || [];
  const totalBalance = accounts.reduce((sum, account) => sum + Number(account.balance || 0), 0);
  const ownedAccountIds = new Set(accounts.map((account) => account.id));
  const filteredTransactions = useMemo(() => transactions.filter((tx) => {
    const matchesType = transactionType === 'all' || tx.transactionType === transactionType;
    const term = transactionSearch.trim().toLowerCase();
    const matchesSearch = !term || `${tx.description || ''} ${tx.transactionType} ${tx.status}`.toLowerCase().includes(term);
    return matchesType && matchesSearch;
  }), [transactions, transactionSearch, transactionType]);

  const refreshBankingData = () => {
    refetch();
    refetchTransactions();
    queryClient.invalidateQueries('portfolio');
    queryClient.invalidateQueries('portfolio-summary');
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      await bankingService.createAccount({
        accountType: formData.get('accountType'),
        isSimulation: formData.get('isSimulation') === 'true'
      });
      toast.success('Account created successfully!');
      setShowCreateAccount(false);
      refreshBankingData();
    } catch (error) {
      toast.error('Failed to create account');
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      const amount = Number(formData.get('amount'));
      const fromAccountId = formData.get('fromAccount');
      const toAccountId = formData.get('toAccount');
      if (!Number.isFinite(amount) || amount <= 0) {
        toast.error('Enter an amount greater than zero');
        return;
      }
      if (!fromAccountId || !toAccountId || fromAccountId === toAccountId) {
        toast.error('Choose two different accounts');
        return;
      }
      await bankingService.transferFunds({
        fromAccountId,
        toAccountId,
        amount,
        description: formData.get('description')
      });
      toast.success('Transfer completed successfully!');
      setShowTransfer(false);
      setTransferAccounts({ from: '', to: '' });
      refreshBankingData();
    } catch (error) {
      toast.error(error.response?.data?.error || 'Transfer failed');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Banking</h1>
          <p className="text-gray-600 mt-1">Manage your accounts and transactions</p>
        </div>
        <div className="space-x-3">
          <button 
            onClick={() => setShowCreateAccount(!showCreateAccount)}
            className="btn-primary"
          >
            New Account
          </button>
          <button 
            onClick={() => setShowTransfer(!showTransfer)}
            className="btn-secondary"
          >
            Transfer Funds
          </button>
        </div>
      </div>

      <div className="card mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">Combined account balance</p>
          <p className="text-3xl font-bold text-indigo-600">${totalBalance.toFixed(2)}</p>
        </div>
        <p className="text-sm text-gray-500">{accounts.length} account{accounts.length === 1 ? '' : 's'} · Transfers are simulated</p>
      </div>

      {showCreateAccount && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4">Create New Account</h3>
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div>
              <label className="label">Account Type</label>
              <select name="accountType" className="input-field" required>
                <option value="savings">Savings</option>
                <option value="checking">Checking</option>
                <option value="investment">Investment</option>
                <option value="simulation">Simulation</option>
              </select>
            </div>
            <div>
              <label className="label">Mode</label>
              <select name="isSimulation" className="input-field" required>
                <option value="false">Real Account</option>
                <option value="true">Simulation Account</option>
              </select>
            </div>
            <button type="submit" className="btn-primary">Create Account</button>
          </form>
        </div>
      )}

      {showTransfer && (
        <div className="card mb-6">
          <h3 className="text-lg font-semibold mb-4">Transfer Funds</h3>
          <form onSubmit={handleTransfer} className="space-y-4">
            <div>
              <label className="label">From Account</label>
              <select
                name="fromAccount"
                className="input-field"
                value={transferAccounts.from}
                onChange={(event) => setTransferAccounts((current) => ({ ...current, from: event.target.value }))}
                required
              >
                <option value="">Select source account</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.accountType} · {acc.accountNumber} · ${Number(acc.balance).toFixed(2)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">To Account</label>
              <select
                name="toAccount"
                className="input-field"
                value={transferAccounts.to}
                onChange={(event) => setTransferAccounts((current) => ({ ...current, to: event.target.value }))}
                required
              >
                <option value="">Select destination account</option>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id} disabled={acc.id === transferAccounts.from}>
                    {acc.accountType} · {acc.accountNumber}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Amount</label>
              <input type="number" name="amount" min="0.01" step="0.01" max={accounts.find((account) => account.id === transferAccounts.from)?.balance} className="input-field" required />
            </div>
            <div>
              <label className="label">Description</label>
              <input type="text" name="description" className="input-field" />
            </div>
            <button type="submit" className="btn-primary" disabled={accounts.length < 2}>Transfer</button>
            {accounts.length < 2 && <p className="text-sm text-amber-700">Create another account before transferring between accounts.</p>}
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold mb-4">Your Accounts</h3>
          <div className="space-y-3">
            {accounts.map((account) => (
              <div key={account.id} className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 capitalize">{account.accountType}</p>
                    <p className="text-xs text-gray-500 mt-1">{account.accountNumber}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-indigo-600">
                      ${parseFloat(account.balance).toFixed(2)}
                    </p>
                    {account.isSimulation && (
                      <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">Simulation</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {accounts.length === 0 && (
              <p className="text-gray-500 text-center py-8">No accounts yet. Create your first account!</p>
            )}
          </div>
        </div>

        <div className="card">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="text-lg font-semibold">Recent Transactions</h3>
            <div className="flex gap-2">
              <label className="sr-only" htmlFor="transaction-type-filter">Filter transaction type</label>
              <select id="transaction-type-filter" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" value={transactionType} onChange={(event) => setTransactionType(event.target.value)}>
                <option value="all">All types</option>
                <option value="transfer">Transfers</option>
                <option value="stock_buy">Stock buys</option>
                <option value="stock_sell">Stock sells</option>
              </select>
              <label className="sr-only" htmlFor="transaction-search">Search transactions</label>
              <input id="transaction-search" className="px-3 py-2 border border-gray-300 rounded-lg text-sm min-w-0 w-36" placeholder="Search..." value={transactionSearch} onChange={(event) => setTransactionSearch(event.target.value)} />
            </div>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredTransactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-800 capitalize">{tx.transactionType.replace('_', ' ')}</p>
                  <p className="text-sm text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                  {tx.description && <p className="text-xs text-gray-400">{tx.description}</p>}
                </div>
                <div className="text-right">
                  <span className={`font-medium ${
                    tx.status === 'completed' ? (tx.toAccountId && ownedAccountIds.has(tx.toAccountId) ? 'text-green-600' : 'text-gray-800') :
                    tx.status === 'failed' ? 'text-red-600' :
                    'text-yellow-600'
                  }`}>
                    {tx.transactionType === 'transfer' && tx.toAccountId && ownedAccountIds.has(tx.toAccountId) ? '+' : tx.fromAccountId && ownedAccountIds.has(tx.fromAccountId) ? '-' : ''}
                    ${parseFloat(tx.amount).toFixed(2)}
                  </span>
                  {tx.status !== 'completed' && <p className="text-xs capitalize text-gray-500">{tx.status}</p>}
                </div>
              </div>
            ))}
            {filteredTransactions.length === 0 && (
              <p className="text-gray-500 text-center py-8">No transactions yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banking;
