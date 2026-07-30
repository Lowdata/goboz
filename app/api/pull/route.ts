import { randomInt, randomUUID } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { SymbolId, OutcomeTierId, PullResult } from '@/types/game';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { assertSameOrigin, getAuthenticatedWallet, publicUser } from '@/lib/security';

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
  return arr[randomInt(arr.length)];
}

export async function POST(request: NextRequest) {
  if (!assertSameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  const normalizedAddress = getAuthenticatedWallet(request);
  if (!normalizedAddress) return NextResponse.json({ error: 'Wallet authentication required.' }, { status: 401 });
  try {
    await connectDB();
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

    let tierId: OutcomeTierId = 'no_match';
    let symbols: [SymbolId, SymbolId, SymbolId] = ['skull', 'mushroom', 'gold_coin'];

    const rand = randomInt(10_000) / 100;

    // Weighted RNG: every pull is independent.
    if (rand < 2) {
        // 2% Triple Gem Jackpot
        tierId = 'triple_gem';
        symbols = ['gem', 'gem', 'gem'];
      } else if (rand < 12) {
        // 10% Guaranteed WL (3-of-a-kind non-gem)
        const sym = getRandomItem(NON_GEM_SYMBOLS);
        tierId = 'guaranteed_wl';
        symbols = [sym, sym, sym];
      } else if (rand < 70) {
        // 58% 2-of-a-kind FCFS
        const pairSym = getRandomItem(ALL_SYMBOLS);
        const otherSymbols = ALL_SYMBOLS.filter((s) => s !== pairSym);
        const thirdSym = getRandomItem(otherSymbols);
        const pos = randomInt(3);
        const result: [SymbolId, SymbolId, SymbolId] = [pairSym, pairSym, pairSym];
        result[pos] = thirdSym;
        tierId = 'fcfs_raffle';
        symbols = result;
    } else {
        // 30% No match (3 different symbols)
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

    let newPullsRemaining = user.pullsLeft - 1;
    let bonusSpinAwarded = false;
    if (tierId === 'triple_gem') {
      newPullsRemaining += 1;
      bonusSpinAwarded = true;
    }

    const tierNameMap: Record<OutcomeTierId, string> = {
      guaranteed_wl: '3x match (any)',
      triple_gem: '3x Gem',
      fcfs_raffle: '2x match',
      no_match: 'No match'
    };

    const timestamp = new Date().toISOString();
    const pullId = `pull-${randomUUID()}`;

    const pullResult: PullResult = {
      id: pullId,
      symbols,
      tierId,
      tierName: tierNameMap[tierId],
      timestamp,
      walletAddress: user.walletAddress,
      pullsRemaining: newPullsRemaining,
      isGuaranteedHit: false,
      bonusSpinAwarded
    };

    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id, pullsLeft: user.pullsLeft },
      {
        $set: { pullsLeft: newPullsRemaining },
        $push: { rewards: { pullId, tierId, tierName: tierNameMap[tierId], symbols, timestamp } }
      },
      { new: true }
    );
    if (!updatedUser) {
      return NextResponse.json({ error: 'State changed. Please pull again.' }, { status: 409 });
    }

    return NextResponse.json({
      ...pullResult,
      user: publicUser(updatedUser)
    });
  } catch (error) {
    console.error('Error resolving pull:', error);
    return NextResponse.json(
      { error: 'Internal server error resolving lever pull.' },
      { status: 500 }
    );
  }
}
