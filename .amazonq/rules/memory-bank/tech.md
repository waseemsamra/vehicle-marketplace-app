# Technology Stack

## Programming Languages
- **JavaScript (ES6+)**: Primary language for frontend and backend
- **JSX**: React component syntax
- **CSS**: Styling with Tailwind utilities and custom styles

## Frontend Framework & Libraries

### Core Framework
- **React 19.2.4**: Latest React with concurrent features
- **React DOM 19.2.4**: React rendering library
- **React Router DOM 7.13.1**: Client-side routing

### UI & Styling
- **Tailwind CSS 3.4.1**: Utility-first CSS framework
- **PostCSS 8.4.35**: CSS processing and transformations
- **Autoprefixer 10.4.17**: Automatic vendor prefixing
- **Custom CSS**: Glass morphism effects, gradients, animations

### State Management & Data Fetching
- **Custom Hooks**: useVehicleApi, useCustomers, useAuth
- **Axios 1.13.6**: HTTP client for API requests
- **React Hot Toast 2.6.0**: Toast notifications

### AWS Integration
- **AWS Amplify 6.16.2**: AWS services integration framework
- **@aws-amplify/ui-react 6.15.1**: Pre-built Amplify UI components
- **amazon-cognito-identity-js 6.3.16**: Cognito authentication
- **@aws-sdk/client-dynamodb 3.1000.0**: DynamoDB client
- **@aws-sdk/lib-dynamodb 3.1000.0**: DynamoDB document client

## Build System & Development Tools

### Build Tools
- **React Scripts 5.0.1**: Create React App build configuration
- **Webpack**: Bundled with React Scripts
- **Babel**: JavaScript transpilation (via React Scripts)

### Development Server
- **Webpack Dev Server**: Hot module replacement (HMR)
- **Port**: 3000 (default)

## Backend Technologies

### AWS Services
- **API Gateway**: RESTful API endpoints
- **Lambda**: Serverless compute functions (Node.js runtime)
- **DynamoDB**: NoSQL database for data storage
- **Cognito**: User authentication and authorization
- **S3**: Static website hosting and file storage
- **CloudFront**: CDN for content delivery
- **CloudFormation**: Infrastructure as code

### Lambda Runtime
- **Node.js**: Backend Lambda functions
- **AWS SDK**: DynamoDB and service integrations

## Development Commands

### Installation
```bash
npm install                    # Install all dependencies
```

### Development
```bash
npm start                      # Start development server (localhost:3000)
npm test                       # Run test suite
```

### Production Build
```bash
npm run build                  # Create optimized production build
```

### Deployment
```bash
./deploy-stack.sh              # Deploy CloudFormation stack
./deploy-to-s3.sh              # Deploy to S3 bucket
./get-pool-id.sh               # Retrieve Cognito pool ID
```

### Scripts
```bash
node scripts/add-vehicle-images.js  # Add vehicle images to database
```

## Configuration Files

### Package Management
- **package.json**: Dependencies, scripts, and project metadata
- **package-lock.json**: Locked dependency versions

### Build Configuration
- **tailwind.config.js**: Tailwind CSS customization
- **postcss.config.js**: PostCSS plugins configuration

### AWS Configuration
- **cloudformation-template.yaml**: Infrastructure definition
- **src/aws-exports.js**: Amplify configuration export
- **src/config/amplify.js**: Amplify initialization
- **src/config/api.js**: API endpoints configuration

### Environment
- **.env**: Environment variables (not in version control)
- **.env.example**: Environment template
  - `REACT_APP_API_URL`: API Gateway base URL
  - `REACT_APP_AWS_REGION`: AWS region
  - `REACT_APP_USER_POOL_ID`: Cognito user pool ID
  - `REACT_APP_USER_POOL_CLIENT_ID`: Cognito app client ID

## Browser Support

### Production
- Modern browsers with >0.2% market share
- Excludes dead browsers and Opera Mini

### Development
- Latest Chrome
- Latest Firefox
- Latest Safari

## Code Quality & Linting
- **ESLint**: Configured via React Scripts (react-app preset)
- **Browserslist**: Target browser configuration

## API Communication

### HTTP Client
- **Axios**: Promise-based HTTP requests
- **Base URL**: Configured via environment variables
- **Headers**: Content-Type, Authorization (JWT)
- **Error Handling**: Centralized in service layer

### API Response Format
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

## Database Schema

### DynamoDB Tables
- **Customers Table**: id (PK), name, email, phone, status, createdAt, updatedAt
- **Vehicles Table**: id (PK), make, model, year, price, images, sellerId, metadata

## Performance Optimizations
- Lazy loading components with React.lazy
- Code splitting via dynamic imports
- Optimized re-renders with React hooks (useMemo, useCallback)
- CSS animations with GPU acceleration
- Image optimization and lazy loading

## Security Features
- JWT token-based authentication
- AWS Cognito user pools
- CORS configuration on API Gateway
- Environment variable protection
- Secure HTTP-only cookies (where applicable)
