import React from 'react';

const AdminHeader = () => {
  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800 px-8 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-white">Dashboard Overview</h2>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center bg-slate-800 rounded-full px-4 py-2 border border-slate-700">
            🔍
            <input type="text" placeholder="Search anything..." className="bg-transparent border-none outline-none text-sm text-white placeholder-slate-500 w-64 ml-2" />
          </div>
          
          <button className="relative p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white">
            🔔
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-slate-900"></span>
          </button>
          
          <button className="flex items-center space-x-2 bg-brand-600 hover:bg-brand-500 text-white px-4 py-2 rounded-full font-medium">
            ➕ <span className="hidden sm:inline">Add Listing</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
