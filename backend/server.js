import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { BUDGET_RANGES } from '../src/data/vehicles.js';
import Vehicle from './models/Vehicle.js';
import User from './models/User.js';
import VehicleAttribute from './models/VehicleAttribute.js';
import City from './models/City.js';
import Province from './models/Province.js';
import Make from './models/Make.js';
import VehicleModel from './models/VehicleModel.js';
import Transmission from './models/Transmission.js';
import Color from './models/Color.js';
import EngineType from './models/EngineType.js';
import EngineCapacity from './models/EngineCapacity.js';
import Assembly from './models/Assembly.js';
import BodyType from './models/BodyType.js';
import Door from './models/Door.js';
import SeatingCapacity from './models/SeatingCapacity.js';
import ModelCategory from './models/ModelCategory.js';
import { requireAuth, requireRole } from './middleware/auth.js';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const isMongoUp = () => mongoose.connection.readyState === 1;

app.get('/health', (_req, res) =>
  res.json({ status: 'ok', db: isMongoUp() ? 'connected' : 'disconnected' })
);

// ---------------- Auth ----------------
app.post('/api/auth/signup', async (req, res) => {
  const { username, email, password, role } = req.body;
  if (!password) return res.status(400).json({ error: 'Password required' });
  try {
    const dup = await User.findOne({ $or: [{ username }, { email }] });
    if (dup) return res.status(409).json({ error: 'User already exists' });

    const user = new User({
      username: username || email,
      email,
      role: role || 'user',
    });
    user.setPassword(password);
    await user.save();

    const token = jwt.sign(
      { sub: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({ token, role: user.role, username: user.username });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({
      $or: [{ username }, { email: username }],
    });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { sub: user._id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, role: user.role, username: user.username });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/auth/me', requireAuth, (req, res) =>
  res.json({ username: req.user.username, role: req.user.role })
);

// ---------------- Vehicles ----------------
const applyVehicleFilters = (q, query) => {
  const { category, city, make, model, body, budget, keyword, minPrice, maxPrice } = query;
  if (category) q.category = category;
  if (city) q.city = city;
  if (make) q.make = make;
  if (model) q.model = model;
  if (body) q.body = body;
  if (keyword) q.$text = { $search: keyword };

  if (budget) {
    const range = BUDGET_RANGES[budget];
    if (range) {
      q.priceNum = {};
      if (range.min != null) q.priceNum.$gte = range.min;
      if (range.max != null) q.priceNum.$lte = range.max;
    }
  } else if (minPrice || maxPrice) {
    q.priceNum = q.priceNum || {};
    if (minPrice) q.priceNum.$gte = Number(minPrice);
    if (maxPrice) q.priceNum.$lte = Number(maxPrice);
  }
};

app.get('/api/vehicles', async (req, res) => {
  if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const filter = {};
    applyVehicleFilters(filter, req.query);

    const limit = Number(req.query.limit) || 50;
    const offset = Number(req.query.offset) || 0;

    const [vehicles, total] = await Promise.all([
      Vehicle.find(filter).sort({ createdAt: -1 }).skip(offset).limit(limit),
      Vehicle.countDocuments(filter),
    ]);

    res.json({
      vehicles,
      items: vehicles, // alias for clients expecting `items`
      totalCount: total,
      hasMore: offset + limit < total,
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/vehicles/:id', async (req, res) => {
  if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const { id } = req.params;
    let v = await Vehicle.findOne({ id: Number(id) });
    if (!v && mongoose.isValidObjectId(id)) v = await Vehicle.findById(id);
    if (!v) return res.status(404).json({ error: 'Vehicle not found' });
    res.json(v);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post(
  '/api/vehicles',
  requireAuth,
  requireRole('admin'),
  async (req, res) => {
    if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
    try {
      const v = await Vehicle.create(req.body);
      res.status(201).json(v);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
);

app.put(
  '/api/vehicles/:id',
  requireAuth,
  requireRole('admin'),
  async (req, res) => {
    if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
    try {
      const { id } = req.params;
      let v = await Vehicle.findOneAndUpdate({ id: Number(id) }, req.body, {
        new: true,
      });
      if (!v && mongoose.isValidObjectId(id)) {
        v = await Vehicle.findByIdAndUpdate(id, req.body, { new: true });
      }
      if (!v) return res.status(404).json({ error: 'Vehicle not found' });
      res.json(v);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
);

app.delete(
  '/api/vehicles/:id',
  requireAuth,
  requireRole('admin'),
  async (req, res) => {
    if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
    try {
      const { id } = req.params;
      const r = await Vehicle.findOneAndDelete({ id: Number(id) });
      if (!r && mongoose.isValidObjectId(id)) {
        await Vehicle.findByIdAndDelete(id);
      }
      res.json({ deleted: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  }
);

// ---------------- Vehicle Attributes ----------------
app.get('/api/vehicle-attributes', async (req, res) => {
  if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const { category } = req.query;
    const filter = {};
    if (category) filter.category = category;
    const items = await VehicleAttribute.find(filter).sort({ order: 1, value: 1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/vehicle-attributes', async (req, res) => {
  if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const item = await VehicleAttribute.create(req.body);
    res.status(201).json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/vehicle-attributes/:id', async (req, res) => {
  if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const { id } = req.params;
    const item = await VehicleAttribute.findByIdAndUpdate(id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/vehicle-attributes/:id', async (req, res) => {
  if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const { id } = req.params;
    await VehicleAttribute.findByIdAndDelete(id);
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/settings', async (req, res) => {
  if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const items = await VehicleAttribute.find({ active: true }).sort({ order: 1, value: 1 });
    const settings = {};
    items.forEach((item) => {
      const cat = item.category;
      if (!settings[cat]) settings[cat] = [];
      settings[cat].push(item.value || item.label);
    });
    res.json(settings);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---------------- Generic CRUD helpers ----------------
const crudRoutes = (name, Model, { idField = '_id', labelField = 'name', extraValidate = null } = {}) => {
  app.get(`/api/${name}`, async (req, res) => {
    if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
    try {
      const items = await Model.find({ active: { $ne: false } }).sort({ [labelField]: 1 });
      res.json(items);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post(`/api/${name}`, requireAuth, requireRole('admin'), async (req, res) => {
    if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
    try {
      const payload = { ...req.body, active: true };
      if (extraValidate && !extraValidate(payload)) {
        return res.status(400).json({ error: `${name} validation failed` });
      }
      const item = await Model.create(payload);
      res.status(201).json(item);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.put(`/api/${name}/:id`, requireAuth, requireRole('admin'), async (req, res) => {
    if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
    try {
      const { id } = req.params;
      const item = await Model.findByIdAndUpdate(id, req.body, { new: true });
      if (!item) return res.status(404).json({ error: 'Not found' });
      res.json(item);
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });

  app.delete(`/api/${name}/:id`, requireAuth, requireRole('admin'), async (req, res) => {
    if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
    try {
      const { id } = req.params;
      await Model.findByIdAndDelete(id);
      res.json({ deleted: true });
    } catch (e) {
      res.status(500).json({ error: e.message });
    }
  });
};

crudRoutes('transmissions', Transmission, { labelField: 'name' });
crudRoutes('colors', Color, { labelField: 'name' });
crudRoutes('engine-types', EngineType, { labelField: 'name' });
crudRoutes('engine-capacities', EngineCapacity, { labelField: 'name' });
crudRoutes('assemblies', Assembly, { labelField: 'name' });
crudRoutes('body-types', BodyType, { labelField: 'name' });
crudRoutes('doors', Door, { labelField: 'count' });
crudRoutes('seating-capacities', SeatingCapacity, { labelField: 'count' });
crudRoutes('model-categories', ModelCategory, { labelField: 'name' });

app.get('/api/cities', async (req, res) => {
  if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const items = await City.find({ active: { $ne: false } }).sort({ cityName: 1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/cities', async (req, res) => {
  if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const { cityId, cityName, provinceId, provinceName } = req.body || {};
    if (!cityName) return res.status(400).json({ error: 'cityName is required' });
    if (!provinceId || !provinceName) return res.status(400).json({ error: 'provinceId and provinceName are required' });
    const finalCityId = cityId && String(cityId).trim() !== '' ? cityId : cityName.split(/\s+/).map(w => w[0]).join('').slice(0, 3).toUpperCase() + '-' + String(Math.floor(Math.random() * 900) + 1).padStart(3, '0');
    const item = await City.create({ cityId: finalCityId, cityName, provinceId, provinceName, active: true });
    res.status(201).json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/cities/:id', async (req, res) => {
  if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const { id } = req.params;
    const item = await City.findByIdAndUpdate(id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/cities/:id', async (req, res) => {
  if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const { id } = req.params;
    await City.findByIdAndDelete(id);
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/provinces', async (req, res) => {
  if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const items = await Province.find({ active: { $ne: false } }).sort({ provinceName: 1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/provinces', async (req, res) => {
  if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const { provinceId, provinceName } = req.body || {};
    if (!provinceId || !provinceName) return res.status(400).json({ error: 'provinceId and provinceName are required' });
    const item = await Province.create({ provinceId, provinceName, active: true });
    res.status(201).json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/provinces/:id', async (req, res) => {
  if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const { id } = req.params;
    const item = await Province.findByIdAndUpdate(id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/provinces/:id', async (req, res) => {
  if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const { id } = req.params;
    await Province.findByIdAndDelete(id);
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/makes', async (req, res) => {
  if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const items = await Make.find({ active: { $ne: false } }).sort({ makeName: 1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/makes', async (req, res) => {
  if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const { makeId, makeName } = req.body || {};
    if (!makeId || !makeName) return res.status(400).json({ error: 'makeId and makeName are required' });
    const item = await Make.create({ makeId, makeName, active: true });
    res.status(201).json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/makes/:id', async (req, res) => {
  if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const { id } = req.params;
    const item = await Make.findByIdAndUpdate(id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/makes/:id', async (req, res) => {
  if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const { id } = req.params;
    await Make.findByIdAndDelete(id);
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/models', async (req, res) => {
  if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const { brandId } = req.query;
    const filter = {};
    if (brandId) filter.brandId = brandId;
    const items = await VehicleModel.find(filter).sort({ brandId: 1, modelName: 1 });
    res.json(items);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/models', async (req, res) => {
  if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const { modelId, modelName, brandId, brandName } = req.body || {};
    if (!modelId || !modelName || !brandId || !brandName) return res.status(400).json({ error: 'modelId, modelName, brandId, and brandName are required' });

    const existingMake = await Make.findOne({ makeId: brandId });
    if (!existingMake) {
      await Make.create({ makeId: brandId, makeName: brandName, active: true });
    }

    const item = await VehicleModel.create({ modelId, modelName, brandId, brandName, active: true });
    res.status(201).json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.put('/api/models/:id', async (req, res) => {
  if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const { id } = req.params;
    const item = await VehicleModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: 'Not found' });
    res.json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.delete('/api/models/:id', async (req, res) => {
  if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const { id } = req.params;
    await VehicleModel.findByIdAndDelete(id);
    res.json({ deleted: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

const s3 = new S3Client({
  endpoint: process.env.S3_ENDPOINT || 'https://bluechip.s3.us-west-4.idrivee2.com',
  region: process.env.S3_REGION || 'us-west-4',
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true,
});

app.post('/api/upload-url', async (req, res) => {
  if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const { fileName, fileType, vehicleId } = req.body || {};
    if (!fileName || !fileType) return res.status(400).json({ error: 'fileName and fileType are required' });

    const key = `vehicles/${vehicleId || 'general'}/${Date.now()}_${fileName}`;
    const command = new PutObjectCommand({
      Bucket: process.env.S3_BUCKET || 'bluechip',
      Key: key,
      ContentType: fileType,
      ACL: 'public-read',
    });

    const signedUrl = await getSignedUrl(s3, command, { expiresIn: 60 });
    const publicUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5001/api'}/images/${key}`;

    res.json({ uploadUrl: signedUrl, publicUrl, key });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.get('/api/images/:key(*)', async (req, res) => {
  if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const key = req.params.key;
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET || 'bluechip',
      Key: key,
    });
    const response = await s3.send(command);
    const stream = response.Body;
    res.setHeader('Content-Type', response.ContentType || 'application/octet-stream');
    if (response.ContentLength) res.setHeader('Content-Length', response.ContentLength);
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    stream.pipe(res);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

app.post('/api/seed', async (req, res) => {
  if (!isMongoUp()) return res.status(503).json({ error: 'Database unavailable' });
  try {
    const { ATTRIBUTE_SEED, CITY_SEED, generateCityId, preparedCities, PROVINCE_SEED, preparedProvinces, MAKE_SEED, preparedMakes, MODEL_SEED, preparedModels } = await import('./seed.js');
    await Promise.all([
      VehicleAttribute.deleteMany({}),
      City.deleteMany({}),
      Province.deleteMany({}),
      Make.deleteMany({}),
      VehicleModel.deleteMany({}),
    ]);
    await Promise.all([
      VehicleAttribute.insertMany(ATTRIBUTE_SEED),
      Province.insertMany(preparedProvinces),
      Make.insertMany(preparedMakes),
      VehicleModel.insertMany(preparedModels),
      City.insertMany(preparedCities),
    ]);
    res.json({ ok: true, attributes: ATTRIBUTE_SEED.length, provinces: preparedProvinces.length, makes: preparedMakes.length, models: preparedModels.length, cities: preparedCities.length });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// ---------------- Start ----------------
const start = async () => {
  if (process.env.MONGODB_URI) {
    mongoose
      .connect(process.env.MONGODB_URI)
      .then(() => console.log('MongoDB connected'))
      .catch((e) => console.error('MongoDB connection error:', e.message));
  } else {
    console.warn('MONGODB_URI not set — starting without persistence');
  }
  app.listen(PORT, () => console.log(`Backend (MongoDB) listening on :${PORT}`));
};

start();
