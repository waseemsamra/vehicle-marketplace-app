// Lambda function for /vehicles/metadata endpoint
// This efficiently returns only makes/models/colors without full vehicle data
// Optimized for 1000+ vehicles using DynamoDB projection and caching

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.VEHICLES_TABLE;

// Cache metadata for 5 minutes to reduce DB load
let metadataCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

exports.handler = async (event) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // Return cached data if still valid
    if (metadataCache && Date.now() - cacheTimestamp < CACHE_TTL) {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(metadataCache)
      };
    }

    // Scan only required attributes (not full vehicle data)
    const params = {
      TableName: TABLE_NAME,
      ProjectionExpression: 'make, model, color, transmission, fuelType, bodyType'
    };

    const data = await docClient.send(new ScanCommand(params));
    const items = data.Items || [];

    // Build metadata structure
    const makes = new Set();
    const modelsByMake = {};
    const colors = new Set();
    const transmissions = new Set();
    const fuelTypes = new Set();
    const bodyTypes = new Set();

    items.forEach(item => {
      if (item.make) {
        makes.add(item.make);
        if (!modelsByMake[item.make]) modelsByMake[item.make] = new Set();
        if (item.model) modelsByMake[item.make].add(item.model);
      }
      if (item.color) colors.add(item.color);
      if (item.transmission) transmissions.add(item.transmission);
      if (item.fuelType) fuelTypes.add(item.fuelType);
      if (item.bodyType) bodyTypes.add(item.bodyType);
    });

    // Convert Sets to sorted arrays
    const metadata = {
      makes: Array.from(makes).sort(),
      models: Object.fromEntries(
        Object.entries(modelsByMake).map(([make, models]) => [make, Array.from(models).sort()])
      ),
      colors: Array.from(colors).sort(),
      transmissions: Array.from(transmissions).sort(),
      fuelTypes: Array.from(fuelTypes).sort(),
      bodyTypes: Array.from(bodyTypes).sort()
    };

    // Cache the result
    metadataCache = metadata;
    cacheTimestamp = Date.now();

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(metadata)
    };
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch metadata' })
    };
  }
};
