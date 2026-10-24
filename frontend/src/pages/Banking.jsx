import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { bankingService } from '../services';
import toast from 'react-hot-toast';

const Banking = () => {
  const [showCreateAccount, setShowCreateAccount] = useState(false);
  const [showTransfer, setShowTransfer] = useState(false);
  
  const { data: accountsData, refetch } = useQuery('accounts', bankingService.getAccounts);
  const { data: transactionsData } = useQuery('transactions', bankingService.getTransactions);

  const accounts = accountsData?.data?.accounts || [];
  const transactions = transactionsData?.data?.transactions || [];

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
      refetch();
    } catch (error) {
      toast.error('Failed to create account');
    }
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    try {
      await bankingService.transferFunds({
        fromAccountId: formData.get('fromAccount'),
        toAccountId: formData.get('toAccount'),
        amount: parseFloat(formData.get('amount')),
        description: formData.get('description')
      });
      toast.success('Transfer completed successfully!');
      setShowTransfer(false);
      refetch();
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
              <select name="fromAccount" className="input-field" required>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.accountNumber} - ${acc.balance}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">To Account</label>
              <select name="toAccount" className="input-field" required>
                {accounts.map(acc => (
                  <option key={acc.id} value={acc.id}>
                    {acc.accountNumber}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Amount</label>
              <input type="number" name="amount" step="0.01" className="input-field" required />
            </div>
            <div>
              <label className="label">Description</label>
              <input type="text" name="description" className="input-field" />
            </div>
            <button type="submit" className="btn-primary">Transfer</button>
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
          <h3 className="text-lg font-semibold mb-4">Recent Transactions</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {transactions.map((tx) => (
              <div key={tx.id} className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="font-medium text-gray-800 capitalize">{tx.transactionType.replace('_', ' ')}</p>
                  <p className="text-sm text-gray-500">{new Date(tx.createdAt).toLocaleDateString()}</p>
                  {tx.description && <p className="text-xs text-gray-400">{tx.description}</p>}
                </div>
                <span className={`font-medium ${
                  tx.status === 'completed' ? 'text-green-600' : 
                  tx.status === 'failed' ? 'text-red-600' : 
                  'text-yellow-600'
                }`}>
                  ${parseFloat(tx.amount).toFixed(2)}
                </span>
              </div>
            ))}
            {transactions.length === 0 && (
              <p className="text-gray-500 text-center py-8">No transactions yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banking;
