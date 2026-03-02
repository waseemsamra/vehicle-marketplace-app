import React from 'react';

const RevenueChart = () => {
  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Revenue Overview</h3>
          <p className="text-sm text-slate-400">Monthly revenue and sales comparison</p>
        </div>
        <select className="bg-slate-800 border border-slate-700 text-white text-sm rounded-lg px-3 py-2">
          <option>Last 6 Months</option>
          <option>Last Year</option>
        </select>
      </div>
      <div className="h-64 flex items-center justify-center text-slate-500">
        📊 Chart visualization (integrate Chart.js or Recharts)
      </div>
    </div>
  );
};

export default RevenueChart;
