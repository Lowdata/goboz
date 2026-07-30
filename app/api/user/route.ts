import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { assertSameOrigin, getAuthenticatedWallet, publicUser } from '@/lib/security';

const TWITTER_HANDLE = /^[A-Za-z0-9_]{1,15}$/;

function normalizeTwitterHandle(value: string): string | null {
  const input = value.trim();
  if (!input) return '';
  let handle = input.replace(/^@/, '');
  if (/^https?:\/\//i.test(input)) {
    try {
      const url = new URL(input);
      if (!['x.com', 'www.x.com', 'twitter.com', 'www.twitter.com'].includes(url.hostname.toLowerCase())) return null;
      const [profile] = url.pathname.split('/').filter(Boolean);
      if (!profile) return null;
      handle = profile.replace(/^@/, '');
    } catch {
      return null;
    }
  }
  return TWITTER_HANDLE.test(handle) ? `@${handle}` : null;
}

export async function GET(request: NextRequest) {
  const walletAddress = getAuthenticatedWallet(request);
  if (!walletAddress) return NextResponse.json({ error: 'Wallet authentication required.' }, { status: 401 });
  try {
    await connectDB();
    const user = await User.findOne({ walletAddress });
    if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    return NextResponse.json(publicUser(user));
  } catch {
    return NextResponse.json({ error: 'Unable to load user.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!assertSameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  const walletAddress = getAuthenticatedWallet(request);
  if (!walletAddress) return NextResponse.json({ error: 'Wallet authentication required.' }, { status: 401 });

  try {
    const { twitter, twitterHandle, inviteCode } = await request.json();
    const rawTwitter = twitter !== undefined ? twitter : twitterHandle;
    let normalizedTwitter: string | null | undefined;
    if (typeof rawTwitter === 'string') normalizedTwitter = normalizeTwitterHandle(rawTwitter);
    if (rawTwitter !== undefined && (typeof rawTwitter !== 'string' || normalizedTwitter === null)) {
      return NextResponse.json({ error: 'Use @handle, handle, or an x.com/twitter.com profile URL.' }, { status: 400 });
    }
    if (inviteCode !== undefined && (typeof inviteCode !== 'string' || inviteCode.trim().length > 32)) {
      return NextResponse.json({ error: 'Invalid referral code.' }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ walletAddress });
    if (!user) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

    if (typeof normalizedTwitter === 'string') user.twitter = normalizedTwitter;

    if (typeof inviteCode === 'string' && inviteCode.trim()) {
      if (user.referredBy) return NextResponse.json({ error: 'A referral code has already been applied.' }, { status: 400 });
      const cleanCode = inviteCode.trim().toUpperCase();
      if (cleanCode === user.referralCode.toUpperCase()) return NextResponse.json({ error: 'You cannot refer yourself.' }, { status: 400 });
      const referrer = await User.findOneAndUpdate(
        { referralCode: cleanCode, walletAddress: { $ne: walletAddress }, referredUsers: { $ne: walletAddress } },
        { $addToSet: { referredUsers: walletAddress }, $inc: { pullsLeft: 1 } },
        { new: true }
      );
      if (!referrer) return NextResponse.json({ error: 'Invalid or already-used referral code.' }, { status: 400 });
      user.referredBy = referrer.walletAddress;
      user.pullsLeft += 1;
    }

    await user.save();
    return NextResponse.json(publicUser(user));
  } catch {
    return NextResponse.json({ error: 'Unable to update user.' }, { status: 500 });
  }
}
