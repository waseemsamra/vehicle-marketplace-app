import mongoose from 'mongoose';

const vehicleAttributeSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, index: true },
    label: { type: String },
    value: { type: String, required: true, index: true },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    meta: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true }
);

vehicleAttributeSchema.index({ category: 1, value: 1 }, { unique: true });

export default mongoose.model('VehicleAttribute', vehicleAttributeSchema);
