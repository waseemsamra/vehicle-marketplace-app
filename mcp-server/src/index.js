import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { SSEServerTransport } from '@modelcontextprotocol/sdk/server/sse.js';
import { createMcpExpressApp } from '@modelcontextprotocol/sdk/server/express.js';
import * as z from 'zod/v4';

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

const getServer = () => {
  const server = new McpServer({
    name: 'vehicle-marketplace-mcp',
    version: '1.0.0'
  }, { capabilities: { tools: {} } });

  server.registerTool('list_vehicles', {
    description: 'List vehicles from the inventory with optional filters. USE THIS TOOL when the user asks to see, browse, or list vehicles. Examples: "show me all Toyota cars", "list available SUVs", "show vehicles under $50,000", "I want to see all cars". Supports filters: make, model, minPrice, maxPrice, minYear, maxYear, fuelType, transmission, bodyType, keyword, status, limit, offset.',
    inputSchema: {
      limit: z.number().describe('Max items to return (default 20, max 100)').optional(),
      offset: z.number().describe('Items to skip (default 0)').optional(),
      make: z.string().describe('Filter by make/brand name (e.g., "Toyota", "BMW", "Audi")').optional(),
      model: z.string().describe('Filter by model name (e.g., "Camry", "X5")').optional(),
      minPrice: z.number().describe('Minimum price filter').optional(),
      maxPrice: z.number().describe('Maximum price filter').optional(),
      minYear: z.number().describe('Minimum year filter').optional(),
      maxYear: z.number().describe('Maximum year filter').optional(),
      fuelType: z.string().describe('Filter by fuel type (e.g., "Gasoline", "Diesel", "Electric", "Hybrid")').optional(),
      transmission: z.string().describe('Filter by transmission (e.g., "Automatic", "Manual")').optional(),
      bodyType: z.string().describe('Filter by body type (e.g., "SUV", "Sedan", "Hatchback")').optional(),
      keyword: z.string().describe('Search keyword across make, model, title, and description').optional(),
      status: z.string().describe('Filter by status (available, sold, pending)').optional(),
    },
  }, async ({ limit, offset, make, model, minPrice, maxPrice, minYear, maxYear, fuelType, transmission, bodyType, keyword, status }) => {
    const params = new URLSearchParams();
    if (limit) params.set('limit', String(limit));
    if (offset) params.set('offset', String(offset));
    if (make) params.set('make', make);
    if (model) params.set('model', model);
    if (minPrice) params.set('minPrice', String(minPrice));
    if (maxPrice) params.set('maxPrice', String(maxPrice));
    if (minYear) params.set('minYear', String(minYear));
    if (maxYear) params.set('maxYear', String(maxYear));
    if (fuelType) params.set('fuelType', fuelType);
    if (transmission) params.set('transmission', transmission);
    if (bodyType) params.set('bodyType', bodyType);
    if (keyword) params.set('keyword', keyword);
    if (status) params.set('status', status);
    const data = await apiGet(`/vehicles?${params.toString()}`);
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool('get_vehicle', {
    description: 'Get a single vehicle by ID. USE THIS TOOL when the user asks about a specific vehicle, wants details for a particular car, or mentions a vehicle ID. Example: "show me details for vehicle 123", "tell me about the Toyota Camry", "what is the price of car ABC". Requires vehicleId parameter.',
    inputSchema: {
      vehicleId: z.string().describe('Vehicle ID to retrieve details for'),
    },
  }, async ({ vehicleId }) => {
    const data = await apiGet(`/vehicles/${vehicleId}`);
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool('search_vehicles', {
    description: 'Search vehicles by keyword with optional filters. USE THIS TOOL for keyword-based searches across all vehicle data. Examples: "find red BMW", "search for electric cars", "looking for a cheap SUV". The q parameter is the main search query.',
    inputSchema: {
      q: z.string().describe('Search query (e.g., "red BMW", "electric SUV", "cheap sedan")'),
      limit: z.number().describe('Max items to return').optional(),
      make: z.string().describe('Filter by make').optional(),
      model: z.string().describe('Filter by model').optional(),
      maxPrice: z.number().describe('Maximum price filter').optional(),
    },
  }, async ({ q, limit, make, model, maxPrice }) => {
    const params = new URLSearchParams({ keyword: q });
    if (limit) params.set('limit', String(limit));
    if (make) params.set('make', make);
    if (model) params.set('model', model);
    if (maxPrice) params.set('maxPrice', String(maxPrice));
    const data = await apiGet(`/vehicles?${params.toString()}`);
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool('get_makes', {
    description: 'Get all available vehicle makes/brands. USE THIS TOOL when the user asks "what makes do you have?", "show me all brands", "list all manufacturers", or wants to see available car brands. No parameters required.',
    inputSchema: z.object({}),
  }, async () => {
    const data = await apiGet('/makes');
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool('get_models', {
    description: 'Get all available vehicle models, optionally filtered by make. USE THIS TOOL when the user asks about models for a specific brand. Examples: "what Toyota models do you have?", "show me BMW models", "list Audi models". Pass the make parameter to filter by brand.',
    inputSchema: {
      make: z.string().describe('Filter models by make/brand name (e.g., "Toyota", "BMW", "Audi")').optional(),
    },
  }, async ({ make }) => {
    const url = make ? `/models?make=${encodeURIComponent(make)}` : '/models';
    const data = await apiGet(url);
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool('create_vehicle', {
    description: 'Create a new vehicle listing (admin only). USE THIS TOOL only when the user explicitly asks to add or create a new vehicle listing and provides an admin JWT token. Requires token, make, model, year, and price at minimum.',
    inputSchema: {
      token: z.string().describe('Admin JWT token for authentication'),
      make: z.string(),
      model: z.string(),
      year: z.number(),
      price: z.number(),
      mileage: z.number().optional(),
      condition: z.enum(['new', 'used', 'certified']).optional(),
      fuelType: z.string().optional(),
      transmission: z.string().optional(),
      color: z.string().optional(),
      description: z.string().optional(),
      images: z.array(z.string()).optional(),
      status: z.enum(['available', 'sold', 'pending']).optional(),
      bodyType: z.string().optional(),
      engineType: z.string().optional(),
      engineCapacity: z.string().optional(),
    },
  }, async (args) => {
    const { token, ...body } = args;
    const data = await apiPost('/vehicles', body, token);
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool('update_vehicle', {
    description: 'Update an existing vehicle listing (admin only). USE THIS TOOL only when the user explicitly asks to update or edit a vehicle and provides an admin JWT token and vehicle ID.',
    inputSchema: {
      token: z.string().describe('Admin JWT token for authentication'),
      vehicleId: z.string().describe('Vehicle ID to update'),
      make: z.string().optional(),
      model: z.string().optional(),
      year: z.number().optional(),
      price: z.number().optional(),
      mileage: z.number().optional(),
      condition: z.string().optional(),
      fuelType: z.string().optional(),
      transmission: z.string().optional(),
      color: z.string().optional(),
      description: z.string().optional(),
      images: z.array(z.string()).optional(),
      status: z.string().optional(),
      bodyType: z.string().optional(),
      engineType: z.string().optional(),
      engineCapacity: z.string().optional(),
    },
  }, async (args) => {
    const { token, vehicleId, ...body } = args;
    const data = await apiPost(`/vehicles/${vehicleId}`, body, token);
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  });

  server.registerTool('delete_vehicle', {
    description: 'Delete a vehicle listing (admin only). USE THIS TOOL only when the user explicitly asks to delete or remove a vehicle and provides an admin JWT token and vehicle ID.',
    inputSchema: {
      token: z.string().describe('Admin JWT token for authentication'),
      vehicleId: z.string().describe('Vehicle ID to delete'),
    },
  }, async ({ token, vehicleId }) => {
    const data = await apiDelete(`/vehicles/${vehicleId}`, token);
    return { content: [{ type: 'text', text: JSON.stringify(data, null, 2) }] };
  });

  return server;
};

const app = createMcpExpressApp();

const transports = {};

app.get('/mcp', async (req, res) => {
  try {
    const transport = new SSEServerTransport('/messages', res);
    const sessionId = transport.sessionId;
    transports[sessionId] = transport;
    transport.onclose = () => {
      delete transports[sessionId];
    };
    const server = getServer();
    await server.connect(transport);
    console.log(`Established SSE stream with session ID: ${sessionId}`);
  } catch (error) {
    console.error('Error establishing SSE stream:', error);
    if (!res.headersSent) {
      res.status(500).send('Error establishing SSE stream');
    }
  }
});

app.post('/messages', async (req, res) => {
  const sessionId = req.query.sessionId;
  if (!sessionId) {
    res.status(400).send('Missing sessionId parameter');
    return;
  }
  const transport = transports[sessionId];
  if (!transport) {
    res.status(404).send('Session not found');
    return;
  }
  try {
    await transport.handlePostMessage(req, res, req.body);
  } catch (error) {
    console.error('Error handling request:', error);
    if (!res.headersSent) {
      res.status(500).send('Error handling request');
    }
  }
});

app.get('/api/makes', async (req, res) => {
  try {
    const data = await apiGet('/makes');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/models', async (req, res) => {
  try {
    const make = req.query.make || '';
    const url = make ? `/models?make=${encodeURIComponent(make)}` : '/models';
    const data = await apiGet(url);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/vehicles', async (req, res) => {
  try {
    const data = await apiGet(`/vehicles?${req.url.split('?')[1] || ''}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/vehicles/metadata', async (req, res) => {
  try {
    const data = await apiGet('/vehicles/metadata');
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/search', async (req, res) => {
  try {
    const { q, limit, make, model, maxPrice } = req.body;
    const params = new URLSearchParams({ keyword: q });
    if (limit) params.set('limit', String(limit));
    if (make) params.set('make', make);
    if (model) params.set('model', model);
    if (maxPrice) params.set('maxPrice', String(maxPrice));
    const data = await apiGet(`/vehicles?${params.toString()}`);
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.MCP_PORT || 3002;
app.listen(PORT, () => {
  console.log(`MCP HTTP server listening on port ${PORT}`);
});

process.on('SIGINT', async () => {
  console.log('Shutting down MCP server...');
  for (const sessionId in transports) {
    try {
      await transports[sessionId].close();
      delete transports[sessionId];
    } catch (error) {
      console.error(`Error closing transport for session ${sessionId}:`, error);
    }
  }
  process.exit(0);
});
