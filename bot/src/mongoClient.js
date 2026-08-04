import mongoose from 'mongoose';
import dotenv from 'dotenv';
import '../../backend/models/Vehicle.js';
import '../../backend/models/Make.js';
import '../../backend/models/VehicleModel.js';
import '../../backend/models/User.js';
import '../../backend/models/VehicleAttribute.js';
import '../../backend/models/City.js';
import '../../backend/models/Province.js';
import '../../backend/models/Transmission.js';
import '../../backend/models/Color.js';
import '../../backend/models/EngineType.js';
import '../../backend/models/EngineCapacity.js';
import '../../backend/models/Assembly.js';
import '../../backend/models/BodyType.js';
import '../../backend/models/Door.js';
import '../../backend/models/SeatingCapacity.js';
import '../../backend/models/ModelCategory.js';

dotenv.config({ path: '/Users/apple/Downloads/vehicle-marketplace-app/backend/.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/vehicle-marketplace';

let cachedConnection = null;

async function connect() {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }
  const conn = await mongoose.connect(MONGODB_URI);
  cachedConnection = conn;
  return conn;
}

async function findVehicles(filter = {}, options = {}) {
  const db = await connect();
  const { limit = 50, offset = 0, sort = { createdAt: -1 } } = options;
  const Vehicle = db.model('Vehicle');
  const [vehicles, total] = await Promise.all([
    Vehicle.find(filter).sort(sort).skip(offset).limit(limit),
    Vehicle.countDocuments(filter),
  ]);
  return { vehicles, total, hasMore: offset + limit < total };
}

async function findVehicleById(id) {
  const db = await connect();
  const Vehicle = db.model('Vehicle');
  let v = await Vehicle.findOne({ id: Number(id) });
  if (!v && mongoose.isValidObjectId(id)) {
    v = await Vehicle.findById(id);
  }
  return v;
}

async function findMakes() {
  const db = await connect();
  const Make = db.model('Make');
  return Make.find({ active: { $ne: false } }).sort({ makeName: 1 });
}

async function findModels(makeName) {
  const db = await connect();
  const VehicleModel = db.model('VehicleModel');
  const filter = makeName ? { brandName: makeName } : {};
  return VehicleModel.find(filter).sort({ modelName: 1 });
}

async function createVehicle(data) {
  const db = await connect();
  const Vehicle = db.model('Vehicle');
  return Vehicle.create(data);
}

async function updateVehicle(id, data) {
  const db = await connect();
  const Vehicle = db.model('Vehicle');
  let v = await Vehicle.findOneAndUpdate({ id: Number(id) }, data, { new: true });
  if (!v && mongoose.isValidObjectId(id)) {
    v = await Vehicle.findByIdAndUpdate(id, data, { new: true });
  }
  return v;
}

async function deleteVehicle(id) {
  const db = await connect();
  const Vehicle = db.model('Vehicle');
  const r = await Vehicle.findOneAndDelete({ id: Number(id) });
  if (!r && mongoose.isValidObjectId(id)) {
    await Vehicle.findByIdAndDelete(id);
  }
  return { deleted: true };
}

async function aggregateVehicles(pipeline) {
  const db = await connect();
  const Vehicle = db.model('Vehicle');
  return Vehicle.aggregate(pipeline);
}

export { connect, findVehicles, findVehicleById, findMakes, findModels, createVehicle, updateVehicle, deleteVehicle, aggregateVehicles };