import mongoose from 'mongoose';

const seatingCapacitySchema = new mongoose.Schema(
  {
    seatingCapacityId: { type: String, required: true, unique: true, index: true },
    count: { type: Number, required: true, index: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('SeatingCapacity', seatingCapacitySchema);
