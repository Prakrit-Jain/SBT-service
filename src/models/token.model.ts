import mongoose, { Schema, Model } from 'mongoose';
import { IToken, TokenType, TokenStatus } from '../types/database.types';

const tokenSchema = new Schema<IToken>(
  {
    tokenId: {
      type: String,
      required: [true, 'Token ID is required'],
      unique: true,
      trim: true,
      index: true,
    },
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      trim: true,
      index: true,
    },
    walletAddress: {
      type: String,
      required: [true, 'Wallet address is required'],
      lowercase: true,
      trim: true,
      match: [/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum wallet address'],
      index: true,
    },
    tokenType: {
      type: String,
      required: [true, 'Token type is required'],
      enum: Object.values(TokenType),
      index: true,
    },
    blockchain: {
      type: String,
      required: [true, 'Blockchain ID is required'],
      trim: true,
      index: true,
    },
    contractAddress: {
      type: String,
      required: [true, 'Contract address is required'],
      lowercase: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
    transactionHash: {
      type: String,
      trim: true,
      sparse: true,
    },
    status: {
      type: String,
      required: [true, 'Token status is required'],
      enum: Object.values(TokenStatus),
      default: TokenStatus.PENDING,
      index: true,
    },
    delegatedTo: {
      type: String,
      lowercase: true,
      trim: true,
      sparse: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Compound indexes
tokenSchema.index({ userId: 1, tokenType: 1 });
tokenSchema.index({ walletAddress: 1, blockchain: 1 });
tokenSchema.index({ status: 1, createdAt: -1 });

// Methods
tokenSchema.methods.toJSON = function () {
  const token = this.toObject();
  delete token.__v;
  return token;
};

const TokenModel: Model<IToken> = mongoose.model<IToken>('Token', tokenSchema);

export default TokenModel;
