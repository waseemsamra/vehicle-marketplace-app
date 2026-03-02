# Quick Reference Guide

## 🚀 API Integration - Quick Start

### 1. Configuration
```bash
# .env file
REACT_APP_API_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/dev
```

### 2. Import Hook
```javascript
import { useCustomerApi } from './hooks/useCustomerApi';
```

### 3. Use in Component
```javascript
const {
  customers,        // Array of customers
  loading,          // Boolean
  error,            // String or null
  hasMore,          // Boolean for pagination
  fetchCustomers,   // Function(reset: boolean)
  createCustomer,   // Function(customer: object)
  updateCustomer,   // Function(id: string, customer: object)
  deleteCustomer,   // Function(id: string)
  searchCustomers,  // Function(query: string)
  loadMore,         // Function()
  refresh,          // Function()
} = useCustomerApi();
```

## 📝 Common Operations

### Fetch All Customers
```javascript
useEffect(() => {
  fetchCustomers(true);
}, []);
```

### Create Customer
```javascript
await createCustomer({
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+1234567890',
  status: 'ACTIVE'
});
```

### Update Customer
```javascript
await updateCustomer('customer-123', {
  name: 'John Updated',
  email: 'john@example.com',
  phone: '+1234567890'
});
```

### Delete Customer
```javascript
await deleteCustomer('customer-123');
```

### Search
```javascript
searchCustomers('john');
```

### Pagination
```javascript
{hasMore && <button onClick={loadMore}>Load More</button>}
```

## 🔧 Direct API Usage

```javascript
import { customerApi } from './services/customerApi';

// All operations
const result = await customerApi.getAll(lastKey, limit);
const customer = await customerApi.getById(id);
const created = await customerApi.create(data);
const updated = await customerApi.update(id, data);
await customerApi.delete(id);
const results = await customerApi.search(query);
```

## 🎯 Key Files

| File | Purpose |
|------|---------|
| `src/services/customerApi.js` | API service with axios |
| `src/hooks/useCustomerApi.js` | React hook for state management |
| `src/components/CustomerManagement.js` | Full CRUD component |
| `src/examples/UsageExamples.js` | Code examples |

## ✅ Features

- ✅ Full CRUD operations
- ✅ Pagination with lastKey
- ✅ Search functionality
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling
- ✅ Toast notifications
- ✅ Request cancellation
- ✅ Retry logic (3 retries)
- ✅ Data caching
- ✅ Request/response logging

## 🚀 Run Application

```bash
npm install
npm start
```

## 📦 Dependencies

- axios
- react-hot-toast

## 🔐 Backend Format

```json
{
  "items": [...],
  "lastKey": "customer-123"
}
```

## 🎨 Toast Messages

- ✅ "Customer created successfully!"
- ✅ "Customer updated successfully!"
- ✅ "Customer deleted successfully!"
- ❌ "Failed to fetch customers: {error}"
- ❌ "Failed to create customer: {error}"
