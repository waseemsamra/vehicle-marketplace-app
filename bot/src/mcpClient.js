import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { SSEClientTransport } from '@modelcontextprotocol/sdk/client/sse.js';

const MCP_URL = process.env.MCP_URL || 'http://localhost:3002/mcp';

let cachedClient = null;
let cachedTransport = null;

async function getMcpClient() {
  if (cachedClient && cachedTransport) {
    return { client: cachedClient, transport: cachedTransport };
  }
  const transport = new SSEClientTransport(new URL(MCP_URL));
  const client = new Client(
    { name: 'vehicle-marketplace-bot', version: '1.0.0' },
    { capabilities: {} }
  );
  await client.connect(transport);
  cachedClient = client;
  cachedTransport = transport;
  return { client, transport };
}

async function callMcpTool(name, args = {}) {
  const { client } = await getMcpClient();
  const result = await client.callTool({ name, arguments: args });
  if (result.isError) {
    throw new Error(result.content.map(c => c.text).join('\n'));
  }
  const text = result.content.map(c => c.text).join('\n');
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

async function listVehicles(args = {}) {
  return callMcpTool('list_vehicles', args);
}

async function getVehicle(vehicleId) {
  return callMcpTool('get_vehicle', { vehicleId: String(vehicleId) });
}

async function searchVehicles(q, args = {}) {
  return callMcpTool('search_vehicles', { q, ...args });
}

async function getMakes() {
  return callMcpTool('get_makes');
}

async function getModels(make) {
  return callMcpTool('get_models', make ? { make } : {});
}

async function createVehicle(data, token) {
  return callMcpTool('create_vehicle', { token, ...data });
}

async function updateVehicle(vehicleId, data, token) {
  return callMcpTool('update_vehicle', { token, vehicleId: String(vehicleId), ...data });
}

async function deleteVehicle(vehicleId, token) {
  return callMcpTool('delete_vehicle', { token, vehicleId: String(vehicleId) });
}

export { getMcpClient, callMcpTool, listVehicles, getVehicle, searchVehicles, getMakes, getModels, createVehicle, updateVehicle, deleteVehicle };
