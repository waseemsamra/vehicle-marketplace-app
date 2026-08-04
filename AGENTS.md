# Vehicle Marketplace App - Agent Instructions

## Project Overview

A React-based vehicle marketplace application with AWS Amplify/Cognito integration, Tailwind CSS, and a Node.js backend with MongoDB. Includes an MCP server for vehicle data access.

## Project Structure

```
vehicle-marketplace-app/
├── src/                    # React frontend
│   ├── components/         # UI components
│   ├── pages/              # Page components
│   ├── services/           # API service layer (vehicleApi.js)
│   ├── hooks/              # Custom React hooks
│   ├── config/             # App configuration
│   ├── data/               # Mock data (vehicles.js)
│   └── models/             # Data models
├── backend/                # Express + MongoDB backend
│   ├── server.js           # Main API server
│   ├── seed.js             # Database seeding
│   ├── models/             # Mongoose models
│   └── .env                # Environment config
├── mcp-server/             # MCP server for vehicle tools
│   └── src/index.js        # MCP tool definitions
├── bot/                    # Unified bot (MCP + MongoDB)
│   ├── package.json
│   └── src/
│       ├── index.js        # CLI entry point
│       ├── bot.js          # Unified bot logic
│       ├── mcpClient.js    # MCP server client
│       └── mongoClient.js  # MongoDB client
└── AGENTS.md               # This file
```

## Key Fixes Applied

### 1. `vehicleApi.search` parameter mismatch (`src/services/vehicleApi.js:113`)
- **Bug**: Sent `search` as query param, but backend expects `keyword`
- **Fix**: Changed `params: { search: query }` to `params: { keyword: query }`

### 2. MCP `search_vehicles` parameter mismatch (`mcp-server/src/index.js:206`)
- **Bug**: Sent `q` as query param, but backend expects `keyword`
- **Fix**: Changed `new URLSearchParams({ q: args.q })` to `new URLSearchParams({ keyword: args.q })`

## Bot Usage

The unified bot can talk to both the MCP server and MongoDB directly.

### CLI Commands
```bash
cd bot && npm start

# Interactive mode
npm start

# List vehicles
node src/index.js list
node src/index.js list --make=Toyota

# Search vehicles
node src/index.js search Toyota

# Get single vehicle
node src/index.js get 1

# List makes and models
node src/index.js makes
node src/index.js models Toyota

# CRUD operations (admin token required for write ops)
node src/index.js add '{"make":"Toyota","model":"Camry","year":2024,"price":30000}' <token>
node src/index.js update 1 '{"price":28000}' <token>
node src/index.js delete 1 <token>

# MongoDB aggregation
node src/index.js aggregate '[{"$match":{"make":"Toyota"}},{"$group":{"_id":"$model","count":{"$sum":1}}}]'
```

### Programmatic Usage
```javascript
import VehicleBot from './bot.js';

const bot = new VehicleBot();
await bot.init();

// List Toyota vehicles
const result = await bot.listVehicles({ make: 'Toyota', limit: 20 });

// Search
const results = await bot.searchVehicles('Toyota');

// Get makes/models
const makes = await bot.getMakes();
const models = await bot.getModels('Toyota');
```

## Architecture Notes

- The bot uses a fallback strategy: tries MCP first, then MongoDB directly
- The MCP server communicates via stdio with the backend Express API
- The backend uses MongoDB with Mongoose ODM
- The frontend React app uses `vehicleApi.js` for all API calls
- The `list_vehicles` MCP tool supports filters: make, model, minPrice, maxPrice, minYear, maxYear, fuelType, transmission, bodyType, keyword, status, limit, offset