import mongoose from 'mongoose';

const doorSchema = new mongoose.Schema(
  {
    doorId: { type: String, required: true, unique: true, index: true },
    count: { type: Number, required: true, index: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Door', doorSchema);
