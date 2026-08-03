import mongoose from 'mongoose';
import crypto from 'crypto';

const SALT_LEN = 16;
const SCRYPT_N = 1 << 14; // 16384 (scrypt requires a power-of-two N)

const userSchema = new mongoose.Schema(
  {
    username: { type: String, unique: true, required: true, index: true },
    email: { type: String, unique: true, index: true },
    passwordHash: { type: String, required: true },
    salt: { type: String, required: true },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'staff', 'admin'],
      index: true,
    },
  },
  { timestamps: true }
);

userSchema.methods.setPassword = function (password) {
  this.salt = crypto.randomBytes(SALT_LEN).toString('hex');
  this.passwordHash = crypto.scryptSync(password, this.salt, 64, {
    N: SCRYPT_N,
  }).toString('hex');
};

userSchema.methods.comparePassword = async function (password) {
  const hash = crypto.scryptSync(password, this.salt, 64, {
    N: SCRYPT_N,
  }).toString('hex');
  return crypto.timingSafeEqual(
    Buffer.from(hash, 'hex'),
    Buffer.from(this.passwordHash, 'hex')
  );
};

export default mongoose.model('User', userSchema);
