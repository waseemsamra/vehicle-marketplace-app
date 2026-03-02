import React from 'react';

const RecentOrders = () => {
  const orders = [
    { vehicle: 'Porsche 911', customer: 'John Doe', date: '2 mins ago', amount: '$142,500', status: 'Completed' },
    { vehicle: 'Tesla Model S', customer: 'Alice Smith', date: '15 mins ago', amount: '$95,000', status: 'Pending' },
    { vehicle: 'BMW M4', customer: 'Robert Johnson', date: '1 hour ago', amount: '$78,900', status: 'Processing' }
  ];

  return (
    <div className="glass-panel rounded-2xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-white">Recent Orders</h3>
          <p className="text-sm text-slate-400">Latest transactions and status</p>
        </div>
        <button className="text-brand-500 hover:text-brand-400 text-sm font-medium">View All →</button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-semibold text-slate-400 uppercase border-b border-slate-700">
              <th className="pb-3">Vehicle</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {orders.map((order, i) => (
              <tr key={i} className="hover:bg-slate-800/50">
                <td className="py-4 font-medium text-white">{order.vehicle}</td>
                <td className="py-4 text-slate-300">{order.customer}</td>
                <td className="py-4 text-sm text-slate-400">{order.date}</td>
                <td className="py-4 font-semibold text-white">{order.amount}</td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'Completed' ? 'bg-green-500/20 text-green-400' :
                    order.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
