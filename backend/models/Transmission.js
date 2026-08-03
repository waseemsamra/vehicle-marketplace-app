import mongoose from 'mongoose';

const transmissionSchema = new mongoose.Schema(
  {
    transmissionId: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true, index: true },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Transmission', transmissionSchema);
