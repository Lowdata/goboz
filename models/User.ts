import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRewardItem {
  pullId: string;
  tierId: string;
  tierName: string;
  symbols: string[];
  timestamp: string;
}

export interface IUser extends Document {
  walletAddress: string;
  twitter: string;
  pullsLeft: number;
  rewards: IRewardItem[];
  referralCode: string;
  referredUsers: string[];
  referredBy?: string;
  completedTasks: string[];
  lastDailyClaim?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const RewardItemSchema = new Schema<IRewardItem>(
  {
    pullId: { type: String, required: true },
    tierId: { type: String, required: true },
    tierName: { type: String, required: true },
    symbols: [{ type: String, required: true }],
    timestamp: { type: String, required: true }
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    walletAddress: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    twitter: {
      type: String,
      default: '',
      trim: true
    },
    pullsLeft: {
      type: Number,
      default: 1
    },
    rewards: {
      type: [RewardItemSchema],
      default: []
    },
    referralCode: {
      type: String,
      unique: true,
      required: true
    },
    referredUsers: {
      type: [String],
      default: []
    },
    referredBy: {
      type: String,
      default: null,
      lowercase: true,
      trim: true
    },
    completedTasks: {
      type: [String],
      default: []
    },
    lastDailyClaim: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
);

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
