import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITask extends Document {
  id: string;
  title: string;
  subtitle: string;
  rewardText: string;
  rewardPulls: number;
  link?: string;
  type: 'social' | 'connect';
}

const TaskSchema = new Schema<ITask>(
  {
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    rewardText: { type: String, required: true },
    rewardPulls: { type: Number, required: true },
    link: { type: String },
    type: { type: String, enum: ['social', 'connect'], required: true }
  },
  {
    timestamps: true
  }
);

export const Task: Model<ITask> =
  mongoose.models.Task || mongoose.model<ITask>('Task', TaskSchema);

export const INITIAL_DB_TASKS = [
  {
    id: 'connect_wallet',
    title: 'Connect MetaMask Wallet',
    subtitle: '1 free pull on wallet connect.',
    rewardText: '+1 FREE PULL',
    rewardPulls: 1,
    type: 'connect' as const
  },
  {
    id: 'follow_x',
    title: 'Follow @GobbozHQ',
    subtitle: 'Join the tribe on X for alpha & shiny drops.',
    rewardText: '+1 PULL',
    rewardPulls: 1,
    link: 'https://x.com/gobbozhq',
    type: 'social' as const
  },
  {
    id: 'like_rt',
    title: 'Like & Repost Collab Tweet',
    subtitle: 'Spread the meme. We gib. We grib.',
    rewardText: '+1 PULL',
    rewardPulls: 1,
    link: 'https://x.com/gobbozhq/status/2082134899067126023',
    type: 'social' as const
  },
  {
    id: 'refer_friend',
    title: 'Refer a Goblin Friend',
    subtitle: '+2 pull on referral that connects a new wallet (referral code in URL, tracked server-side).',
    rewardText: '+2 PULLS',
    rewardPulls: 2,
    type: 'social' as const
  },
  {
    id: 'share_result',
    title: 'Share Your Result Card',
    subtitle: 'Post your loot card on X to unlock an instant bonus spin.',
    rewardText: '+1 BONUS PULL',
    rewardPulls: 1,
    type: 'social' as const
  }
];
