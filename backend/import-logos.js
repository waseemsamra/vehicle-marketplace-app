import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import Make from './models/Make.js';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

dotenv.config();

const sleep = promisify(setTimeout);
const LOGO_DIR = path.join(process.cwd(), 'logos');
const DATASET_DIR = '/tmp/car-logos-dataset/logos';
const DATA_FILE = path.join(DATASET_DIR, 'data.json');

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT || 'https://bluechip.s3.us-west-4.idrivee2.com',
  region: process.env.S3_REGION || 'us-west-4',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true,
});

function normalizeName(name) {
  return (name || '')
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .trim();
}

function matchMake(makeName, dataset) {
  const normalized = normalizeName(makeName);
  
  const exact = dataset.find((d) => normalizeName(d.name) === normalized);
  if (exact) return exact;
  
  const bySlug = dataset.find((d) => normalizeName(d.slug) === normalized);
  if (bySlug) return bySlug;
  
  return null;
}

async function uploadToS3(filepath, key) {
  const fileBuffer = fs.readFileSync(filepath);
  const ext = path.extname(filepath).slice(1) || 'png';
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET || 'bluechip',
    Key: key,
    Body: fileBuffer,
    ContentType: `image/${ext === 'jpg' ? 'jpeg' : ext}`,
    ACL: 'public-read',
  });
  await s3.send(command);
  const proto = 'https';
  const host = 'vehicle-marketplace-app.onrender.com';
  return `${proto}://${host}/api/images/${key}`;
}

async function main() {
  await mongoose.connect(process.env.MONGODB_URI);

  if (!fs.existsSync(LOGO_DIR)) {
    fs.mkdirSync(LOGO_DIR, { recursive: true });
  }

  console.log('Loading dataset...');
  const dataset = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  console.log(`Dataset contains ${dataset.length} brands`);

  const makes = await Make.find({}).lean();
  console.log(`Database contains ${makes.length} makes\n`);

  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const make of makes) {
    const makeId = make.makeId;
    const makeName = make.makeName || '';
    const matched = matchMake(makeName, dataset);
    
    if (!matched) {
      skipped++;
      if (skipped <= 10) console.log(`Skip: ${makeId} - ${makeName} (no match)`);
      continue;
    }

    const localFile = path.join(DATASET_DIR, 'optimized', `${matched.slug}.png`);
    if (!fs.existsSync(localFile)) {
      skipped++;
      if (skipped <= 10) console.log(`Skip: ${makeId} - ${makeName} (file not found: ${matched.slug}.png)`);
      continue;
    }

    const s3Key = `makes/${makeId}/logo.png`;
    const localPath = path.join(LOGO_DIR, `${makeId}.png`);

    try {
      if (!fs.existsSync(localPath)) {
        fs.copyFileSync(localFile, localPath);
      }

      console.log(`Uploading ${makeName} logo...`);
      const publicUrl = await uploadToS3(localPath, s3Key);

      await Make.findOneAndUpdate({ makeId }, { logo: publicUrl });
      updated++;
      console.log(`✓ ${makeName} → ${publicUrl}`);
      
      await sleep(200);
    } catch (error) {
      failed++;
      console.error(`✗ ${makeName}: ${error.message}`);
    }
  }

  console.log('\nSummary:');
  console.log(`Total makes: ${makes.length}`);
  console.log(`Updated: ${updated}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Failed: ${failed}`);

  await mongoose.disconnect();
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
