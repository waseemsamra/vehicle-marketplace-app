import React, { useState } from 'react';
import { useCustomers } from '../hooks/useCustomers';
import CustomerCard from './CustomerCard';
import CustomerModal from './CustomerModal';

const CustomerList = () => {
  const { customers, loading, error, createCustomer, updateCustomer, deleteCustomer } = useCustomers();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      await deleteCustomer(id);
    }
  };

  const handleSubmit = async (customer) => {
    if (editingCustomer) {
      await updateCustomer(editingCustomer.id, customer);
    } else {
      await createCustomer(customer);
    }
    setIsModalOpen(false);
    setEditingCustomer(null);
  };

  return (
    <section id="featured" className="py-24 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">
              Customer <span className="text-gradient">Management</span>
            </h2>
            <p className="text-slate-400 text-lg">Manage your customer database</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="mt-6 md:mt-0 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl font-semibold transition-all"
          >
            Add Customer
          </button>
        </div>

        {loading && <div className="text-center text-slate-400">Loading...</div>}
        {error && <div className="text-center text-red-400">Error: {error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {customers.map((customer) => (
            <CustomerCard 
              key={customer.id} 
              customer={customer} 
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      </div>

      {isModalOpen && (
        <CustomerModal
          customer={editingCustomer}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCustomer(null);
          }}
          onSubmit={handleSubmit}
        />
      )}
    </section>
  );
};

export default CustomerList;
