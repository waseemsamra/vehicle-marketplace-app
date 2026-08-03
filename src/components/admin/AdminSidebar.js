import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import RoleBadge from '../../components/roles/RoleBadge';

const AdminSidebar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <aside className="w-72 bg-white border-r border-gray-200 flex flex-col hidden md:flex">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-brand-500 to-purple-600 rounded-xl flex items-center justify-center">
            🚗
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-gray-900">Velociti</h1>
            <p className="text-xs text-gray-500">Admin Dashboard</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        <div className="px-3 mb-2 text-xs font-semibold text-gray-500 uppercase">Overview</div>
        
        <button onClick={() => navigate('/admin')} className="w-full sidebar-item active flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-900 bg-gray-100">
          📊 <span className="font-medium">Dashboard</span>
        </button>
        
        <button onClick={() => navigate('/admin/analytics')} className="w-full sidebar-item flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50">
          📈 <span className="font-medium">Analytics</span>
        </button>
        
        <button onClick={() => navigate('/admin/customers')} className="w-full sidebar-item flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50">
          👥 <span className="font-medium">Customers</span>
          <span className="ml-auto bg-brand-500 text-white text-xs px-2 py-0.5 rounded-full">248</span>
        </button>

        <div className="px-3 mt-8 mb-2 text-xs font-semibold text-gray-500 uppercase">Management</div>
        
        <button onClick={() => navigate('/admin/vehicles')} className="w-full sidebar-item flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50">
          🚗 <span className="font-medium">Vehicle Management</span>
        </button>
        
        <button onClick={() => navigate('/admin/sellers')} className="w-full sidebar-item flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50">
          🏢 <span className="font-medium">Seller Management</span>
        </button>
        
        <button onClick={() => navigate('/admin/buyers')} className="w-full sidebar-item flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50">
          👤 <span className="font-medium">Buyer Management</span>
        </button>
        
        <button onClick={() => navigate('/admin/inventory')} className="w-full sidebar-item flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50">
          🚙 <span className="font-medium">Inventory</span>
        </button>
        
         <button onClick={() => navigate('/admin/orders')} className="w-full sidebar-item flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50">
          🛒 <span className="font-medium">Orders</span>
        </button>

        <button onClick={() => navigate('/admin/roles')} className="w-full sidebar-item flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50">
          🛡️ <span className="font-medium">User Roles</span>
        </button>

        <div className="px-3 mt-8 mb-2 text-xs font-semibold text-gray-500 uppercase">System</div>
        
        <button onClick={() => navigate('/admin/settings')} className="w-full sidebar-item flex items-center space-x-3 px-3 py-3 rounded-lg text-gray-600 hover:text-gray-900 hover:bg-gray-50">
          ⚙️ <span className="font-medium">Settings</span>
        </button>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50">
          <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold">
            {user?.username?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.username || 'Admin'}</p>
            <RoleBadge user={user} size="sm" />
          </div>
          <button onClick={handleSignOut} className="text-gray-400 hover:text-red-500">
            🚪
          </button>
        </div>
      </div>
    </aside>
  );
};

export default AdminSidebar;
