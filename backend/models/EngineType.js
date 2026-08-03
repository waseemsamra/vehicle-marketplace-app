import mongoose from 'mongoose';

const engineTypeSchema = new mongoose.Schema(
  {
    engineTypeId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('EngineType', engineTypeSchema);
