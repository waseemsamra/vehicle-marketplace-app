import React from 'react';

const MetricsGrid = () => {
  const metrics = [
    { title: 'Total Revenue', value: '$2.4M', change: '+12.5%', icon: '💰', color: 'brand', prev: '$2.1M' },
    { title: 'Total Sales', value: '1,284', change: '+8.2%', icon: '🛍️', color: 'green', prev: '1,186' },
    { title: 'Active Listings', value: '856', change: '-2.4%', icon: '🚗', color: 'purple', prev: '42 pending' },
    { title: 'New Users', value: '324', change: '+18.7%', icon: '👥', color: 'orange', prev: '273' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, i) => (
        <div key={i} className="bg-white rounded-2xl p-6 relative overflow-hidden group hover:border-brand-500/30 border border-gray-200 transition-all">
          <div className={`absolute top-0 right-0 w-32 h-32 bg-${metric.color}-500/10 rounded-full blur-3xl -mr-16 -mt-16`}></div>
          <div className="flex items-center justify-between mb-4">
            <div className={`p-3 bg-${metric.color}-500/20 rounded-xl text-2xl`}>{metric.icon}</div>
            <span className={`flex items-center ${metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'} text-sm font-medium`}>
              {metric.change.startsWith('+') ? '📈' : '📉'} {metric.change}
            </span>
          </div>
          <h3 className="text-gray-500 text-sm font-medium mb-1">{metric.title}</h3>
          <p className="text-3xl font-bold text-gray-900">{metric.value}</p>
          <p className="text-xs text-gray-400 mt-2">vs last month {metric.prev}</p>
        </div>
      ))}
    </div>
  );
};

export default MetricsGrid;
