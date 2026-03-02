# Development Guidelines

## Code Quality Standards

### Code Formatting
- **Indentation**: 2 spaces (consistent across all files)
- **Semicolons**: Optional - not consistently used (modern JavaScript style)
- **Quotes**: Single quotes for strings, double quotes for JSX attributes
- **Line Length**: Generally kept under 120 characters for readability
- **Trailing Commas**: Used in multi-line objects and arrays

### Naming Conventions
- **Components**: PascalCase (e.g., `VehicleDetail`, `CustomerCard`, `MonitoringDashboard`)
- **Files**: Match component names - PascalCase for components (e.g., `VehicleDetail.js`)
- **Hooks**: camelCase with `use` prefix (e.g., `useVehicleApi`, `useCustomers`, `useAuth`)
- **Services**: camelCase with descriptive names (e.g., `vehicleApi`, `authService`, `customerService`)
- **Constants**: UPPER_SNAKE_CASE for environment variables (e.g., `REACT_APP_API_URL`)
- **Variables**: camelCase (e.g., `selectedImage`, `downPayment`, `isFavorited`)
- **Functions**: camelCase, descriptive action verbs (e.g., `loadVehicle`, `calculateMonthlyPayment`, `nextImage`)
- **Event Handlers**: Prefix with `handle` or use descriptive names (e.g., `handleKeyDown`, `onClick`)

### File Organization
- **Imports Order**: 
  1. React and React-related imports
  2. Third-party libraries (react-router-dom, axios, toast)
  3. Local services and utilities
  4. Local components
  5. Configuration files
  6. Styles (CSS imports last)
- **Export Pattern**: Default exports for components, named exports for services and utilities

### Component Structure
```javascript
// 1. Imports
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// 2. Component definition
const ComponentName = () => {
  // 3. Hooks (useState, useEffect, custom hooks)
  const [state, setState] = useState(initialValue);
  
  // 4. Derived state and computed values
  const derivedValue = computeFromState(state);
  
  // 5. Effects
  useEffect(() => {
    // effect logic
  }, [dependencies]);
  
  // 6. Event handlers and helper functions
  const handleAction = () => {
    // handler logic
  };
  
  // 7. Early returns (loading, error states)
  if (loading) return <LoadingSpinner />;
  
  // 8. Main render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

// 9. Export
export default ComponentName;
```

## React Patterns

### State Management
- **Local State**: Use `useState` for component-specific UI state
- **Custom Hooks**: Encapsulate complex state logic and API calls (5/5 files use this pattern)
  ```javascript
  const { vehicles, loading, error, fetchVehicles } = useVehicleApi();
  ```
- **Refs**: Use `useRef` for DOM references and mutable values that don't trigger re-renders
  ```javascript
  const abortControllerRef = useRef(null);
  const fetchVehiclesRef = useRef(null);
  ```

### Effect Patterns
- **Cleanup Functions**: Always return cleanup in effects with side effects (5/5 files)
  ```javascript
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dependencies]);
  ```
- **Abort Controllers**: Use for cancellable async operations (seen in useVehicleApi)
  ```javascript
  abortControllerRef.current = new AbortController();
  await api.call(data, abortControllerRef.current.signal);
  ```

### Callback Optimization
- **useCallback**: Wrap functions that are passed as dependencies or props (4/5 files)
  ```javascript
  const fetchVehicles = useCallback(async (reset = false) => {
    // logic
  }, [lastKey, hasMore]);
  ```
- **Dependency Arrays**: Always specify accurate dependencies

### Conditional Rendering
- **Early Returns**: For loading and error states (5/5 files)
  ```javascript
  if (loading) return <LoadingSpinner />;
  if (!data) return null;
  ```
- **Ternary Operators**: For inline conditional rendering
  ```javascript
  {isFavorited ? <FilledHeart /> : <OutlineHeart />}
  ```
- **Logical AND**: For conditional display
  ```javascript
  {vehicle.status === 'available' && <Badge>Available</Badge>}
  ```

## API Integration Patterns

### Service Layer Architecture
- **Centralized Services**: All API calls go through service layer (vehicleApi, authService)
- **Error Handling**: Catch errors in service layer and custom hooks
- **Toast Notifications**: User feedback for all async operations (5/5 files use react-hot-toast)
  ```javascript
  toast.success('Vehicle created successfully!');
  toast.error(`Failed to fetch: ${err.message}`);
  ```

### Async/Await Pattern
- **Consistent Usage**: All async operations use async/await (5/5 files)
- **Try-Catch-Finally**: Standard error handling pattern
  ```javascript
  try {
    const data = await api.call();
    setState(data);
  } catch (error) {
    setError(error.message);
    toast.error(`Failed: ${error.message}`);
  } finally {
    setLoading(false);
  }
  ```

### Promise-Based Services
- **Authentication**: Wrap callback-based APIs in Promises (authService pattern)
  ```javascript
  signIn: (email, password) => {
    return new Promise((resolve, reject) => {
      cognitoUser.authenticateUser(authDetails, {
        onSuccess: (result) => resolve(result),
        onFailure: (err) => reject(err)
      });
    });
  }
  ```

## AWS Integration Standards

### Lambda Function Structure
- **Headers**: Always include CORS headers (seen in backend-examples)
  ```javascript
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
  };
  ```
- **OPTIONS Handling**: Handle preflight requests
  ```javascript
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }
  ```
- **Logging**: Console.log for CloudWatch monitoring
  ```javascript
  console.log('Function invoked with:', event.queryStringParameters);
  ```

### DynamoDB Patterns
- **Document Client**: Use DynamoDBDocumentClient for simplified operations
  ```javascript
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);
  ```
- **Expression Builders**: Build FilterExpression dynamically
  ```javascript
  const filterParts = [];
  const expressionNames = {};
  const expressionValues = {};
  // Build expressions conditionally
  ```
- **Pagination**: Handle LastEvaluatedKey for large datasets
  ```javascript
  do {
    const result = await docClient.send(new ScanCommand(scanCmd));
    allItems = allItems.concat(result.Items || []);
    lastKey = result.LastEvaluatedKey;
  } while (lastKey);
  ```

### Cognito Integration
- **User Pool Configuration**: Environment-based configuration
  ```javascript
  const poolData = {
    UserPoolId: process.env.REACT_APP_USER_POOL_ID,
    ClientId: process.env.REACT_APP_CLIENT_ID
  };
  ```
- **Token Management**: Extract and store JWT tokens
  ```javascript
  accessToken: result.getAccessToken().getJwtToken(),
  idToken: result.getIdToken().getJwtToken()
  ```

## Routing Patterns

### Route Protection
- **Protected Route Component**: Wrapper for authenticated routes (seen in App.js)
  ```javascript
  function ProtectedRoute({ children, adminOnly }) {
    const { user, loading } = useAuth();
    if (loading) return <LoadingSpinner />;
    if (!user) return <Navigate to="/login" />;
    if (adminOnly && !isAdmin) return <Navigate to="/" />;
    return children;
  }
  ```
- **Role-Based Access**: Check user groups for admin routes
  ```javascript
  const groups = user.signInUserSession?.accessToken?.payload['cognito:groups'] || [];
  const isAdmin = groups.includes('admin');
  ```

### Navigation Patterns
- **useNavigate Hook**: For programmatic navigation
  ```javascript
  const navigate = useNavigate();
  navigate('/'); // Redirect
  ```
- **useParams Hook**: Extract route parameters
  ```javascript
  const { id } = useParams();
  ```

## UI/UX Patterns

### Loading States
- **Spinner Component**: Consistent loading indicator (5/5 files)
  ```javascript
  <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
  ```
- **Loading Flags**: Boolean state for async operations
  ```javascript
  const [loading, setLoading] = useState(false);
  ```

### Styling Conventions
- **Tailwind Classes**: Utility-first approach (5/5 files)
- **Responsive Design**: Mobile-first with breakpoints (sm:, md:, lg:)
  ```javascript
  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
  ```
- **Color Palette**: Consistent brand colors
  - Primary: `brand-500`, `brand-600` (cyan/blue)
  - Success: `green-500`
  - Error: `red-500`
  - Warning: `yellow-500`
- **Glass Morphism**: Custom glass-panel class for modern UI
  ```javascript
  className="glass-panel px-4 py-2 rounded-full"
  ```

### Interactive Elements
- **Hover Effects**: Transform and scale transitions
  ```javascript
  className="hover:scale-105 transition-all duration-300"
  ```
- **Active States**: Visual feedback for clicks
  ```javascript
  className="active:scale-95"
  ```
- **Animations**: CSS animations for smooth transitions
  ```javascript
  className="animate-fade-in"
  ```

### Accessibility
- **Semantic HTML**: Use appropriate elements (button, nav, main)
- **ARIA Labels**: Add for screen readers where needed
- **Keyboard Navigation**: Support arrow keys and escape (seen in VehicleDetail lightbox)
  ```javascript
  if (e.key === 'Escape') setLightboxOpen(false);
  if (e.key === 'ArrowRight') nextImage();
  ```

## Error Handling

### Error State Management
- **Error State**: Track errors in component state
  ```javascript
  const [error, setError] = useState(null);
  ```
- **Error Display**: Show user-friendly messages
- **Error Boundary**: Wrap app in ErrorBoundary component (App.js)

### Error Recovery
- **Retry Logic**: Allow users to retry failed operations
- **Fallback UI**: Show alternative content on error
- **Navigation on Error**: Redirect on critical errors
  ```javascript
  catch (error) {
    toast.error('Failed to load vehicle');
    navigate('/');
  }
  ```

## Performance Optimization

### Memoization
- **useCallback**: Prevent unnecessary function recreations (4/5 files)
- **Ref Storage**: Store functions in refs to avoid dependency issues
  ```javascript
  fetchVehiclesRef.current = fetchVehicles;
  ```

### Image Optimization
- **Lazy Loading**: Load images on demand
- **Aspect Ratio**: Use aspect-ratio classes for consistent sizing
  ```javascript
  className="aspect-video"
  ```
- **Object Fit**: Control image scaling
  ```javascript
  className="object-cover"
  ```

### Code Splitting
- **Dynamic Imports**: Use React.lazy for route-based splitting
- **Lazy Loading**: Load components on demand

## Testing Considerations

### Component Testing
- **Isolated Components**: Design components to be testable in isolation
- **Props Interface**: Clear prop types and defaults
- **Pure Functions**: Extract business logic into testable functions

### API Mocking
- **Service Layer**: Easy to mock for testing
- **Dependency Injection**: Pass services as props or context when needed

## Documentation Standards

### Code Comments
- **Minimal Comments**: Code should be self-documenting
- **Complex Logic**: Comment only when logic is non-obvious
- **TODO Comments**: Mark incomplete features
  ```javascript
  // Note: DynamoDB FilterExpression doesn't support OR
  ```

### JSDoc (When Used)
- **Function Documentation**: Document complex functions
- **Parameter Types**: Specify expected types
- **Return Values**: Document what functions return

## Security Best Practices

### Environment Variables
- **Sensitive Data**: Never hardcode credentials
- **REACT_APP Prefix**: Required for Create React App
  ```javascript
  process.env.REACT_APP_API_URL
  ```

### Authentication
- **Token Storage**: Store tokens securely
- **Session Validation**: Check session validity before operations
  ```javascript
  if (!session.isValid()) resolve(null);
  ```

### CORS Configuration
- **Explicit Headers**: Set CORS headers on all API responses
- **Method Restrictions**: Specify allowed HTTP methods

## Common Idioms

### Null Safety
- **Optional Chaining**: Safely access nested properties
  ```javascript
  vehicle?.images || []
  user?.signInUserSession?.accessToken?.payload
  ```
- **Nullish Coalescing**: Provide defaults
  ```javascript
  const price = vehicle?.price || 142500;
  ```

### Array Operations
- **Map for Transformation**: Transform arrays to JSX
  ```javascript
  {items.map((item, idx) => <Component key={idx} {...item} />)}
  ```
- **Filter for Conditional**: Filter arrays based on conditions
  ```javascript
  allItems.filter(item => item.make.toLowerCase().includes(search))
  ```
- **Spread for Immutability**: Update state immutably
  ```javascript
  setVehicles(prev => [...prev, newVehicle])
  ```

### Event Handling
- **Event Propagation**: Stop propagation when needed
  ```javascript
  onClick={(e) => { e.stopPropagation(); handleClick(); }}
  ```
- **Prevent Default**: Prevent default browser behavior
  ```javascript
  onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}
  ```

## Build and Deployment

### Environment Configuration
- **Multiple Environments**: Use .env files for different environments
- **.env.example**: Provide template for required variables
- **Build-time Variables**: REACT_APP_ prefix for client-side variables

### Deployment Scripts
- **Shell Scripts**: Automate deployment tasks
  ```bash
  ./deploy-stack.sh    # CloudFormation deployment
  ./deploy-to-s3.sh    # S3 deployment
  ```

### Infrastructure as Code
- **CloudFormation**: Define AWS resources in YAML
- **Version Control**: Track infrastructure changes in Git
