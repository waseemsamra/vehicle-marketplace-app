import mongoose from 'mongoose';

const modelSchema = new mongoose.Schema(
  {
    modelId: { type: String, required: true, unique: true, index: true },
    modelName: { type: String, required: true, index: true },
    brandId: { type: String, required: true, index: true },
    brandName: { type: String, required: true, index: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

modelSchema.index({ brandId: 1, modelId: 1 }, { unique: true });

export default mongoose.model('VehicleModel', modelSchema);
