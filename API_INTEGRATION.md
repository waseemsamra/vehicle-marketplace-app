# API Integration Documentation

## 🚀 Complete API Integration Setup

Your React application now has full API integration with AWS backend.

## 📁 Files Created

### 1. API Service Layer
**File**: `src/services/customerApi.js`

**Features**:
- ✅ Axios instance with base configuration
- ✅ Request/response interceptors for logging
- ✅ Custom error handling with ApiError class
- ✅ Retry logic for failed requests (3 retries with exponential backoff)
- ✅ AbortController support for request cancellation
- ✅ All CRUD operations (GET, POST, PUT, DELETE)
- ✅ Pagination support with lastKey
- ✅ Search functionality

**Methods**:
```javascript
customerApi.getAll(lastKey, limit, signal)
customerApi.getById(id, signal)
customerApi.create(customer, signal)
customerApi.update(id, customer, signal)
customerApi.delete(id, signal)
customerApi.search(query, signal)
```

### 2. Custom React Hook
**File**: `src/hooks/useCustomerApi.js`

**Features**:
- ✅ State management for customers, loading, error
- ✅ Pagination with lastKey and hasMore
- ✅ Data caching
- ✅ Automatic cleanup on unmount
- ✅ Toast notifications for success/error
- ✅ Request cancellation support

**Returns**:
```javascript
{
  customers,        // Array of customers
  loading,          // Boolean loading state
  error,            // Error message string
  hasMore,          // Boolean for pagination
  fetchCustomers,   // Function(reset)
  fetchCustomer,    // Function(id)
  createCustomer,   // Function(customer)
  updateCustomer,   // Function(id, customer)
  deleteCustomer,   // Function(id)
  searchCustomers,  // Function(query)
  loadMore,         // Function()
  refresh,          // Function()
}
```

### 3. CustomerManagement Component
**File**: `src/components/CustomerManagement.js`

**Features**:
- ✅ Full CRUD interface
- ✅ Pagination with "Load More" button
- ✅ Search functionality
- ✅ Form validation
- ✅ Loading spinners
- ✅ Toast notifications
- ✅ Confirmation dialogs
- ✅ Modal forms
- ✅ Error handling
- ✅ Empty states

### 4. Usage Examples
**File**: `src/examples/UsageExamples.js`

Contains 5 example implementations:
- Basic usage
- Create customer
- Pagination
- Search
- Direct API usage

## 🔧 Configuration

### Environment Variables

Create `.env` file:
```bash
REACT_APP_API_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/dev
```

### API Response Format

Your backend should return:

**GET /customers**
```json
{
  "items": [
    {
      "id": "customer-123",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "status": "ACTIVE"
    }
  ],
  "lastKey": "customer-123"
}
```

**POST /customers**
```json
{
  "id": "customer-124",
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "status": "ACTIVE"
}
```

**PUT /customers/{id}**
```json
{
  "id": "customer-123",
  "name": "John Updated",
  "email": "john@example.com",
  "phone": "+1234567890",
  "status": "ACTIVE"
}
```

**DELETE /customers/{id}**
```json
{
  "message": "Customer deleted successfully"
}
```

## 📝 Usage Examples

### Basic Component Usage

```javascript
import React, { useEffect } from 'react';
import { useCustomerApi } from './hooks/useCustomerApi';

function MyComponent() {
  const { 
    customers, 
    loading, 
    error, 
    fetchCustomers 
  } = useCustomerApi();

  useEffect(() => {
    fetchCustomers(true);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {customers.map(customer => (
        <div key={customer.id}>
          <h3>{customer.name}</h3>
          <p>{customer.email}</p>
        </div>
      ))}
    </div>
  );
}
```

### Create Customer

```javascript
const { createCustomer, loading } = useCustomerApi();

const handleCreate = async () => {
  try {
    const newCustomer = await createCustomer({
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      status: 'ACTIVE'
    });
    console.log('Created:', newCustomer);
  } catch (error) {
    console.error('Failed:', error);
  }
};
```

### Update Customer

```javascript
const { updateCustomer } = useCustomerApi();

const handleUpdate = async (id) => {
  try {
    await updateCustomer(id, {
      name: 'John Updated',
      email: 'john.updated@example.com',
      phone: '+1234567890'
    });
  } catch (error) {
    console.error('Failed:', error);
  }
};
```

### Delete Customer

```javascript
const { deleteCustomer } = useCustomerApi();

const handleDelete = async (id) => {
  if (!window.confirm('Delete this customer?')) return;
  
  try {
    await deleteCustomer(id);
  } catch (error) {
    console.error('Failed:', error);
  }
};
```

### Pagination

```javascript
const { customers, hasMore, loadMore, loading } = useCustomerApi();

return (
  <div>
    {customers.map(c => <div key={c.id}>{c.name}</div>)}
    
    {hasMore && (
      <button onClick={loadMore} disabled={loading}>
        {loading ? 'Loading...' : 'Load More'}
      </button>
    )}
  </div>
);
```

### Search

```javascript
const { customers, searchCustomers, refresh } = useCustomerApi();
const [query, setQuery] = useState('');

const handleSearch = (e) => {
  const value = e.target.value;
  setQuery(value);
  
  if (value.trim()) {
    searchCustomers(value);
  } else {
    refresh();
  }
};

return (
  <div>
    <input 
      value={query} 
      onChange={handleSearch} 
      placeholder="Search customers..." 
    />
    {customers.map(c => <div key={c.id}>{c.name}</div>)}
  </div>
);
```

### Direct API Service Usage

```javascript
import { customerApi } from './services/customerApi';

// Get all
const result = await customerApi.getAll();
console.log(result.items, result.lastKey, result.hasMore);

// Get one
const customer = await customerApi.getById('customer-123');

// Create
const created = await customerApi.create({
  name: 'John',
  email: 'john@example.com',
  phone: '+1234567890'
});

// Update
const updated = await customerApi.update('customer-123', {
  name: 'John Updated'
});

// Delete
await customerApi.delete('customer-123');

// Search
const results = await customerApi.search('john');
```

## 🎯 Features Implemented

### API Service (customerApi.js)
- ✅ Axios instance with 30s timeout
- ✅ Request logging
- ✅ Response logging
- ✅ Error handling with custom ApiError class
- ✅ Retry logic (3 retries, exponential backoff)
- ✅ AbortController support
- ✅ Pagination support
- ✅ Search support

### Custom Hook (useCustomerApi.js)
- ✅ State management (customers, loading, error)
- ✅ Pagination (lastKey, hasMore)
- ✅ Data caching
- ✅ Toast notifications
- ✅ Request cancellation
- ✅ Automatic cleanup
- ✅ All CRUD operations
- ✅ Search functionality
- ✅ Refresh functionality

### Component (CustomerManagement.js)
- ✅ Customer grid display
- ✅ Add customer button
- ✅ Edit customer
- ✅ Delete customer with confirmation
- ✅ Search bar
- ✅ Pagination (Load More)
- ✅ Form validation
- ✅ Loading states
- ✅ Error states
- ✅ Toast notifications
- ✅ Modal forms
- ✅ Empty states
- ✅ Refresh button

## 🔐 Error Handling

### API Errors
```javascript
try {
  await customerApi.create(data);
} catch (error) {
  console.log(error.message);  // User-friendly message
  console.log(error.status);   // HTTP status code
  console.log(error.data);     // Response data
}
```

### Hook Errors
```javascript
const { error } = useCustomerApi();

if (error) {
  // Error is automatically displayed via toast
  // Also available in error state
  console.log(error);
}
```

## 🚀 Running the Application

```bash
# Install dependencies
npm install

# Set API URL
echo "REACT_APP_API_URL=https://your-api-id.execute-api.us-east-1.amazonaws.com/dev" > .env

# Start development server
npm start
```

## 📦 Dependencies Added

```json
{
  "axios": "^1.6.0",
  "react-hot-toast": "^2.4.1"
}
```

## 🔧 Backend Requirements

### CORS Configuration
```json
{
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
}
```

### Lambda Response Format
```javascript
{
  statusCode: 200,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(data)
}
```

## 🎨 Toast Notifications

Automatically shown for:
- ✅ Customer created successfully
- ✅ Customer updated successfully
- ✅ Customer deleted successfully
- ❌ Failed to fetch customers
- ❌ Failed to create customer
- ❌ Failed to update customer
- ❌ Failed to delete customer
- ❌ Search failed

## 📊 Request Flow

```
Component
    ↓
useCustomerApi Hook
    ↓
customerApi Service
    ↓
Axios Instance
    ↓
Request Interceptor (logging)
    ↓
AWS API Gateway
    ↓
Lambda Function
    ↓
DynamoDB
    ↓
Response Interceptor (logging)
    ↓
Error Handler (if error)
    ↓
Retry Logic (if 5xx error)
    ↓
Hook (update state)
    ↓
Component (re-render)
```

## ✅ Testing Checklist

- [ ] GET /customers returns list
- [ ] GET /customers with lastKey returns next page
- [ ] GET /customers/{id} returns single customer
- [ ] POST /customers creates customer
- [ ] PUT /customers/{id} updates customer
- [ ] DELETE /customers/{id} deletes customer
- [ ] Search returns filtered results
- [ ] CORS headers are present
- [ ] Error responses are handled
- [ ] Loading states work
- [ ] Toast notifications appear
- [ ] Pagination works
- [ ] Form validation works

## 🎉 Complete!

Your React application now has production-ready API integration with:
- Complete CRUD operations
- Pagination support
- Search functionality
- Error handling
- Loading states
- Toast notifications
- Request cancellation
- Retry logic
- Data caching

All code is in `/tmp/customer-app/`
