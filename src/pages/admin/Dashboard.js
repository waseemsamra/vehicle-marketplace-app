import React from 'react';
import MetricsGrid from '../../components/admin/MetricsGrid';
import RevenueChart from '../../components/admin/RevenueChart';
import RecentOrders from '../../components/admin/RecentOrders';

const API_URL = (process.env.REACT_APP_API_URL || 'http://localhost:5001/api').replace(/\/$/, '');

const AdminDashboard = () => {
  const handleSeed = async () => {
    if (!window.confirm('Seed all reference data? This will reset cities and settings categories.')) return;
    try {
      const res = await fetch(`${API_URL}/seed`, { method: 'POST' });
      if (!res.ok) throw new Error('Seed failed');
      const data = await res.json();
      alert(`Seeded: ${data.cities} cities, ${data.attributes} attributes`);
    } catch (e) {
      alert(e.message);
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-500">System metrics and recent activity</p>
        </div>
        <button
          onClick={handleSeed}
          className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-gray-900 rounded-lg font-semibold transition-all"
        >
          Seed Data
        </button>
      </div>
      <MetricsGrid />
      <RevenueChart />
      <RecentOrders />
    </div>
  );
};

export default AdminDashboard;
