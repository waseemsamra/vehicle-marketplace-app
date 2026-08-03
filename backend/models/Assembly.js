import mongoose from 'mongoose';

const assemblySchema = new mongoose.Schema(
  {
    assemblyId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Assembly', assemblySchema);
