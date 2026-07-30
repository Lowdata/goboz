export type SymbolId = 
  | 'gold_coin' 
  | 'rusty_dagger' 
  | 'mushroom' 
  | 'eyeball' 
  | 'boot' 
  | 'torch' 
  | 'skull' 
  | 'gem';

export interface SymbolItem {
  id: SymbolId;
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  description: string;
}

export type OutcomeTierId = 
  | 'triple_gem' 
  | 'guaranteed_wl' 
  | 'fcfs_raffle' 
  | 'no_match';

export interface OutcomeTier {
  id: OutcomeTierId;
  name: string;
  title: string;
  description: string;
  badge: string;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  isGuaranteed: boolean;
  rewardText: string;
}

export interface PullResult {
  id: string;
  symbols: [SymbolId, SymbolId, SymbolId];
  tierId: OutcomeTierId;
  tierName: string;
  timestamp: string;
  walletAddress: string;
  pullsRemaining: number;
  isGuaranteedHit: boolean;
  bonusSpinAwarded?: boolean;
}

export interface TaskItem {
  id: string;
  title: string;
  subtitle: string;
  rewardText: string;
  rewardPulls: number;
  isCompleted: boolean;
  link?: string;
  type: 'social' | 'referral' | 'daily' | 'share' | 'connect';
}

export interface UserState {
  isConnected: boolean;
  walletAddress: string | null;
  twitter?: string;
  referralCode?: string;
  referredUsers?: string[];
  pullsRemaining: number;
  totalPullsDone: number;
  referralCount: number;
  streakCount: number;
  history: PullResult[];
  completedTasks: Record<string, boolean>;
  soundEnabled: boolean;
}
