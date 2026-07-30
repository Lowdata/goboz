import mongoose, { Model, Schema } from 'mongoose';

interface IAuthChallenge {
  walletAddress: string;
  nonce: string;
  expiresAt: Date;
}

const AuthChallengeSchema = new Schema<IAuthChallenge>({
  walletAddress: { type: String, required: true, unique: true, lowercase: true, trim: true },
  nonce: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } }
}, { timestamps: true });

export const AuthChallenge: Model<IAuthChallenge> =
  mongoose.models.AuthChallenge || mongoose.model<IAuthChallenge>('AuthChallenge', AuthChallengeSchema);
