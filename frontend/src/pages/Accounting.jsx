import React, { useMemo, useState } from 'react';

const Accounting = () => {
  const [entries, setEntries] = useState([]);
  const [type, setType] = useState('expense');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Food');
  const [amount, setAmount] = useState('');
  const [budget, setBudget] = useState(2000);

  const totals = useMemo(() => entries.reduce((result, entry) => {
    result[entry.type] += entry.amount;
    return result;
  }, { income: 0, expense: 0 }), [entries]);
  const expenseRatio = Number(budget) > 0 ? Math.min((totals.expense / Number(budget)) * 100, 100) : 0;

  const addEntry = (event) => {
    event.preventDefault();
    const value = Number(amount);
    if (!description.trim() || !Number.isFinite(value) || value <= 0) return;
    setEntries((current) => [{ id: `${Date.now()}-${Math.random()}`, type, description: description.trim(), category, amount: value, date: new Date().toLocaleDateString() }, ...current]);
    setDescription('');
    setAmount('');
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Personal Accounting</h1>
        <p className="text-gray-600 mt-1">Add sample income and expenses to see your cash flow update.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card"><p className="text-sm text-gray-600">Tracked income</p><p className="text-2xl font-bold text-green-600 mt-2">${totals.income.toFixed(2)}</p></div>
        <div className="card"><p className="text-sm text-gray-600">Tracked expenses</p><p className="text-2xl font-bold text-red-600 mt-2">${totals.expense.toFixed(2)}</p></div>
        <div className="card"><p className="text-sm text-gray-600">Net cash flow</p><p className={`text-2xl font-bold mt-2 ${totals.income - totals.expense >= 0 ? 'text-indigo-600' : 'text-red-600'}`}>${(totals.income - totals.expense).toFixed(2)}</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form className="card space-y-4" onSubmit={addEntry}>
          <h2 className="text-lg font-semibold">Add an entry</h2>
          <div>
            <label className="label" htmlFor="entry-type">Type</label>
            <select id="entry-type" className="input-field" value={type} onChange={(event) => setType(event.target.value)}>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="entry-description">Description</label>
            <input id="entry-description" className="input-field" value={description} onChange={(event) => setDescription(event.target.value)} placeholder="e.g. Groceries or salary" required maxLength="80" />
          </div>
          <div>
            <label className="label" htmlFor="entry-category">Category</label>
            <select id="entry-category" className="input-field" value={category} onChange={(event) => setCategory(event.target.value)}>
              <option>Food</option><option>Housing</option><option>Transport</option><option>Utilities</option><option>Salary</option><option>Other</option>
            </select>
          </div>
          <div>
            <label className="label" htmlFor="entry-amount">Amount ($)</label>
            <input id="entry-amount" className="input-field" type="number" min="0.01" step="0.01" value={amount} onChange={(event) => setAmount(event.target.value)} required />
          </div>
          <button className="btn-primary w-full" type="submit">Add {type}</button>
        </form>

        <section className="card">
          <div className="flex items-center justify-between gap-3 mb-4">
            <h2 className="text-lg font-semibold">Expense budget</h2>
            <label className="text-sm text-gray-600">Monthly limit $
              <input aria-label="Monthly expense budget" className="ml-2 w-24 px-2 py-1 border rounded" type="number" min="1" value={budget} onChange={(event) => setBudget(event.target.value)} />
            </label>
          </div>
          <p className="text-sm text-gray-600">${totals.expense.toFixed(2)} of ${Number(budget || 0).toFixed(2)} used</p>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-2 mb-6">
            <div className={`h-3 rounded-full ${expenseRatio >= 100 ? 'bg-red-600' : 'bg-indigo-600'}`} style={{ width: `${expenseRatio}%` }} />
          </div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Recent entries</h3>
            {entries.length > 0 && <button type="button" className="text-sm text-red-600 hover:underline" onClick={() => setEntries([])}>Clear</button>}
          </div>
          <div className="space-y-3 max-h-72 overflow-y-auto">
            {entries.map((entry) => <div key={entry.id} className="flex justify-between gap-4 border-b pb-3">
              <div><p className="font-medium">{entry.description}</p><p className="text-xs text-gray-500">{entry.category} · {entry.date}</p></div>
              <p className={`font-semibold whitespace-nowrap ${entry.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>{entry.type === 'income' ? '+' : '-'}${entry.amount.toFixed(2)}</p>
            </div>)}
            {entries.length === 0 && <p className="text-sm text-gray-500 py-5 text-center">No entries yet. Add one to start tracking.</p>}
          </div>
          <p className="text-xs text-gray-500 mt-4">Demo entries are held in page memory and reset when you leave or refresh.</p>
        </section>
      </div>
    </div>
  );
};

export default Accounting;
