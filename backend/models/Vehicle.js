import mongoose from 'mongoose';

const vehicleSchema = new mongoose.Schema(
  {
    id: { type: Number, index: true },
    img: String,
    badges: [{ text: String, cls: String }],
    title: { type: String, index: true },
    price: String,
    priceNum: { type: Number, index: true },
    sub: String,
    make: { type: String, index: true },
    model: { type: String, index: true },
    year: { type: Number, index: true },
    mileage: Number,
    body: { type: String, index: true },
    fuel: String,
    fuelType: String,
    transmission: String,
    engine: String,
    features: [String],
    specs: [[String]],
    category: { type: String, index: true },
    city: { type: String, index: true },
    condition: String,
    color: String,
    description: String,
    images: [String],
    status: String,
    imageUrl: String,
  },
  { timestamps: true }
);

vehicleSchema.index({ title: 'text', make: 'text', model: 'text' });

export default mongoose.model('Vehicle', vehicleSchema);
