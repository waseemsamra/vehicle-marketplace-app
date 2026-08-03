import mongoose from 'mongoose';

const citySchema = new mongoose.Schema(
  {
    cityId: { type: String, required: true, unique: true, index: true },
    cityName: { type: String, required: true, index: true },
    provinceId: { type: String, required: true, index: true },
    provinceName: { type: String, required: true, index: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

citySchema.index({ provinceId: 1, cityId: 1 }, { unique: true });

export default mongoose.model('City', citySchema);
