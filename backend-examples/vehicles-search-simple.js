const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

exports.handler = async (event) => {
    console.log('Search function invoked with:', event.queryStringParameters);
    
    const headers = {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS'
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    try {
        const params = event.queryStringParameters || {};
        
        // Build filter expression
        const filterParts = [];
        const expressionNames = {};
        const expressionValues = {};

        if (params.make) {
            filterParts.push('#make = :make');
            expressionNames['#make'] = 'make';
            expressionValues[':make'] = params.make;
        }

        if (params.model) {
            filterParts.push('model = :model');
            expressionValues[':model'] = params.model;
        }

        if (params.minPrice) {
            filterParts.push('price >= :minPrice');
            expressionValues[':minPrice'] = parseInt(params.minPrice);
        }

        if (params.maxPrice) {
            filterParts.push('price <= :maxPrice');
            expressionValues[':maxPrice'] = parseInt(params.maxPrice);
        }

        if (params.minYear) {
            filterParts.push('#year >= :minYear');
            expressionNames['#year'] = 'year';
            expressionValues[':minYear'] = parseInt(params.minYear);
        }

        if (params.maxYear) {
            filterParts.push('#year <= :maxYear');
            expressionNames['#year'] = 'year';
            expressionValues[':maxYear'] = parseInt(params.maxYear);
        }

        if (params.transmission) {
            filterParts.push('transmission = :transmission');
            expressionValues[':transmission'] = params.transmission;
        }

        if (params.fuelType) {
            filterParts.push('fuelType = :fuelType');
            expressionValues[':fuelType'] = params.fuelType;
        }

        if (params.bodyType) {
            filterParts.push('bodyType = :bodyType');
            expressionValues[':bodyType'] = params.bodyType;
        }

        if (params.color) {
            filterParts.push('color = :color');
            expressionValues[':color'] = params.color;
        }

        if (params.maxMileage) {
            filterParts.push('mileage <= :maxMileage');
            expressionValues[':maxMileage'] = parseInt(params.maxMileage);
        }

        if (params.search) {
            const searchLower = params.search.toLowerCase();
            // Note: DynamoDB FilterExpression doesn't support OR, so we'll filter in code after scan
            // Store search term for post-processing
        }

        // Build scan parameters
        const scanParams = {
            TableName: process.env.VEHICLES_TABLE || 'dev-vehicles',
            Limit: parseInt(params.limit) || 50
        };

        if (params.offset && parseInt(params.offset) > 0) {
            // For pagination, we need to scan from beginning and skip items
            // This is not ideal but DynamoDB doesn't support offset directly
            scanParams.Limit = parseInt(params.limit) + parseInt(params.offset);
        }

        if (filterParts.length > 0) {
            scanParams.FilterExpression = filterParts.join(' AND ');
            if (Object.keys(expressionNames).length > 0) {
                scanParams.ExpressionAttributeNames = expressionNames;
            }
            scanParams.ExpressionAttributeValues = expressionValues;
        }

        console.log('Scan params:', JSON.stringify(scanParams, null, 2));

        // Scan all items to get total count
        let allItems = [];
        let lastKey = null;
        do {
            const scanCmd = { ...scanParams };
            delete scanCmd.Limit;
            if (lastKey) scanCmd.ExclusiveStartKey = lastKey;
            const result = await docClient.send(new ScanCommand(scanCmd));
            allItems = allItems.concat(result.Items || []);
            lastKey = result.LastEvaluatedKey;
        } while (lastKey);
        
        const totalCount = allItems.length;
        const offset = parseInt(params.offset) || 0;
        const limit = parseInt(params.limit) || 80;
        
        // Apply search filter in code (DynamoDB doesn't support OR in FilterExpression)
        let filteredItems = allItems;
        if (params.search) {
            const searchLower = params.search.toLowerCase();
            filteredItems = allItems.filter(item => 
                (item.make && item.make.toLowerCase().includes(searchLower)) ||
                (item.model && item.model.toLowerCase().includes(searchLower))
            );
        }
        
        const items = filteredItems.slice(offset, offset + limit);

        console.log(`Found ${items.length} vehicles (offset: ${offset}, total: ${filteredItems.length})`);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                vehicles: items,
                totalCount: filteredItems.length,
                hasMore: offset + limit < filteredItems.length
            })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: error.message })
        };
    }
};
