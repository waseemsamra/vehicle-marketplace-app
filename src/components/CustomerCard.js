import React from 'react';

const CustomerCard = ({ customer, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4">
      <div className="flex gap-6">
        <div className="relative w-80 h-56 flex-shrink-0">
          <img 
            src={customer.image || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop&q=80'} 
            alt={customer.name} 
            className="w-full h-full object-cover rounded-xl" 
          />
          <div className="absolute top-3 left-3 bg-rose-500 text-white text-xs font-semibold px-3 py-1.5 rounded-md">
            {customer.status || 'ACTIVE'}
          </div>
        </div>
        
        <div className="flex-1 py-1">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 leading-tight">{customer.name}</h2>
          <p className="text-gray-600 text-base mb-4">{customer.email}</p>
          
          <div className="flex items-center gap-6 mb-4 text-gray-700">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <span>{customer.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2"></path>
              </svg>
              <span>ID: {customer.id}</span>
            </div>
          </div>
        </div>

        <div className="w-56 flex-shrink-0 flex flex-col gap-3 py-1">
          <button 
            onClick={() => onEdit(customer)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            Edit Customer
          </button>
          <button 
            onClick={() => onDelete(customer.id)}
            className="w-full bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-xl transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;
