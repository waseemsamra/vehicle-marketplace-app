import mongoose from 'mongoose';

const colorSchema = new mongoose.Schema(
  {
    colorId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    hex: { type: String },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Color', colorSchema);
