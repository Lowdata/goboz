import { SymbolId, SymbolItem, OutcomeTierId, OutcomeTier, TaskItem } from '../types/game';

export const PITY_THRESHOLD = 5;

export const SYMBOLS: Record<SymbolId, SymbolItem> = {
  gold_coin: {
    id: 'gold_coin',
    name: 'Gold Coin',
    emoji: '🪙',
    color: '#F5B82E',
    bgColor: 'rgba(245, 184, 46, 0.15)',
    borderColor: '#D49615',
    description: 'Shiny goblin currency stolen from human caravans.'
  },
  rusty_dagger: {
    id: 'rusty_dagger',
    name: 'Rusty Dagger',
    emoji: '🗡️',
    color: '#94A3B8',
    bgColor: 'rgba(148, 163, 184, 0.15)',
    borderColor: '#64748B',
    description: 'Not sharp, but tetanus hurts worse.'
  },
  mushroom: {
    id: 'mushroom',
    name: 'Mushroom',
    emoji: '🍄',
    color: '#EF4444',
    bgColor: 'rgba(239, 68, 68, 0.15)',
    borderColor: '#DC2626',
    description: 'Bioluminescent fungus from deep cavern vaults.'
  },
  eyeball: {
    id: 'eyeball',
    name: 'Eyeball',
    emoji: '👁️',
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#059669',
    description: 'Keeps watch over the tribe\'s loot hoard.'
  },
  boot: {
    id: 'boot',
    name: 'Stompy Boot',
    emoji: '🥾',
    color: '#A16207',
    bgColor: 'rgba(161, 98, 7, 0.15)',
    borderColor: '#854D0E',
    description: 'For stomping shinies and kicking humie shins.'
  },
  torch: {
    id: 'torch',
    name: 'Greasy Torch',
    emoji: '🔦',
    color: '#F97316',
    bgColor: 'rgba(249, 115, 22, 0.15)',
    borderColor: '#EA580C',
    description: 'Lighting up the dark underbelly of the internet.'
  },
  skull: {
    id: 'skull',
    name: 'Goblin Skull',
    emoji: '💀',
    color: '#E2E8F0',
    bgColor: 'rgba(226, 232, 240, 0.15)',
    borderColor: '#CBD5E1',
    description: 'Ancient relic of the Great Cage Break.'
  },
  gem: {
    id: 'gem',
    name: 'Royal Gem',
    emoji: '💎',
    color: '#38BDF8',
    bgColor: 'rgba(56, 189, 248, 0.25)',
    borderColor: '#0284C7',
    description: 'The rarest shiny in the entire underground.'
  }
};

export const SYMBOL_LIST: SymbolItem[] = [
  SYMBOLS.gold_coin,
  SYMBOLS.rusty_dagger,
  SYMBOLS.mushroom,
  SYMBOLS.eyeball,
  SYMBOLS.boot,
  SYMBOLS.torch,
  SYMBOLS.skull,
  SYMBOLS.gem
];

export const OUTCOME_TIERS: Record<OutcomeTierId, OutcomeTier> = {
  triple_gem: {
    id: 'triple_gem',
    name: 'Triple Gem',
    title: '💎 Triple Gem',
    description: 'Jackpot. Guaranteed mint, no raffle, no waiting.',
    badge: 'JACKPOT MINT + FREE SPIN',
    emoji: '💎',
    color: '#38BDF8',
    bgColor: 'rgba(56, 189, 248, 0.18)',
    borderColor: '#0284C7',
    isGuaranteed: true,
    rewardText: 'Guaranteed Mint Spot + 1 Free Lever Spin!'
  },
  guaranteed_wl: {
    id: 'guaranteed_wl',
    name: '3-of-a-kind',
    title: '🟡 3-of-a-kind',
    description: "You're on the Whitelist. Straight up.",
    badge: 'GUARANTEED WHITELIST',
    emoji: '🟡',
    color: '#FACC15',
    bgColor: 'rgba(250, 204, 21, 0.18)',
    borderColor: '#EAB308',
    isGuaranteed: true,
    rewardText: 'Guaranteed Whitelist (WL) Spot Secured!'
  },
  fcfs_raffle: {
    id: 'fcfs_raffle',
    name: '2-of-a-kind',
    title: '🥾 2-of-a-kind',
    description: 'Raffle entry, odds weighted in your favor.',
    badge: 'FCFS RAFFLE ENTRY',
    emoji: '🥾',
    color: '#A3E635',
    bgColor: 'rgba(163, 230, 53, 0.15)',
    borderColor: '#65A30D',
    isGuaranteed: false,
    rewardText: 'FCFS Raffle Entry — Higher Odds Tier'
  },
  no_match: {
    id: 'no_match',
    name: 'No match',
    title: '💀 No match',
    description: 'Still counts. Every pull gets you closer to a guaranteed hit.',
    badge: 'PITY TIMER +1',
    emoji: '💀',
    color: '#94A3B8',
    bgColor: 'rgba(148, 163, 184, 0.12)',
    borderColor: '#475569',
    isGuaranteed: false,
    rewardText: 'Better luck, goblin. Your pity counter increased!'
  }
};

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'connect_wallet',
    title: 'Connect Wallet',
    subtitle: 'Link your wallet. Every goblin gets 100 free pulls in test mode!',
    rewardText: '+100 FREE PULLS (TEST MODE)',
    rewardPulls: 100,
    isCompleted: false,
    type: 'connect'
  },
  {
    id: 'follow_x',
    title: 'Follow @GobbozHQ',
    subtitle: 'Join the tribe on X for alpha & shiny drops.',
    rewardText: '+1 PULL',
    rewardPulls: 1,
    isCompleted: false,
    link: 'https://x.com/gobbozhq',
    type: 'social'
  },
  {
    id: 'like_rt',
    title: 'Like & Repost Collab Tweet',
    subtitle: 'Spread the meme. We gib. We grib.',
    rewardText: '+1 PULL',
    rewardPulls: 1,
    isCompleted: false,
    link: 'https://x.com/gobbozhq/status/2082134899067126023',
    type: 'social'
  },
  {
    id: 'join_discord',
    title: 'Join Gobboz Discord',
    subtitle: 'Enter the underground goblin war room.',
    rewardText: '+1 PULL',
    rewardPulls: 1,
    isCompleted: false,
    link: 'https://discord.gg/gobboz',
    type: 'social'
  },
  {
    id: 'refer_friend',
    title: 'Refer a Goblin Friend',
    subtitle: 'Share your personal referral link (+2 per friend who connects).',
    rewardText: '+2 PULLS',
    rewardPulls: 2,
    isCompleted: false,
    type: 'referral'
  },
  {
    id: 'daily_claim',
    title: 'Come Back Tomorrow',
    subtitle: 'Daily goblin rations for active lever pullers.',
    rewardText: '+1 PULL',
    rewardPulls: 1,
    isCompleted: false,
    type: 'daily'
  },
  {
    id: 'share_result',
    title: 'Share Your Result Card',
    subtitle: 'Post your loot card on X to unlock an instant bonus spin.',
    rewardText: '+1 BONUS PULL',
    rewardPulls: 1,
    isCompleted: false,
    type: 'share'
  }
];
