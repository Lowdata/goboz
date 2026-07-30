import { NextResponse } from 'next/server';
import { SymbolId, OutcomeTierId, PullResult } from '@/types/game';
import { PITY_THRESHOLD } from '@/utils/constants';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';

const ALL_SYMBOLS: SymbolId[] = [
  'gold_coin',
  'rusty_dagger',
  'mushroom',
  'eyeball',
  'boot',
  'torch',
  'skull',
  'gem'
];

const NON_GEM_SYMBOLS: SymbolId[] = [
  'gold_coin',
  'rusty_dagger',
  'mushroom',
  'eyeball',
  'boot',
  'torch',
  'skull'
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { walletAddress } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address required to pull the lever.' },
        { status: 400 }
      );
    }

    await connectDB();

    const normalizedAddress = walletAddress.toLowerCase().trim();
    const user = await User.findOne({ walletAddress: normalizedAddress });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found. Please connect your wallet first.' },
        { status: 404 }
      );
    }

    // REQUIREMENT: user CAN NOT USE THE SLOT MACHINE UNTILL TWITTER IS PROVIDED
    if (!user.twitter || user.twitter.trim() === '') {
      return NextResponse.json(
        {
          error: 'TWITTER_REQUIRED',
          message: 'You must link your Twitter handle before pulling the lever!'
        },
        { status: 403 }
      );
    }

    if (user.pullsLeft <= 0) {
      return NextResponse.json(
        { error: 'No pulls remaining! Complete tasks or refer friends to loot again.' },
        { status: 400 }
      );
    }

    const pityCounter = user.pityCounter || 0;
    const isGuaranteedHit = pityCounter >= PITY_THRESHOLD;

    let tierId: OutcomeTierId = 'no_match';
    let symbols: [SymbolId, SymbolId, SymbolId] = ['skull', 'mushroom', 'gold_coin'];

    const rand = Math.random() * 100;

    if (isGuaranteedHit) {
      // Pity hit triggered! Guarantee at least a 2x or 3x match
      if (rand < 25) {
        // 25% chance of 3-of-a-kind Guaranteed WL
        const sym = getRandomItem(NON_GEM_SYMBOLS);
        tierId = 'guaranteed_wl';
        symbols = [sym, sym, sym];
      } else {
        // 75% chance of 2-of-a-kind FCFS
        const pairSym = getRandomItem(ALL_SYMBOLS);
        const otherSymbols = ALL_SYMBOLS.filter((s) => s !== pairSym);
        const thirdSym = getRandomItem(otherSymbols);
        tierId = 'fcfs_raffle';
        symbols = [pairSym, pairSym, thirdSym];
      }
    } else {
      // Standard weighted RNG
      if (rand < 6) {
        // 6% Triple Gem Jackpot
        tierId = 'triple_gem';
        symbols = ['gem', 'gem', 'gem'];
      } else if (rand < 22) {
        // 16% Guaranteed WL (3-of-a-kind non-gem)
        const sym = getRandomItem(NON_GEM_SYMBOLS);
        tierId = 'guaranteed_wl';
        symbols = [sym, sym, sym];
      } else if (rand < 62) {
        // 40% 2-of-a-kind FCFS
        const pairSym = getRandomItem(ALL_SYMBOLS);
        const otherSymbols = ALL_SYMBOLS.filter((s) => s !== pairSym);
        const thirdSym = getRandomItem(otherSymbols);
        const pos = Math.floor(Math.random() * 3);
        const result: [SymbolId, SymbolId, SymbolId] = [pairSym, pairSym, pairSym];
        result[pos] = thirdSym;
        tierId = 'fcfs_raffle';
        symbols = result;
      } else {
        // 38% No match (3 different symbols)
        const s1 = getRandomItem(ALL_SYMBOLS);
        let s2 = getRandomItem(ALL_SYMBOLS);
        while (s2 === s1) {
          s2 = getRandomItem(ALL_SYMBOLS);
        }
        let s3 = getRandomItem(ALL_SYMBOLS);
        while (s3 === s1 || s3 === s2) {
          s3 = getRandomItem(ALL_SYMBOLS);
        }
        tierId = 'no_match';
        symbols = [s1, s2, s3];
      }
    }

    let newPityCounter = pityCounter;
    if (tierId === 'no_match') {
      newPityCounter = pityCounter + 1;
    } else {
      newPityCounter = 0;
    }

    let newPullsRemaining = user.pullsLeft - 1;
    let bonusSpinAwarded = false;
    if (tierId === 'triple_gem') {
      newPullsRemaining += 1;
      bonusSpinAwarded = true;
    }

    const tierNameMap: Record<OutcomeTierId, string> = {
      triple_gem: 'Triple Gem',
      guaranteed_wl: '3-of-a-kind',
      fcfs_raffle: '2-of-a-kind',
      no_match: 'No match'
    };

    const timestamp = new Date().toISOString();
    const pullId = `pull-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    const pullResult: PullResult = {
      id: pullId,
      symbols,
      tierId,
      tierName: tierNameMap[tierId],
      timestamp,
      walletAddress: user.walletAddress,
      pullsRemaining: newPullsRemaining,
      pityCounter: newPityCounter,
      isGuaranteedHit,
      bonusSpinAwarded
    };

    // Update user in MongoDB
    user.pullsLeft = newPullsRemaining;
    user.pityCounter = newPityCounter;
    user.rewards.push({
      pullId,
      tierId,
      tierName: tierNameMap[tierId],
      symbols,
      timestamp
    });

    await user.save();

    return NextResponse.json({
      ...pullResult,
      user
    });
  } catch (error) {
    console.error('Error resolving pull:', error);
    return NextResponse.json(
      { error: 'Internal server error resolving lever pull.' },
      { status: 500 }
    );
  }
}
