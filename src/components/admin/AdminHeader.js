import React from 'react';

const AdminHeader = () => {
  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-display font-bold text-gray-900">Dashboard Overview</h2>
        
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2 border border-gray-200">
            🔍
            <input type="text" placeholder="Search anything..." className="bg-transparent border-none outline-none text-sm text-gray-900 placeholder-gray-400 w-64 ml-2" />
          </div>
          
          <button className="relative p-2 rounded-full bg-gray-100 text-gray-600 hover:text-gray-900">
            🔔
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
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
