import React, { useState } from 'react';

const MutualFunds = () => {
  const [monthly, setMonthly] = useState(5000);
  const [annualRate, setAnnualRate] = useState(12);
  const [years, setYears] = useState(10);

  const months = Number(years) * 12;
  const monthlyRate = Number(annualRate) / 1200;
  const invested = Number(monthly) * months;
  const estimatedValue = monthlyRate > 0
    ? Number(monthly) * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate)
    : invested;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Mutual Fund SIP Calculator</h1>
        <p className="text-gray-600 mt-1">Explore how regular monthly investing may grow over time.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form className="card space-y-5" onSubmit={(event) => event.preventDefault()}>
          <div>
            <label className="label" htmlFor="sip-monthly">Monthly investment ($)</label>
            <input id="sip-monthly" className="input-field" type="number" min="1" step="100" value={monthly} onChange={(event) => setMonthly(event.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="sip-rate">Expected annual return (%)</label>
            <input id="sip-rate" className="input-field" type="number" min="0" max="100" step="0.1" value={annualRate} onChange={(event) => setAnnualRate(event.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="sip-years">Investment period (years)</label>
            <input id="sip-years" className="input-field" type="number" min="1" max="50" value={years} onChange={(event) => setYears(event.target.value)} />
          </div>
          <p className="text-xs text-gray-500">Illustrative estimate only. Actual market returns vary and are not guaranteed.</p>
        </form>

        <section className="card">
          <h2 className="text-lg font-semibold mb-5">Estimated SIP outcome</h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Total contributions</p>
              <p className="text-2xl font-bold text-gray-800">${invested.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Estimated value</p>
              <p className="text-3xl font-bold text-indigo-600">${estimatedValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Estimated growth</p>
              <p className="text-xl font-semibold text-green-600">${(estimatedValue - invested).toLocaleString('en-US', { maximumFractionDigits: 2 })}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default MutualFunds;
