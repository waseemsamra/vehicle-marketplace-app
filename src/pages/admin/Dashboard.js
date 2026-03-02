import React from 'react';
import MetricsGrid from '../../components/admin/MetricsGrid';
import RevenueChart from '../../components/admin/RevenueChart';
import RecentOrders from '../../components/admin/RecentOrders';

const AdminDashboard = () => {
  return (
    <div className="p-8 space-y-8">
      <MetricsGrid />
      <RevenueChart />
      <RecentOrders />
    </div>
  );
};

export default AdminDashboard;
