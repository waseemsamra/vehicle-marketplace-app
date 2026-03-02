# Customer Management React Application

A modern React application converted from HTML template with full API integration for customer management.

## Features

- **Modern UI**: Converted from premium HTML template with Tailwind CSS
- **API Integration**: Full CRUD operations with AWS API Gateway + Lambda + DynamoDB
- **Custom Hooks**: useCustomers hook for state management
- **Responsive Design**: Mobile-first approach with glass morphism effects
- **Real-time Updates**: Automatic UI updates after API operations

## Project Structure

```
src/
├── components/
│   ├── Navbar.js           # Navigation component
│   ├── Hero.js             # Hero section with search
│   ├── CustomerList.js     # Customer listing with CRUD
│   ├── CustomerCard.js     # Individual customer card
│   ├── CustomerModal.js    # Create/Edit modal
│   └── Footer.js           # Footer component
├── services/
│   └── customerService.js  # API service layer
├── hooks/
│   └── useCustomers.js     # Custom hook for customer data
├── config/
│   └── api.js              # API configuration
├── App.js                  # Main app component
├── App.css                 # Custom styles
└── index.js                # Entry point
```

## API Endpoints

The application integrates with the following endpoints:

- `GET /customers` - Fetch all customers
- `GET /customers/{id}` - Fetch single customer
- `POST /customers` - Create new customer
- `PUT /customers/{id}` - Update customer
- `DELETE /customers/{id}` - Delete customer

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Install Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Update the API URL:

```
REACT_APP_API_URL=https://your-api-gateway-url.amazonaws.com/prod
```

### 4. Run Development Server

```bash
npm start
```

The app will open at [http://localhost:3000](http://localhost:3000)

### 5. Build for Production

```bash
npm run build
```

## API Service Layer

The `customerService.js` provides clean API methods:

```javascript
import { customerService } from './services/customerService';

// Get all customers
const customers = await customerService.getAll();

// Get single customer
const customer = await customerService.getById(id);

// Create customer
const newCustomer = await customerService.create({ name, email, phone });

// Update customer
const updated = await customerService.update(id, { name, email, phone });

// Delete customer
await customerService.delete(id);
```

## Custom Hook Usage

The `useCustomers` hook simplifies state management:

```javascript
import { useCustomers } from './hooks/useCustomers';

function MyComponent() {
  const { 
    customers, 
    loading, 
    error, 
    createCustomer, 
    updateCustomer, 
    deleteCustomer 
  } = useCustomers();

  // Use the data and methods
}
```

## Component Overview

### CustomerList
- Displays all customers in a grid layout
- Handles create, update, delete operations
- Shows loading and error states

### CustomerCard
- Individual customer display card
- Edit and delete buttons
- Hover effects and animations

### CustomerModal
- Form for creating/editing customers
- Validation and error handling
- Smooth animations

## Styling

The application uses:
- **Tailwind CSS**: Utility-first CSS framework
- **Custom CSS**: Glass morphism, gradients, animations
- **Google Fonts**: Inter and Space Grotesk

## AWS Integration Notes

### CORS Configuration
Ensure your API Gateway has CORS enabled:

```json
{
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
}
```

### Lambda Response Format

Your Lambda functions should return:

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

### DynamoDB Table Schema

Recommended customer table structure:

```
{
  id: String (Primary Key),
  name: String,
  email: String,
  phone: String,
  status: String,
  createdAt: Number,
  updatedAt: Number
}
```

## Deployment

### Deploy to AWS Amplify

```bash
npm install -g @aws-amplify/cli
amplify init
amplify add hosting
amplify publish
```

### Deploy to S3 + CloudFront

```bash
npm run build
aws s3 sync build/ s3://your-bucket-name
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

## Error Handling

The application includes comprehensive error handling:
- Network errors
- API errors
- Validation errors
- Loading states

## Performance Optimizations

- Lazy loading components
- Optimized re-renders with React hooks
- CSS animations with GPU acceleration
- Image optimization

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT
