import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

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
      description: 'List all vehicles with optional filters. Returns an array of vehicle objects.',
      inputSchema: {
        type: 'object',
        properties: {
          limit: { type: 'number', description: 'Max items to return (default 20)' },
          offset: { type: 'number', description: 'Items to skip (default 0)' },
          make: { type: 'string', description: 'Filter by make' },
          model: { type: 'string', description: 'Filter by model' },
          minPrice: { type: 'number', description: 'Minimum price' },
          maxPrice: { type: 'number', description: 'Maximum price' },
          minYear: { type: 'number', description: 'Minimum year' },
          maxYear: { type: 'number', description: 'Maximum year' },
          fuelType: { type: 'string', description: 'Filter by fuel type' },
          transmission: { type: 'string', description: 'Filter by transmission' },
          bodyType: { type: 'string', description: 'Filter by body type' },
          keyword: { type: 'string', description: 'Search keyword across make/model/title' },
          status: { type: 'string', description: 'Filter by status (available/sold/pending)' },
        },
      },
    },
    {
      name: 'get_vehicle',
      description: 'Get a single vehicle by ID.',
      inputSchema: {
        type: 'object',
        properties: {
          vehicleId: { type: 'string', description: 'Vehicle ID' },
        },
        required: ['vehicleId'],
      },
    },
    {
      name: 'search_vehicles',
      description: 'Search vehicles by keyword with optional filters.',
      inputSchema: {
        type: 'object',
        properties: {
          q: { type: 'string', description: 'Search query' },
          limit: { type: 'number', description: 'Max items to return' },
          make: { type: 'string' },
          model: { type: 'string' },
          maxPrice: { type: 'number' },
        },
        required: ['q'],
      },
    },
    {
      name: 'get_makes',
      description: 'Get all available vehicle makes.',
      inputSchema: { type: 'object', properties: {} },
    },
    {
      name: 'get_models',
      description: 'Get all available vehicle models, optionally filtered by make.',
      inputSchema: {
        type: 'object',
        properties: {
          make: { type: 'string', description: 'Filter models by make name' },
        },
      },
    },
    {
      name: 'create_vehicle',
      description: 'Create a new vehicle listing (admin).',
      inputSchema: {
        type: 'object',
        properties: {
          token: { type: 'string', description: 'Admin JWT token' },
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
      description: 'Update an existing vehicle (admin).',
      inputSchema: {
        type: 'object',
        properties: {
          token: { type: 'string', description: 'Admin JWT token' },
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
      description: 'Delete a vehicle listing (admin).',
      inputSchema: {
        type: 'object',
        properties: {
          token: { type: 'string', description: 'Admin JWT token' },
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
        const params = new URLSearchParams({ q: args.q });
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
