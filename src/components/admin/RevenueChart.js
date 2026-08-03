import React from 'react';

const RevenueChart = () => {
  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
          <p className="text-sm text-gray-500">Monthly revenue and sales comparison</p>
        </div>
        <select className="bg-gray-100 border border-gray-300 text-gray-900 text-sm rounded-lg px-3 py-2">
          <option>Last 6 Months</option>
          <option>Last Year</option>
        </select>
      </div>
      <div className="h-64 flex items-center justify-center text-gray-400">
        📊 Chart visualization (integrate Chart.js or Recharts)
      </div>
    </div>
  );
};

export default RevenueChart;
