import mongoose from 'mongoose';

const makeSchema = new mongoose.Schema(
  {
    makeId: { type: String, required: true, unique: true, index: true },
    makeName: { type: String, required: true, index: true },
    active: { type: Boolean, default: true },
    logo: { type: String, default: '' },
    showOnHomePage: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Make', makeSchema);
