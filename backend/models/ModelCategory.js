import mongoose from 'mongoose';

const modelCategorySchema = new mongoose.Schema(
  {
    modelCategoryId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('ModelCategory', modelCategorySchema);
