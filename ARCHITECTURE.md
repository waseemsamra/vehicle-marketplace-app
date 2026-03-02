# Architecture Diagram

## 🏗️ Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         REACT APPLICATION                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              COMPONENTS LAYER                          │    │
│  │                                                         │    │
│  │  ┌──────────────────────────────────────────────┐     │    │
│  │  │  CustomerManagement.js                       │     │    │
│  │  │  - Grid display                              │     │    │
│  │  │  - Add/Edit/Delete buttons                   │     │    │
│  │  │  - Search bar                                │     │    │
│  │  │  - Pagination                                │     │    │
│  │  │  - Form validation                           │     │    │
│  │  │  - Loading spinners                          │     │    │
│  │  │  - Toast notifications                       │     │    │
│  │  └──────────────────────────────────────────────┘     │    │
│  │                        ↓                               │    │
│  └────────────────────────────────────────────────────────┘    │
│                           ↓                                     │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              HOOKS LAYER                               │    │
│  │                                                         │    │
│  │  ┌──────────────────────────────────────────────┐     │    │
│  │  │  useCustomerApi.js                           │     │    │
│  │  │  - State management (customers, loading)     │     │    │
│  │  │  - Pagination (lastKey, hasMore)             │     │    │
│  │  │  - Data caching                              │     │    │
│  │  │  - Request cancellation                      │     │    │
│  │  │  - Toast notifications                       │     │    │
│  │  │  - Error handling                            │     │    │
│  │  └──────────────────────────────────────────────┘     │    │
│  │                        ↓                               │    │
│  └────────────────────────────────────────────────────────┘    │
│                           ↓                                     │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              SERVICES LAYER                            │    │
│  │                                                         │    │
│  │  ┌──────────────────────────────────────────────┐     │    │
│  │  │  customerApi.js                              │     │    │
│  │  │  - Axios instance                            │     │    │
│  │  │  - Request interceptor (logging)             │     │    │
│  │  │  - Response interceptor (logging)            │     │    │
│  │  │  - Error handling (ApiError class)           │     │    │
│  │  │  - Retry logic (3 retries)                   │     │    │
│  │  │  - AbortController support                   │     │    │
│  │  │  - CRUD methods                              │     │    │
│  │  └──────────────────────────────────────────────┘     │    │
│  │                        ↓                               │    │
│  └────────────────────────────────────────────────────────┘    │
│                           ↓                                     │
└─────────────────────────────────────────────────────────────────┘
                            ↓
                    HTTP REQUEST
                            ↓
┌─────────────────────────────────────────────────────────────────┐
│                      AWS CLOUD                                   │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              API GATEWAY                               │    │
│  │  - REST API                                            │    │
│  │  - CORS enabled                                        │    │
│  │  - Endpoints:                                          │    │
│  │    • GET    /customers                                 │    │
│  │    • GET    /customers/{id}                            │    │
│  │    • POST   /customers                                 │    │
│  │    • PUT    /customers/{id}                            │    │
│  │    • DELETE /customers/{id}                            │    │
│  └────────────────────────────────────────────────────────┘    │
│                           ↓                                     │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              LAMBDA FUNCTIONS                          │    │
│  │  - getCustomers                                        │    │
│  │  - getCustomer                                         │    │
│  │  - createCustomer                                      │    │
│  │  - updateCustomer                                      │    │
│  │  - deleteCustomer                                      │    │
│  └────────────────────────────────────────────────────────┘    │
│                           ↓                                     │
│  ┌────────────────────────────────────────────────────────┐    │
│  │              DYNAMODB                                  │    │
│  │  - customers table                                     │    │
│  │  - Primary Key: id                                     │    │
│  │  - Attributes: name, email, phone, status              │    │
│  └────────────────────────────────────────────────────────┘    │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 📊 Data Flow

### CREATE Customer
```
User clicks "Add Customer"
    ↓
Modal opens with form
    ↓
User fills form and clicks "Create"
    ↓
Form validation runs
    ↓
CustomerManagement calls createCustomer()
    ↓
useCustomerApi.createCustomer() called
    ↓
customerApi.create() called
    ↓
Axios POST request to /customers
    ↓
Request interceptor logs request
    ↓
API Gateway receives request
    ↓
Lambda function processes
    ↓
DynamoDB puts item
    ↓
Lambda returns new customer
    ↓
Response interceptor logs response
    ↓
Hook updates customers state
    ↓
Toast: "Customer created successfully!"
    ↓
Component re-renders with new customer
    ↓
Modal closes
```

### READ Customers (with Pagination)
```
Component mounts
    ↓
useEffect calls fetchCustomers(true)
    ↓
useCustomerApi.fetchCustomers() called
    ↓
customerApi.getAll(null, 20) called
    ↓
Axios GET request to /customers?limit=20
    ↓
Request interceptor logs request
    ↓
API Gateway receives request
    ↓
Lambda function queries DynamoDB
    ↓
DynamoDB returns items + lastKey
    ↓
Lambda returns { items, lastKey }
    ↓
Response interceptor logs response
    ↓
Hook updates: customers, lastKey, hasMore
    ↓
Component re-renders with customers
    ↓
User clicks "Load More"
    ↓
loadMore() calls fetchCustomers(false)
    ↓
customerApi.getAll(lastKey, 20) called
    ↓
Axios GET request to /customers?limit=20&lastKey=xxx
    ↓
... (same flow)
    ↓
Hook appends new items to customers array
    ↓
Component re-renders with more customers
```

### UPDATE Customer
```
User clicks "Edit" on customer card
    ↓
handleEdit() sets editingCustomer and opens modal
    ↓
Form pre-filled with customer data
    ↓
User modifies data and clicks "Update"
    ↓
Form validation runs
    ↓
CustomerManagement calls updateCustomer(id, data)
    ↓
useCustomerApi.updateCustomer() called
    ↓
customerApi.update(id, data) called
    ↓
Axios PUT request to /customers/{id}
    ↓
Request interceptor logs request
    ↓
API Gateway receives request
    ↓
Lambda function updates DynamoDB
    ↓
DynamoDB updates item
    ↓
Lambda returns updated customer
    ↓
Response interceptor logs response
    ↓
Hook updates customer in array
    ↓
Toast: "Customer updated successfully!"
    ↓
Component re-renders with updated data
    ↓
Modal closes
```

### DELETE Customer
```
User clicks "Delete" on customer card
    ↓
handleDelete() shows confirmation dialog
    ↓
User confirms deletion
    ↓
CustomerManagement calls deleteCustomer(id)
    ↓
useCustomerApi.deleteCustomer() called
    ↓
customerApi.delete(id) called
    ↓
Axios DELETE request to /customers/{id}
    ↓
Request interceptor logs request
    ↓
API Gateway receives request
    ↓
Lambda function deletes from DynamoDB
    ↓
DynamoDB removes item
    ↓
Lambda returns success
    ↓
Response interceptor logs response
    ↓
Hook removes customer from array
    ↓
Toast: "Customer deleted successfully!"
    ↓
Component re-renders without deleted customer
```

### SEARCH Customers
```
User types in search box
    ↓
handleSearch() called on change
    ↓
CustomerManagement calls searchCustomers(query)
    ↓
useCustomerApi.searchCustomers() called
    ↓
customerApi.search(query) called
    ↓
Axios GET request to /customers?search=query
    ↓
Request interceptor logs request
    ↓
API Gateway receives request
    ↓
Lambda function filters DynamoDB results
    ↓
DynamoDB returns filtered items
    ↓
Lambda returns filtered customers
    ↓
Response interceptor logs response
    ↓
Hook replaces customers with search results
    ↓
Component re-renders with filtered customers
    ↓
User clears search
    ↓
refresh() called
    ↓
fetchCustomers(true) reloads all customers
```

## 🔄 Error Handling Flow

```
API Request fails
    ↓
Response interceptor catches error
    ↓
Creates ApiError with status and message
    ↓
If status >= 500 (server error)
    ↓
Retry logic activates
    ↓
Wait 1 second
    ↓
Retry request (attempt 2)
    ↓
If fails again, wait 2 seconds
    ↓
Retry request (attempt 3)
    ↓
If still fails, throw error
    ↓
Hook catches error
    ↓
Sets error state
    ↓
Toast: "Failed to {operation}: {error message}"
    ↓
Component displays error
```

## 🎯 State Management

```
useCustomerApi Hook State:
├── customers: []           // Array of customer objects
├── loading: false          // Boolean loading state
├── error: null             // Error message string
├── lastKey: null           // Pagination key
├── hasMore: true           // More items available
├── abortControllerRef      // Request cancellation
└── cacheRef                // Data cache
```

## 📦 Component Hierarchy

```
App
├── Toaster (react-hot-toast)
├── Navbar
├── Hero
├── CustomerManagement
│   ├── Search Input
│   ├── Refresh Button
│   ├── Add Customer Button
│   ├── Customer Grid
│   │   └── Customer Cards (map)
│   │       ├── Customer Info
│   │       ├── Status Badge
│   │       ├── Edit Button
│   │       └── Delete Button
│   ├── Load More Button
│   └── Modal (conditional)
│       └── Form
│           ├── Name Input
│           ├── Email Input
│           ├── Phone Input
│           ├── Status Select
│           ├── Cancel Button
│           └── Submit Button
└── Footer
```

## 🔐 Security Flow

```
Request
    ↓
HTTPS (TLS encryption)
    ↓
API Gateway
    ↓
CORS validation
    ↓
Lambda function
    ↓
Input validation
    ↓
DynamoDB (encrypted at rest)
    ↓
Response
    ↓
CORS headers added
    ↓
HTTPS (TLS encryption)
    ↓
Client
```
