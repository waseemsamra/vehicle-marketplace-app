// ============================================
// EXAMPLE IMPLEMENTATIONS
// ============================================

// 1. Basic Usage
import React, { useEffect } from 'react';
import { useCustomerApi } from '../hooks/useCustomerApi';

function BasicExample() {
  const { customers, loading, error, fetchCustomers } = useCustomerApi();

  useEffect(() => {
    fetchCustomers(true);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {customers.map(customer => (
        <div key={customer.id}>{customer.name}</div>
      ))}
    </div>
  );
}

// 2. Create Customer
function CreateExample() {
  const { createCustomer, loading } = useCustomerApi();
  const [form, setForm] = React.useState({ name: '', email: '', phone: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCustomer(form);
      setForm({ name: '', email: '', phone: '' });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
      <button disabled={loading}>{loading ? 'Creating...' : 'Create'}</button>
    </form>
  );
}

// 3. Pagination
function PaginationExample() {
  const { customers, hasMore, loadMore, loading } = useCustomerApi();

  return (
    <div>
      {customers.map(c => <div key={c.id}>{c.name}</div>)}
      {hasMore && <button onClick={loadMore} disabled={loading}>Load More</button>}
    </div>
  );
}

// 4. Search
function SearchExample() {
  const { customers, searchCustomers, refresh } = useCustomerApi();
  const [query, setQuery] = React.useState('');

  const handleSearch = (e) => {
    const value = e.target.value;
    setQuery(value);
    value.trim() ? searchCustomers(value) : refresh();
  };

  return (
    <div>
      <input value={query} onChange={handleSearch} placeholder="Search..." />
      {customers.map(c => <div key={c.id}>{c.name}</div>)}
    </div>
  );
}

// 5. Direct API Usage
import { customerApi } from '../services/customerApi';

async function directApiUsage() {
  const result = await customerApi.getAll();
  const customer = await customerApi.getById('123');
  const created = await customerApi.create({ name: 'John', email: 'john@example.com', phone: '+1234567890' });
  const updated = await customerApi.update('123', { name: 'John Updated' });
  await customerApi.delete('123');
}
