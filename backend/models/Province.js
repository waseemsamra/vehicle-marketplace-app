import mongoose from 'mongoose';

const provinceSchema = new mongoose.Schema(
  {
    provinceId: { type: String, required: true, unique: true, index: true },
    provinceName: { type: String, required: true, index: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Province', provinceSchema);
