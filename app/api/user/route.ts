import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';

function generateReferralCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = 'GOB-';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { walletAddress } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'walletAddress is required.' },
        { status: 400 }
      );
    }

    await connectDB();

    const normalizedAddress = walletAddress.toLowerCase().trim();
    let user = await User.findOne({ walletAddress: normalizedAddress });

    if (!user) {
      // Ensure unique referral code
      let referralCode = generateReferralCode();
      let exists = await User.findOne({ referralCode });
      while (exists) {
        referralCode = generateReferralCode();
        exists = await User.findOne({ referralCode });
      }

      user = await User.create({
        walletAddress: normalizedAddress,
        twitter: '',
        pullsLeft: 3,
        rewards: [],
        referralCode,
        referredUsers: [],
        completedTasks: ['connect_wallet'],
        pityCounter: 0
      });
    }

    // Check daily_claim status based on calendar day
    const todayStr = new Date().toDateString();
    const hasClaimedToday =
      user.lastDailyClaim &&
      new Date(user.lastDailyClaim).toDateString() === todayStr;

    let changed = false;
    if (!hasClaimedToday && user.completedTasks.includes('daily_claim')) {
      user.completedTasks = user.completedTasks.filter(
        (t: string) => t !== 'daily_claim'
      );
      changed = true;
    } else if (hasClaimedToday && !user.completedTasks.includes('daily_claim')) {
      user.completedTasks.push('daily_claim');
      changed = true;
    }
    if (changed) {
      await user.save();
    }

    return NextResponse.json(user);
  } catch (error: any) {
    console.error('Error fetching/creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error fetching user.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { walletAddress, twitter, inviteCode } = body;

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'walletAddress is required.' },
        { status: 400 }
      );
    }

    await connectDB();

    const normalizedAddress = walletAddress.toLowerCase().trim();
    const user = await User.findOne({ walletAddress: normalizedAddress });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found.' },
        { status: 404 }
      );
    }

    // Update Twitter handle if provided
    if (typeof twitter === 'string' && twitter.trim().length > 0) {
      let handle = twitter.trim();
      if (!handle.startsWith('@')) {
        handle = '@' + handle;
      }
      user.twitter = handle;
    }

    // Process Invite Code (Referral) if provided
    if (typeof inviteCode === 'string' && inviteCode.trim().length > 0) {
      const cleanCode = inviteCode.trim().toUpperCase();

      if (cleanCode === user.referralCode.toUpperCase()) {
        return NextResponse.json(
          { error: 'You cannot refer yourself!' },
          { status: 400 }
        );
      }

      const referrer = await User.findOne({ referralCode: cleanCode });
      if (!referrer) {
        return NextResponse.json(
          { error: 'Invalid referral code.' },
          { status: 400 }
        );
      }

      if (!referrer.referredUsers.includes(normalizedAddress)) {
        referrer.referredUsers.push(normalizedAddress);
        referrer.pullsLeft += 2;
        await referrer.save();

        // Award +2 bonus pulls to the invitee as well
        user.pullsLeft += 2;
      }
    }

    await user.save();
    return NextResponse.json(user);
  } catch (error: any) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error updating user.' },
      { status: 500 }
    );
  }
}
