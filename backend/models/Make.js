import mongoose from 'mongoose';

const makeSchema = new mongoose.Schema(
  {
    makeId: { type: String, required: true, unique: true, index: true },
    makeName: { type: String, required: true, index: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Make', makeSchema);
