# Quick Start Guide

## Complete React Application with API Integration

This is a production-ready React application converted from your HTML template with full customer management API integration.

## 🚀 Quick Setup

### Step 1: Copy the Application

```bash
# Copy the entire customer-app folder to your desired location
cp -r /tmp/customer-app ~/my-projects/customer-app
cd ~/my-projects/customer-app
```

### Step 2: Configure API Endpoint

Create `.env` file:

```bash
echo "REACT_APP_API_URL=https://your-api-gateway-url.amazonaws.com/prod" > .env
```

Replace `your-api-gateway-url` with your actual API Gateway URL.

### Step 3: Install Dependencies (if needed)

```bash
npm install
```

### Step 4: Run the Application

```bash
npm start
```

Visit: http://localhost:3000

## 📁 What's Included

### Components
- **Navbar**: Fixed navigation with glass effect
- **Hero**: Search section with buy/sell tabs
- **CustomerList**: Main customer management interface
- **CustomerCard**: Individual customer display
- **CustomerModal**: Create/Edit form
- **Footer**: Site footer

### API Integration
- **customerService.js**: All API calls (GET, POST, PUT, DELETE)
- **useCustomers.js**: React hook for state management
- **api.js**: Configuration and endpoints

### Styling
- Tailwind CSS with custom configuration
- Glass morphism effects
- Smooth animations
- Responsive design

## 🔌 API Integration Details

### Expected API Response Format

**GET /customers**
```json
[
  {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "status": "ACTIVE"
  }
]
```

**POST /customers**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "status": "ACTIVE"
}
```

**PUT /customers/{id}**
```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "phone": "+1234567890",
  "status": "ACTIVE"
}
```

**DELETE /customers/{id}**
Returns: 200 OK

### Lambda Function Example

```javascript
// GET /customers
exports.handler = async (event) => {
  const params = {
    TableName: 'customers'
  };
  
  const result = await dynamodb.scan(params).promise();
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(result.Items)
  };
};
```

## 🎨 Customization

### Change Colors

Edit `tailwind.config.js`:

```javascript
colors: {
  brand: {
    500: '#YOUR_COLOR',
    600: '#YOUR_DARKER_COLOR',
  }
}
```

### Modify Customer Fields

Edit `CustomerModal.js` to add/remove fields:

```javascript
const [formData, setFormData] = useState({
  name: '',
  email: '',
  phone: '',
  // Add your custom fields here
  address: '',
  company: '',
});
```

## 📦 Build for Production

```bash
npm run build
```

Output will be in `build/` folder.

## 🚢 Deployment Options

### AWS Amplify
```bash
npm install -g @aws-amplify/cli
amplify init
amplify add hosting
amplify publish
```

### AWS S3 + CloudFront
```bash
npm run build
aws s3 sync build/ s3://your-bucket
```

### Vercel
```bash
npm install -g vercel
vercel
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod
```

## 🔧 Troubleshooting

### CORS Errors
Enable CORS in API Gateway:
- Access-Control-Allow-Origin: *
- Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS
- Access-Control-Allow-Headers: Content-Type

### API Not Responding
1. Check `.env` file has correct API URL
2. Verify API Gateway is deployed
3. Check Lambda function logs in CloudWatch

### Styling Issues
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

## 📝 Code Examples

### Using the Customer Hook

```javascript
import { useCustomers } from './hooks/useCustomers';

function MyComponent() {
  const { 
    customers,      // Array of customers
    loading,        // Boolean loading state
    error,          // Error message if any
    createCustomer, // Function to create
    updateCustomer, // Function to update
    deleteCustomer  // Function to delete
  } = useCustomers();

  const handleCreate = async () => {
    await createCustomer({
      name: 'Jane Doe',
      email: 'jane@example.com',
      phone: '+1234567890'
    });
  };

  return (
    <div>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {customers.map(c => <div key={c.id}>{c.name}</div>)}
    </div>
  );
}
```

### Direct API Service Usage

```javascript
import { customerService } from './services/customerService';

// Get all
const customers = await customerService.getAll();

// Get one
const customer = await customerService.getById('123');

// Create
const newCustomer = await customerService.create({
  name: 'John',
  email: 'john@example.com',
  phone: '+1234567890'
});

// Update
const updated = await customerService.update('123', {
  name: 'John Updated'
});

// Delete
await customerService.delete('123');
```

## 🎯 Features Implemented

✅ Full CRUD operations
✅ Real-time UI updates
✅ Error handling
✅ Loading states
✅ Responsive design
✅ Modal forms
✅ API service layer
✅ Custom React hooks
✅ Tailwind CSS styling
✅ Glass morphism effects
✅ Smooth animations
✅ Production-ready build

## 📞 Support

For issues or questions:
1. Check the README.md
2. Review API endpoint configuration
3. Check browser console for errors
4. Verify Lambda function logs

## 🔐 Security Notes

- Never commit `.env` file
- Use environment variables for API URLs
- Implement authentication if needed
- Validate input on both client and server
- Use HTTPS for production

## 📄 License

MIT
