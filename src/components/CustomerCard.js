import React from 'react';

const CustomerCard = ({ customer, onEdit, onDelete }) => {
  return (
    <div className="car-card group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 hover:border-brand-500/50 transition-all duration-500 cursor-pointer">
      <div className="relative h-64 overflow-hidden">
        <img 
          src={customer.image || 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop&q=80'} 
          alt={customer.name} 
          className="car-image w-full h-full object-cover transition-transform duration-700" 
        />
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-brand-500/90 backdrop-blur-sm text-white text-xs font-bold rounded-full">
            {customer.status || 'ACTIVE'}
          </span>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-900 to-transparent"></div>
      </div>
      
      <div className="p-6">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">{customer.name}</h3>
            <p className="text-slate-400 text-sm">{customer.email}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-slate-400">{customer.phone}</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-4 mt-4 py-4 border-t border-slate-800">
          <div className="flex items-center space-x-1 text-slate-400 text-sm">
            <span>ID: {customer.id}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <button 
            onClick={() => onEdit(customer)}
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-brand-600 text-white font-semibold transition-all duration-300"
          >
            Edit
          </button>
          <button 
            onClick={() => onDelete(customer.id)}
            className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-red-600 text-white font-semibold transition-all duration-300"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomerCard;
