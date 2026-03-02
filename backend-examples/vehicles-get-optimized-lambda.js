// Optimized Lambda function for GET /vehicles with filtering
// Handles 1000+ vehicles efficiently with pagination and server-side filtering

const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = process.env.VEHICLES_TABLE;

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
    const params = event.queryStringParameters || {};
    
    // Build filter expression
    let filterExpression = [];
    let expressionAttributeNames = {};
    let expressionAttributeValues = {};
    let valueCounter = 0;

    // Add filters
    if (params.make) {
      filterExpression.push('#make = :make');
      expressionAttributeNames['#make'] = 'make';
      expressionAttributeValues[':make'] = params.make;
    }

    if (params.model) {
      filterExpression.push('#model = :model');
      expressionAttributeNames['#model'] = 'model';
      expressionAttributeValues[':model'] = params.model;
    }

    if (params.minPrice) {
      filterExpression.push('price >= :minPrice');
      expressionAttributeValues[':minPrice'] = parseFloat(params.minPrice);
    }

    if (params.maxPrice) {
      filterExpression.push('price <= :maxPrice');
      expressionAttributeValues[':maxPrice'] = parseFloat(params.maxPrice);
    }

    if (params.minYear) {
      filterExpression.push('#year >= :minYear');
      expressionAttributeNames['#year'] = 'year';
      expressionAttributeValues[':minYear'] = parseInt(params.minYear);
    }

    if (params.maxYear) {
      filterExpression.push('#year <= :maxYear');
      expressionAttributeNames['#year'] = 'year';
      expressionAttributeValues[':maxYear'] = parseInt(params.maxYear);
    }

    if (params.transmission) {
      filterExpression.push('transmission = :transmission');
      expressionAttributeValues[':transmission'] = params.transmission;
    }

    if (params.fuelType) {
      filterExpression.push('fuelType = :fuelType');
      expressionAttributeValues[':fuelType'] = params.fuelType;
    }

    if (params.bodyType) {
      filterExpression.push('bodyType = :bodyType');
      expressionAttributeValues[':bodyType'] = params.bodyType;
    }

    if (params.color) {
      filterExpression.push('color = :color');
      expressionAttributeValues[':color'] = params.color;
    }

    if (params.maxMileage) {
      filterExpression.push('mileage <= :maxMileage');
      expressionAttributeValues[':maxMileage'] = parseInt(params.maxMileage);
    }

    // Build scan parameters
    const scanParams = {
      TableName: TABLE_NAME,
      Limit: parseInt(params.limit) || 50
    };

    if (filterExpression.length > 0) {
      scanParams.FilterExpression = filterExpression.join(' AND ');
      scanParams.ExpressionAttributeNames = expressionAttributeNames;
      scanParams.ExpressionAttributeValues = expressionAttributeValues;
    }

    if (params.lastKey) {
      scanParams.ExclusiveStartKey = JSON.parse(decodeURIComponent(params.lastKey));
    }

    const data = await docClient.send(new ScanCommand(scanParams));

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        vehicles: data.Items || [],
        lastKey: data.LastEvaluatedKey ? encodeURIComponent(JSON.stringify(data.LastEvaluatedKey)) : null,
        count: data.Items?.length || 0
      })
    };
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Failed to fetch vehicles' })
    };
  }
};
