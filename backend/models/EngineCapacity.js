import mongoose from 'mongoose';

const engineCapacitySchema = new mongoose.Schema(
  {
    engineCapacityId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    cc: { type: Number },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('EngineCapacity', engineCapacitySchema);
