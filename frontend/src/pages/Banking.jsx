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
  const [selectedAccountId, setSelectedAccountId] = useState('');
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  
  const queryClient = useQueryClient();
  const { data: accountsData, refetch, isLoading: accountsLoading, isError: accountsError } = useQuery('accounts', bankingService.getAccounts);
  const { data: transactionsData, refetch: refetchTransactions } = useQuery('transactions', bankingService.getTransactions);
  const { data: ledgerData, isLoading: ledgerLoading, isError: ledgerError } = useQuery(
    ['account-ledger', selectedAccountId],
    () => bankingService.getLedger(selectedAccountId),
    { enabled: Boolean(selectedAccountId) }
  );

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
    setIsCreatingAccount(true);
    try {
      const response = await bankingService.createAccount({
        accountType: formData.get('accountType'),
        isSimulation: formData.get('isSimulation') === 'true'
      });
      const createdAccount = response.data.account;
      toast.success(`${createdAccount.accountType} practice account created${createdAccount.isSimulation ? ' with $100,000 demo funds' : ''}.`);
      setShowCreateAccount(false);
      setSelectedAccountId(createdAccount.id);
      await refreshBankingData();
    } catch (error) {
      const message = error.response?.data?.error
        || (error.response ? `Account creation failed (${error.response.status}).` : 'Cannot reach the backend. Make sure it is running.');
      toast.error(message);
    } finally {
      setIsCreatingAccount(false);
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
            onClick={() => setShowCreateAccount((current) => !current)}
            className="btn-primary"
          >
            Add Practice Account
          </button>
          <button 
            onClick={() => setShowTransfer((current) => !current)}
            className="btn-secondary"
            disabled={accounts.length < 2}
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
          <h3 className="text-lg font-semibold mb-1">Add a practice account</h3>
          <p className="text-sm text-gray-500 mb-4">This simulator creates demo accounts only. Choose a funded account to begin practicing.</p>
          <form onSubmit={handleCreateAccount} className="space-y-4">
            <div>
              <label className="label" htmlFor="new-account-type">Account Type</label>
              <select id="new-account-type" name="accountType" className="input-field" required>
                <option value="savings">Savings</option>
                <option value="checking">Checking</option>
                <option value="investment">Investment</option>
                <option value="simulation">Simulation</option>
              </select>
            </div>
            <div>
              <label className="label" htmlFor="new-account-mode">Practice balance</label>
              <select id="new-account-mode" name="isSimulation" className="input-field" defaultValue="true" required>
                <option value="true">Fund with $100,000 demo money</option>
                <option value="false">Start with $0</option>
              </select>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={isCreatingAccount} className="btn-primary">{isCreatingAccount ? 'Creating...' : 'Create Practice Account'}</button>
              <button type="button" className="btn-secondary" onClick={() => setShowCreateAccount(false)}>Cancel</button>
            </div>
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Practice Accounts</h3>
            <span className="text-sm text-gray-500">{accounts.length} total</span>
          </div>
          {accountsError && <p role="alert" className="text-red-600 mb-3">Could not load accounts. Check the backend connection.</p>}
          <div className="space-y-3">
            {accounts.map((account) => (
              <div key={account.id} className={`p-4 rounded-lg border ${selectedAccountId === account.id ? 'border-indigo-400 bg-indigo-50' : 'border-gray-100 bg-gray-50'}`}>
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
                      <span className="text-xs bg-lime-100 text-lime-800 px-2 py-1 rounded">Practice funds</span>
                    )}
                  </div>
                </div>
                <div className="flex justify-end mt-3">
                  <button type="button" className="text-sm text-indigo-700 font-medium hover:underline" onClick={() => setSelectedAccountId(selectedAccountId === account.id ? '' : account.id)}>
                    {selectedAccountId === account.id ? 'Hide account activity' : 'Manage / view activity'}
                  </button>
                </div>
              </div>
            ))}
            {accountsLoading && <p className="text-gray-500 text-center py-6">Loading accounts...</p>}
            {accounts.length === 0 && (
              <p className="text-gray-500 text-center py-8">No accounts yet. Create your first account!</p>
            )}
          </div>
          {selectedAccountId && (
            <section className="mt-5 border-t pt-4" aria-live="polite">
              <h4 className="font-semibold text-gray-800 mb-3">Account activity</h4>
              {ledgerLoading && <p className="text-sm text-gray-500">Loading account ledger...</p>}
              {ledgerError && <p role="alert" className="text-sm text-red-600">Could not load this account’s activity. Try selecting it again.</p>}
              {!ledgerLoading && !ledgerError && (
                <>
                  <p className="text-sm text-gray-600 mb-2">{ledgerData?.data?.account?.accountNumber} · Current balance ${Number(ledgerData?.data?.account?.balance || 0).toFixed(2)}</p>
                  <div className="max-h-52 overflow-y-auto">
                    {(ledgerData?.data?.ledger || []).map((entry) => (
                      <div key={entry.id} className="flex justify-between gap-3 border-b py-2 text-sm">
                        <span className="text-gray-700 capitalize">{entry.transactionType.replaceAll('_', ' ')}{entry.description ? ` · ${entry.description}` : ''}</span>
                        <span className="font-medium whitespace-nowrap">${Number(entry.amount).toFixed(2)}</span>
                      </div>
                    ))}
                    {ledgerData?.data?.ledger?.length === 0 && <p className="text-sm text-gray-500 py-2">No activity on this account yet.</p>}
                  </div>
                </>
              )}
            </section>
          )}
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
