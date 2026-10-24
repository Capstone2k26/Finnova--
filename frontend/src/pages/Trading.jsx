import React, { useMemo, useState } from 'react';
import { useQuery, useQueryClient } from 'react-query';
import { bankingService, portfolioService, tradingService } from '../services';
import toast from 'react-hot-toast';

const Trading = () => {
  const [selectedStock, setSelectedStock] = useState(null);
  const [orderType, setOrderType] = useState('buy');
  const [quantity, setQuantity] = useState(1);
  const [accountId, setAccountId] = useState('');
  const [stockSearch, setStockSearch] = useState('');
  const [sectorFilter, setSectorFilter] = useState('all');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const queryClient = useQueryClient();
  
  const { data: stocksData, isLoading: stocksLoading, isError: stocksError } = useQuery('stocks', () => tradingService.getStocks());
  const { data: ordersData, isLoading: ordersLoading, isError: ordersError } = useQuery('orders', tradingService.getUserOrders);
  const { data: accountsData } = useQuery('accounts', bankingService.getAccounts);
  const { data: portfolioData } = useQuery('portfolio', portfolioService.getPortfolio);

  const stocks = stocksData?.data?.stocks || [];
  const orders = ordersData?.data?.orders || [];
  const accounts = accountsData?.data?.accounts || [];
  const holdings = portfolioData?.data?.portfolio || [];
  const sectors = [...new Set(stocks.map((stock) => stock.sector).filter(Boolean))];
  const visibleStocks = useMemo(() => stocks.filter((stock) => {
    const term = stockSearch.trim().toLowerCase();
    const matchesSearch = !term || `${stock.symbol} ${stock.companyName}`.toLowerCase().includes(term);
    return matchesSearch && (sectorFilter === 'all' || stock.sector === sectorFilter);
  }), [stocks, stockSearch, sectorFilter]);
  const sharesOwned = selectedStock
    ? Number(holdings.find((item) => item.stockId === selectedStock.id)?.quantity || 0)
    : 0;
  const selectedAccount = accounts.find((account) => account.id === accountId);
  const orderQuantity = Number(quantity);
  const orderTotal = selectedStock ? Number(selectedStock.currentPrice) * orderQuantity : 0;
  const canAffordOrder = orderType !== 'buy' || (selectedAccount && Number(selectedAccount.balance) >= orderTotal);
  const hasEnoughShares = orderType !== 'sell' || sharesOwned >= orderQuantity;
  const validQuantity = Number.isInteger(orderQuantity) && orderQuantity > 0;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    
    if (!selectedStock) {
      toast.error('Please select a stock');
      return;
    }
    if (!accountId) {
      toast.error('Please select an account');
      return;
    }
    if (!validQuantity) {
      toast.error('Enter a whole number of shares greater than zero');
      return;
    }
    if (!canAffordOrder) {
      toast.error('Insufficient account balance for this order');
      return;
    }
    if (!hasEnoughShares) {
      toast.error(`You only own ${sharesOwned} share${sharesOwned === 1 ? '' : 's'} of this stock`);
      return;
    }

    setIsSubmitting(true);
    try {
      await tradingService.placeOrder({
        stockId: selectedStock.id,
        orderType,
        quantity: parseInt(quantity),
        accountId
      });
      toast.success(`${orderType === 'buy' ? 'Buy' : 'Sell'} order placed successfully!`);
      setQuantity(1);
      await Promise.all([
        queryClient.invalidateQueries('orders'),
        queryClient.invalidateQueries('accounts'),
        queryClient.invalidateQueries('portfolio'),
        queryClient.invalidateQueries('portfolio-summary'),
        queryClient.invalidateQueries('transactions')
      ]);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Order failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Stock Trading</h1>
        <p className="text-gray-600 mt-1">Practice trading with static demonstration prices; orders are simulated.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="card">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <h3 className="text-lg font-semibold">Available Stocks</h3>
              <div className="flex gap-2">
                <label className="sr-only" htmlFor="stock-sector">Filter stocks by sector</label>
                <select id="stock-sector" className="px-3 py-2 border border-gray-300 rounded-lg text-sm" value={sectorFilter} onChange={(event) => setSectorFilter(event.target.value)}>
                  <option value="all">All sectors</option>
                  {sectors.map((sector) => <option key={sector} value={sector}>{sector}</option>)}
                </select>
                <label className="sr-only" htmlFor="stock-search">Search stocks</label>
                <input id="stock-search" className="px-3 py-2 border border-gray-300 rounded-lg text-sm min-w-0 w-40" placeholder="Symbol or company" value={stockSearch} onChange={(event) => setStockSearch(event.target.value)} />
              </div>
            </div>
            {stocksError && <p role="alert" className="text-red-600 mb-3">Could not load stocks. Check the backend connection.</p>}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Symbol</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Company</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Price</th>
                    <th className="px-4 py-2 text-right text-sm font-medium text-gray-600">Change</th>
                    <th className="px-4 py-2 text-center text-sm font-medium text-gray-600">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {visibleStocks.map((stock) => (
                    <tr key={stock.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-indigo-600">{stock.symbol}</td>
                      <td className="px-4 py-3 text-sm">{stock.companyName}</td>
                      <td className="px-4 py-3 text-right font-medium">${parseFloat(stock.currentPrice).toFixed(2)}</td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-gray-500">{stock.sector || 'Demo'}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => {
                            setSelectedStock(stock);
                            setQuantity(1);
                          }}
                          className="text-sm text-indigo-600 hover:underline"
                        >
                          Trade
                        </button>
                      </td>
                    </tr>
                  ))}
                  {!stocksLoading && visibleStocks.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                        {stocks.length ? 'No stocks match those filters' : 'No stocks available'}
                      </td>
                    </tr>
                  )}
                  {stocksLoading && <tr><td colSpan="5" className="px-4 py-8 text-center text-gray-500">Loading stocks...</td></tr>}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold mb-4">Your Orders</h3>
            <div className="space-y-2">
              {orders.slice(0, 10).map((order) => (
                <div key={order.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium capitalize">{order.transactionType.replace('_', ' ')}</p>
                    <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${parseFloat(order.amount).toFixed(2)}</p>
                    <span className={`text-xs px-2 py-1 rounded ${
                      order.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
              {ordersError && <p role="alert" className="text-red-600 py-3">Could not load order history.</p>}
              {ordersLoading && <p className="text-gray-500 text-center py-4">Loading orders...</p>}
              {!ordersLoading && !ordersError && orders.length === 0 && (
                <p className="text-gray-500 text-center py-8">No orders yet</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <div className="card sticky top-6">
            <h3 className="text-lg font-semibold mb-4">Place Order</h3>
            
            {selectedStock ? (
              <div className="mb-4 p-3 bg-indigo-50 rounded">
                <p className="font-medium text-indigo-900">{selectedStock.symbol}</p>
                <p className="text-sm text-gray-600">{selectedStock.companyName}</p>
                <p className="text-xl font-bold text-indigo-600 mt-2">
                  ${parseFloat(selectedStock.currentPrice).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 mt-1">{selectedStock.sector || 'Demo'} · sample price</p>
              </div>
            ) : (
              <div className="mb-4 p-3 bg-gray-50 rounded text-center text-gray-500">
                Select a stock to trade
              </div>
            )}

            <form onSubmit={handlePlaceOrder} className="space-y-4">
              <div>
                <label className="label" htmlFor="trading-account">Account</label>
                <select
                  id="trading-account"
                  value={accountId}
                  onChange={(e) => setAccountId(e.target.value)}
                  className="input-field"
                  required
                >
                  <option value="">Select an account</option>
                  {accounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.accountType} - {account.accountNumber} (${parseFloat(account.balance).toFixed(2)})
                    </option>
                  ))}
                </select>
              </div>
              {selectedAccount && <p className="text-sm text-gray-600 -mt-2">Available: ${Number(selectedAccount.balance).toFixed(2)}</p>}

              <div>
                <label className="label">Order Type</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderType('buy')}
                    className={`py-2 rounded font-medium ${
                      orderType === 'buy' 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Buy
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrderType('sell')}
                    className={`py-2 rounded font-medium ${
                      orderType === 'sell' 
                        ? 'bg-red-600 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    Sell
                  </button>
                </div>
              </div>

              <div>
                <label className="label">Quantity</label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  max={orderType === 'sell' ? Math.max(1, sharesOwned) : undefined}
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              {selectedStock && (
                <div className="p-3 bg-gray-50 rounded">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Estimated total:</span>
                    <span className="font-medium">${orderTotal.toFixed(2)}</span>
                  </div>
                  {orderType === 'sell' && <p className={`text-xs ${hasEnoughShares ? 'text-gray-500' : 'text-red-600'}`}>Shares available: {sharesOwned}</p>}
                  {orderType === 'buy' && !canAffordOrder && <p className="text-xs text-red-600 mt-1">Insufficient funds in selected account.</p>}
                </div>
              )}

              <button
                type="submit"
                disabled={!selectedStock || !accountId || accounts.length === 0 || !validQuantity || !canAffordOrder || !hasEnoughShares || isSubmitting}
                className={`w-full py-3 rounded font-medium ${
                  orderType === 'buy'
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-red-600 hover:bg-red-700 text-white'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? 'Placing order...' : `${orderType === 'buy' ? 'Buy' : 'Sell'} ${selectedStock?.symbol || 'Stock'}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trading;
