import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const API_URL = process.env.REACT_APP_API_URL || process.env.VEHICLE_API_URL || 'http://localhost:5001/api';

async function apiGet(path, token) {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { headers });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json();
}

async function apiPost(path, body, token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json();
}

async function apiDelete(path, token) {
  const headers = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { method: 'DELETE', headers });
  if (!res.ok) throw new Error(`API error ${res.status}: ${await res.text()}`);
  return res.json();
}

const server = new Server(
  { name: 'vehicle-marketplace-mcp', version: '1.0.0' },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: 'list_vehicles',
      description: 'List vehicles from the inventory with optional filters. USE THIS TOOL when the user asks to see, browse, or list vehicles. Examples: "show me all Toyota cars", "list available SUVs", "show vehicles under $50,000", "I want to see all cars". Supports filters: make, model, minPrice, maxPrice, minYear, maxYear, fuelType, transmission, bodyType, keyword, status, limit, offset.',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', description: 'Max items to return (default 20, max 100)' },
          offset: { type: 'number', description: 'Items to skip (default 0)' },
          make: { type: 'string', description: 'Filter by make/brand name (e.g., "Toyota", "BMW", "Audi")' },
          model: { type: 'string', description: 'Filter by model name (e.g., "Camry", "X5")' },
          minPrice: { type: 'number', description: 'Minimum price filter' },
          maxPrice: { type: 'number', description: 'Maximum price filter' },
          minYear: { type: 'number', description: 'Minimum year filter' },
          maxYear: { type: 'number', description: 'Maximum year filter' },
          fuelType: { type: 'string', description: 'Filter by fuel type (e.g., "Gasoline", "Diesel", "Electric", "Hybrid")' },
          transmission: { type: 'string', description: 'Filter by transmission (e.g., "Automatic", "Manual")' },
          bodyType: { type: 'string', description: 'Filter by body type (e.g., "SUV", "Sedan", "Hatchback")' },
          keyword: { type: 'string', description: 'Search keyword across make, model, title, and description' },
          status: { type: 'string', description: 'Filter by status (available, sold, pending)' },
        },
      },
    },
    {
      name: 'get_vehicle',
      description: 'Get a single vehicle by ID. USE THIS TOOL when the user asks about a specific vehicle, wants details for a particular car, or mentions a vehicle ID. Example: "show me details for vehicle 123", "tell me about the Toyota Camry", "what is the price of car ABC". Requires vehicleId parameter.',
      inputSchema: {
        type: 'object',
        properties: {
          vehicleId: { type: 'string', description: 'Vehicle ID to retrieve details for' },
        },
        required: ['vehicleId'],
      },
    },
    {
      name: 'search_vehicles',
      description: 'Search vehicles by keyword with optional filters. USE THIS TOOL for keyword-based searches across all vehicle data. Examples: "find red BMW", "search for electric cars", "looking for a cheap SUV". The q parameter is the main search query.',
      inputSchema: {
        type: 'object',
        properties: {
          q: { type: 'string', description: 'Search query (e.g., "red BMW", "electric SUV", "cheap sedan")' },
          limit: { type: 'number', description: 'Max items to return' },
          make: { type: 'string', description: 'Filter by make' },
          model: { type: 'string', description: 'Filter by model' },
          maxPrice: { type: 'number', description: 'Maximum price filter' },
        },
        required: ['q'],
      },
    },
    {
      name: 'get_makes',
      description: 'Get all available vehicle makes/brands. USE THIS TOOL when the user asks "what makes do you have?", "show me all brands", "list all manufacturers", or wants to see available car brands. No parameters required.',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'get_models',
      description: 'Get all available vehicle models, optionally filtered by make. USE THIS TOOL when the user asks about models for a specific brand. Examples: "what Toyota models do you have?", "show me BMW models", "list Audi models". Pass the make parameter to filter by brand.',
      inputSchema: {
        type: 'object',
        properties: {
          make: { type: 'string', description: 'Filter models by make/brand name (e.g., "Toyota", "BMW", "Audi")' },
        },
      },
    },
    {
      name: 'create_vehicle',
      description: 'Create a new vehicle listing (admin only). USE THIS TOOL only when the user explicitly asks to add or create a new vehicle listing and provides an admin JWT token. Requires token, make, model, year, and price at minimum.',
      inputSchema: {
        type: 'object',
        properties: {
          token: { type: 'string', description: 'Admin JWT token for authentication' },
          make: { type: 'string' },
          model: { type: 'string' },
          year: { type: 'number' },
          price: { type: 'number' },
          mileage: { type: 'number' },
          condition: { type: 'string', enum: ['new', 'used', 'certified'] },
          fuelType: { type: 'string' },
          transmission: { type: 'string' },
          color: { type: 'string' },
          description: { type: 'string' },
          images: { type: 'array', items: { type: 'string' } },
          status: { type: 'string', enum: ['available', 'sold', 'pending'] },
          bodyType: { type: 'string' },
          engineType: { type: 'string' },
          engineCapacity: { type: 'string' },
        },
        required: ['token', 'make', 'model', 'year', 'price'],
      },
    },
    {
      name: 'update_vehicle',
      description: 'Update an existing vehicle listing (admin only). USE THIS TOOL only when the user explicitly asks to update or edit a vehicle and provides an admin JWT token and vehicle ID.',
      inputSchema: {
        type: 'object',
        properties: {
          token: { type: 'string', description: 'Admin JWT token for authentication' },
          vehicleId: { type: 'string', description: 'Vehicle ID to update' },
          make: { type: 'string' },
          model: { type: 'string' },
          year: { type: 'number' },
          price: { type: 'number' },
          mileage: { type: 'number' },
          condition: { type: 'string' },
          fuelType: { type: 'string' },
          transmission: { type: 'string' },
          color: { type: 'string' },
          description: { type: 'string' },
          images: { type: 'array', items: { type: 'string' } },
          status: { type: 'string' },
          bodyType: { type: 'string' },
          engineType: { type: 'string' },
          engineCapacity: { type: 'string' },
        },
        required: ['token', 'vehicleId'],
      },
    },
    {
      name: 'delete_vehicle',
      description: 'Delete a vehicle listing (admin only). USE THIS TOOL only when the user explicitly asks to delete or remove a vehicle and provides an admin JWT token and vehicle ID.',
      inputSchema: {
        type: 'object',
        properties: {
          token: { type: 'string', description: 'Admin JWT token for authentication' },
          vehicleId: { type: 'string', description: 'Vehicle ID to delete' },
        },
        required: ['token', 'vehicleId'],
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case 'list_vehicles': {
        const params = new URLSearchParams();
        if (args.limit) params.set('limit', String(args.limit));
        if (args.offset) params.set('offset', String(args.offset));
        if (args.make) params.set('make', args.make);
        if (args.model) params.set('model', args.model);
        if (args.minPrice) params.set('minPrice', String(args.minPrice));
        if (args.maxPrice) params.set('maxPrice', String(args.maxPrice));
        if (args.minYear) params.set('minYear', String(args.minYear));
        if (args.maxYear) params.set('maxYear', String(args.maxYear));
        if (args.fuelType) params.set('fuelType', args.fuelType);
        if (args.transmission) params.set('transmission', args.transmission);
        if (args.bodyType) params.set('bodyType', args.bodyType);
        if (args.keyword) params.set('keyword', args.keyword);
        if (args.status) params.set('status', args.status);
        const data = await apiGet(`/vehicles?${params.toString()}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      case 'get_vehicle': {
        const data = await apiGet(`/vehicles/${args.vehicleId}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      case 'search_vehicles': {
        const params = new URLSearchParams({ keyword: args.q });
        if (args.limit) params.set('limit', String(args.limit));
        if (args.make) params.set('make', args.make);
        if (args.model) params.set('model', args.model);
        if (args.maxPrice) params.set('maxPrice', String(args.maxPrice));
        const data = await apiGet(`/vehicles?${params.toString()}`);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      case 'get_makes': {
        const data = await apiGet('/makes');
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      case 'get_models': {
        const url = args.make ? `/models?make=${encodeURIComponent(args.make)}` : '/models';
        const data = await apiGet(url);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      case 'create_vehicle': {
        const body = { ...args };
        delete body.token;
        const data = await apiPost('/vehicles', body, args.token);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      case 'update_vehicle': {
        const body = { ...args };
        delete body.token;
        delete body.vehicleId;
        const data = await apiPost(`/vehicles/${args.vehicleId}`, body, args.token);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      case 'delete_vehicle': {
        const data = await apiDelete(`/vehicles/${args.vehicleId}`, args.token);
        return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (err) {
    return { content: [{ type: 'text', text: `Error: ${err.message}` }], isError: true };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Vehicle Marketplace MCP server running on stdio');
}

main().catch((err) => {
  console.error('Fatal error in MCP server:', err);
  process.exit(1);
});
