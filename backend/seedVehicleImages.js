import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT || 'https://bluechip.s3.us-west-4.idrivee2.com',
  region: process.env.S3_REGION || 'us-west-4',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true,
});

const IMAGE_DIR = '/Users/apple/Downloads/vehicle-marketplace-app/public/image';
const IMAGE_FILES = fs.readdirSync(IMAGE_DIR).filter(f => f.endsWith('.jpg'));

async function uploadImageToS3(vehicleId, fileName) {
  const filePath = path.join(IMAGE_DIR, fileName);
  const fileContent = fs.readFileSync(filePath);
  const key = `vehicles/${vehicleId}/${Date.now()}_${fileName}`;

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET || 'bluechip',
    Key: key,
    Body: fileContent,
    ContentType: 'image/jpeg',
    ACL: 'public-read',
  });

  await s3.send(command);
  const publicUrl = `${process.env.S3_ENDPOINT || 'https://bluechip.s3.us-west-4.idrivee2.com'}/${process.env.S3_BUCKET || 'bluechip'}/${key}`;
  return publicUrl;
}

async function seedVehicleImages() {
  try {
    await mongoose.connect('mongodb+srv://waseemsamra_db_user:jZ5bjyLRtVWLEdyM@cluster0.mrxyxdi.mongodb.net/vehicle-marketplace?retryWrites=true&w=majority');
    
    const vehicles = await mongoose.connection.db.collection('vehicles').find({}).sort({ id: 1 }).toArray();
    console.log(`Found ${vehicles.length} vehicles`);

    for (const vehicle of vehicles) {
      if (vehicle.images && vehicle.images.length > 0) {
        console.log(`Vehicle ${vehicle.id} already has images, skipping`);
        continue;
      }

      const imageFile = IMAGE_FILES[vehicle.id % IMAGE_FILES.length];
      console.log(`Uploading ${imageFile} for vehicle ${vehicle.id} (${vehicle.make} ${vehicle.model})...`);
      
      const publicUrl = await uploadImageToS3(vehicle.id, imageFile);
      
      await mongoose.connection.db.collection('vehicles').updateOne(
        { id: vehicle.id },
        { $set: { images: [publicUrl] } }
      );
      
      console.log(`✓ Vehicle ${vehicle.id} updated with image`);
    }

    console.log('Done seeding vehicle images');
    await mongoose.disconnect();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

seedVehicleImages();
