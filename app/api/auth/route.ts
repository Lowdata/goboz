import { randomBytes } from 'node:crypto';
import { NextRequest, NextResponse } from 'next/server';
import { isAddress, verifyMessage } from 'viem';
import { connectDB } from '@/lib/db';
import { AuthChallenge } from '@/models/AuthChallenge';
import { User } from '@/models/User';
import { assertSameOrigin, setSession } from '@/lib/security';

const CHALLENGE_TTL_MS = 5 * 60 * 1000;

function messageFor(address: string, nonce: string) {
  return `Sign in to Gobboz.\nWallet: ${address}\nNonce: ${nonce}`;
}

export async function POST(request: NextRequest) {
  if (!assertSameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  try {
    const { walletAddress } = await request.json();
    if (typeof walletAddress !== 'string' || !isAddress(walletAddress)) {
      return NextResponse.json({ error: 'A valid wallet address is required.' }, { status: 400 });
    }
    const address = walletAddress.toLowerCase();
    const nonce = randomBytes(32).toString('base64url');
    await connectDB();
    await AuthChallenge.findOneAndUpdate(
      { walletAddress: address },
      { nonce, expiresAt: new Date(Date.now() + CHALLENGE_TTL_MS) },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return NextResponse.json({ message: messageFor(address, nonce) });
  } catch {
    return NextResponse.json({ error: 'Unable to start wallet authentication.' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  if (!assertSameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  try {
    const { walletAddress, signature } = await request.json();
    if (typeof walletAddress !== 'string' || typeof signature !== 'string' || !isAddress(walletAddress)) {
      return NextResponse.json({ error: 'A valid signed wallet request is required.' }, { status: 400 });
    }
    const address = walletAddress.toLowerCase();
    await connectDB();

    // Verify the wallet signature — no bypasses allowed.
    const challenge = await AuthChallenge.findOneAndDelete({ walletAddress: address, expiresAt: { $gt: new Date() } });
    if (!challenge) {
      return NextResponse.json({ error: 'No active challenge found. Request a new sign-in message.' }, { status: 401 });
    }
    const valid = await verifyMessage({
      address: address as `0x${string}`,
      message: messageFor(address, challenge.nonce),
      signature: signature as `0x${string}`
    }).catch(() => false);
    if (!valid) {
      return NextResponse.json({ error: 'Wallet signature could not be verified.' }, { status: 401 });
    }

    // Issue session cookie. DB user record is created later when the user
    // submits their Twitter handle (PUT /api/user). This prevents wallet-only
    // spam accounts from polluting the users collection.
    const existingUser = await User.findOne({ walletAddress: address }).lean();
    const response = NextResponse.json({
      verified: true,
      registered: !!existingUser  // tells the frontend whether to show the Twitter onboarding step
    });
    setSession(response, address);
    return response;
  } catch {
    return NextResponse.json({ error: 'Unable to authenticate wallet.' }, { status: 500 });
  }
}
