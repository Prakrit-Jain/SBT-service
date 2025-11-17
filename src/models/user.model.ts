import mongoose, { Schema, Model } from 'mongoose';
import { IUser } from '../types/database.types';

const userSchema = new Schema<IUser>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      unique: true,
      trim: true,
      minlength: [3, 'User ID must be at least 3 characters'],
      maxlength: [50, 'User ID cannot exceed 50 characters'],
      index: true,
    },
    walletAddress: {
      type: String,
      required: [true, 'Wallet address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum wallet address'],
      index: true,
    },
    publicKey: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
      sparse: true,
    },
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
userSchema.index({ createdAt: -1 });
userSchema.index({ email: 1 }, { sparse: true });

// Methods
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.__v;
  return user;
};

const UserModel: Model<IUser> = mongoose.model<IUser>('User', userSchema);

export default UserModel;
