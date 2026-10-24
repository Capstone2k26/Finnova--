import React, { useState } from 'react';

const Bonds = () => {
  const [faceValue, setFaceValue] = useState(1000);
  const [price, setPrice] = useState(950);
  const [couponRate, setCouponRate] = useState(5);
  const [years, setYears] = useState(5);

  const face = Number(faceValue);
  const marketPrice = Number(price);
  const coupon = face * Number(couponRate) / 100;
  const term = Number(years);
  const currentYield = marketPrice > 0 ? (coupon / marketPrice) * 100 : 0;
  const estimatedYtm = term > 0 && face + marketPrice > 0
    ? ((coupon + (face - marketPrice) / term) / ((face + marketPrice) / 2)) * 100
    : 0;
  const totalCoupons = coupon * term;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Bond Calculator</h1>
        <p className="text-gray-600 mt-1">Estimate coupon income and bond yields from sample inputs.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <form className="card space-y-5" onSubmit={(event) => event.preventDefault()}>
          <div>
            <label className="label" htmlFor="bond-face">Face value ($)</label>
            <input id="bond-face" className="input-field" type="number" min="1" value={faceValue} onChange={(event) => setFaceValue(event.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="bond-price">Purchase price ($)</label>
            <input id="bond-price" className="input-field" type="number" min="1" value={price} onChange={(event) => setPrice(event.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="bond-coupon">Annual coupon rate (%)</label>
            <input id="bond-coupon" className="input-field" type="number" min="0" max="100" step="0.1" value={couponRate} onChange={(event) => setCouponRate(event.target.value)} />
          </div>
          <div>
            <label className="label" htmlFor="bond-years">Years to maturity</label>
            <input id="bond-years" className="input-field" type="number" min="1" max="100" value={years} onChange={(event) => setYears(event.target.value)} />
          </div>
        </form>
        <section className="card">
          <h2 className="text-lg font-semibold mb-5">Estimated bond returns</h2>
          <div className="space-y-4">
            <div><p className="text-sm text-gray-500">Annual coupon income</p><p className="text-2xl font-bold text-gray-800">${coupon.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p></div>
            <div><p className="text-sm text-gray-500">Current yield</p><p className="text-2xl font-bold text-indigo-600">{currentYield.toFixed(2)}%</p></div>
            <div><p className="text-sm text-gray-500">Approx. yield to maturity</p><p className="text-2xl font-bold text-indigo-600">{estimatedYtm.toFixed(2)}%</p></div>
            <div><p className="text-sm text-gray-500">Total coupon payments (if held to maturity)</p><p className="text-xl font-semibold text-green-600">${totalCoupons.toLocaleString('en-US', { maximumFractionDigits: 2 })}</p></div>
          </div>
          <p className="text-xs text-gray-500 mt-5">YTM is a simplified estimate; it assumes annual coupons and excludes taxes, fees, and reinvestment effects. Not financial advice.</p>
        </section>
      </div>
    </div>
  );
};

export default Bonds;
