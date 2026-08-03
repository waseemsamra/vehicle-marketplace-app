import React from 'react';

const RecentOrders = () => {
  const orders = [
    { vehicle: 'Porsche 911', customer: 'John Doe', date: '2 mins ago', amount: '$142,500', status: 'Completed' },
    { vehicle: 'Tesla Model S', customer: 'Alice Smith', date: '15 mins ago', amount: '$95,000', status: 'Pending' },
    { vehicle: 'BMW M4', customer: 'Robert Johnson', date: '1 hour ago', amount: '$78,900', status: 'Processing' }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Recent Orders</h3>
          <p className="text-sm text-gray-500">Latest transactions and status</p>
        </div>
        <button className="text-brand-600 hover:text-brand-500 text-sm font-medium">View All →</button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left text-xs font-semibold text-gray-500 uppercase border-b border-gray-200">
              <th className="pb-3">Vehicle</th>
              <th className="pb-3">Customer</th>
              <th className="pb-3">Date</th>
              <th className="pb-3">Amount</th>
              <th className="pb-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders.map((order, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="py-4 font-medium text-gray-900">{order.vehicle}</td>
                <td className="py-4 text-gray-600">{order.customer}</td>
                <td className="py-4 text-sm text-gray-500">{order.date}</td>
                <td className="py-4 font-semibold text-gray-900">{order.amount}</td>
                <td className="py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                    order.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-blue-100 text-blue-700'
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
