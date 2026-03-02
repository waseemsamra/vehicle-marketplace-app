# Project Structure

## Directory Organization

```
vehicle-marketplace-app/
├── backend-examples/          # Lambda function examples and backend code
│   ├── vehicles-get-optimized-lambda.js
│   ├── vehicles-metadata-lambda.js
│   └── vehicles-search-simple.js
├── public/                    # Static assets
│   ├── favicon.ico
│   └── index.html
├── scripts/                   # Utility scripts
│   └── add-vehicle-images.js
├── src/                       # Main application source
│   ├── components/            # React components
│   ├── config/                # Configuration files
│   ├── examples/              # Usage examples
│   ├── hooks/                 # Custom React hooks
│   ├── pages/                 # Page-level components
│   ├── services/              # API service layer
│   ├── App.js                 # Root application component
│   ├── App.css                # Application styles
│   ├── aws-exports.js         # AWS Amplify configuration
│   ├── index.js               # Application entry point
│   └── index.css              # Global styles
├── .env                       # Environment variables
├── .env.example               # Environment template
├── cloudformation-template.yaml  # AWS infrastructure as code
├── deploy-stack.sh            # CloudFormation deployment script
├── deploy-to-s3.sh            # S3 deployment script
├── package.json               # Dependencies and scripts
├── tailwind.config.js         # Tailwind CSS configuration
└── postcss.config.js          # PostCSS configuration
```

## Core Components

### Components Directory (`src/components/`)
- **Navbar.js**: Main navigation with routing and authentication state
- **Hero.js**: Landing page hero section with search functionality
- **Footer.js**: Application footer with links and information
- **VehicleList.js**: Grid display of vehicle listings
- **VehicleCard.js**: Individual vehicle card with image and details
- **VehicleFilters.js**: Filter controls for vehicle search
- **PopularCategories.js**: Category navigation component
- **CustomerList.js**: Customer management grid view
- **CustomerCard.js**: Individual customer display card
- **CustomerModal.js**: Create/edit customer form modal
- **CustomerManagement.js**: Customer CRUD operations container
- **Login.js**: Authentication form component
- **ImageUpload.js**: Image upload and management component
- **MonitoringDashboard.js**: Performance and analytics dashboard
- **ErrorBoundary.js**: Error handling wrapper component
- **admin/**: Admin-specific components (subdirectory)

### Pages Directory (`src/pages/`)
- **Home.js**: Main landing page with hero and featured vehicles
- **Listings.js**: Vehicle listings page with filters and search
- **VehicleDetail.js**: Detailed vehicle information page
- **admin/**: Admin dashboard pages (subdirectory)

### Hooks Directory (`src/hooks/`)
- **useVehicleApi.js**: Vehicle data fetching and management
- **useCustomers.js**: Customer CRUD operations and state
- **useAuth.js**: Authentication state and operations

### Services Directory (`src/services/`)
- **vehicleApi.js**: Vehicle API endpoints and methods
- **buyerApi.js**: Buyer-specific API operations
- **sellerApi.js**: Seller-specific API operations
- **customerService.js**: Customer management API layer
- **authService.js**: Authentication and authorization services
- **monitoring.js**: Logging and performance monitoring

### Configuration Directory (`src/config/`)
- **api.js**: API base URLs and configuration
- **amplify.js**: AWS Amplify setup and configuration

## Architectural Patterns

### Component Architecture
- **Presentational Components**: Pure UI components (VehicleCard, CustomerCard)
- **Container Components**: Logic and state management (CustomerList, VehicleList)
- **Page Components**: Route-level components with full page layouts
- **Higher-Order Components**: ErrorBoundary for error handling

### State Management Pattern
- Custom hooks for domain-specific state (useVehicleApi, useCustomers, useAuth)
- Local component state with useState for UI state
- Service layer for API communication and data transformation
- No global state management library (Redux/MobX) - hooks-based approach

### Service Layer Pattern
```
Component → Custom Hook → Service Layer → API
```
- Components consume custom hooks
- Hooks manage state and call service methods
- Services handle HTTP requests and error handling
- Clean separation of concerns

### Routing Structure
- React Router DOM for client-side routing
- Protected routes with authentication checks
- Nested routes for admin sections
- Dynamic routes for detail pages (e.g., /vehicle/:id)

### API Integration Pattern
- Axios-based HTTP client
- Centralized error handling
- Request/response interceptors
- Environment-based API URL configuration

### AWS Integration Architecture
```
React App → API Gateway → Lambda Functions → DynamoDB
           ↓
        Cognito (Auth)
           ↓
        S3 (Hosting)
```

## File Relationships

### Data Flow
1. **User Interaction** → Component
2. **Component** → Custom Hook (useVehicleApi, useCustomers)
3. **Custom Hook** → Service Layer (vehicleApi.js, customerService.js)
4. **Service Layer** → AWS API Gateway
5. **API Gateway** → Lambda Functions
6. **Lambda** → DynamoDB

### Authentication Flow
1. Login Component → authService.js
2. authService.js → AWS Cognito
3. Cognito → JWT Token
4. Token stored in useAuth hook
5. Protected routes check auth state

### Component Composition
- App.js imports page components
- Pages import feature components
- Feature components import presentational components
- All components can use custom hooks
- Services are imported by hooks, not directly by components

## Backend Examples
The `backend-examples/` directory contains Lambda function templates:
- **vehicles-get-optimized-lambda.js**: Optimized vehicle retrieval with caching
- **vehicles-metadata-lambda.js**: Vehicle metadata and statistics
- **vehicles-search-simple.js**: Basic vehicle search implementation

These serve as reference implementations for the AWS Lambda backend.
