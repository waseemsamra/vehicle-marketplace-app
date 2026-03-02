const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, ScanCommand, UpdateCommand } = require("@aws-sdk/lib-dynamodb");

const client = new DynamoDBClient({ region: "us-east-1" });
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = "dev-vehicles";

function getVehicleImages() {
  return [
    `https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80`,
    `https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800&q=80`,
    `https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80`,
    `https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&q=80`
  ];
}

async function updateVehiclesWithImages() {
  console.log('Fetching vehicles...');
  let allVehicles = [];
  let lastKey = null;
  
  do {
    const result = await docClient.send(new ScanCommand({
      TableName: TABLE_NAME,
      ExclusiveStartKey: lastKey || undefined
    }));
    allVehicles = allVehicles.concat(result.Items || []);
    lastKey = result.LastEvaluatedKey;
  } while (lastKey);
  
  const vehiclesWithoutImages = allVehicles.filter(v => !v.images || v.images.length === 0);
  console.log(`Found ${vehiclesWithoutImages.length} vehicles without images`);
  
  let updated = 0;
  for (const vehicle of vehiclesWithoutImages) {
    await docClient.send(new UpdateCommand({
      TableName: TABLE_NAME,
      Key: { vehicleId: vehicle.vehicleId },
      UpdateExpression: 'SET images = :images',
      ExpressionAttributeValues: { ':images': getVehicleImages() }
    }));
    
    updated++;
    if (updated % 50 === 0) console.log(`Updated ${updated}/${vehiclesWithoutImages.length}...`);
  }
  
  console.log(`Completed! Updated ${updated} vehicles.`);
}

updateVehiclesWithImages().catch(console.error);
