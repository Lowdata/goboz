import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { assertSameOrigin, getAuthenticatedWallet, publicUser } from '@/lib/security';

export async function POST(request: NextRequest) {
  if (!assertSameOrigin(request)) return NextResponse.json({ error: 'Invalid origin.' }, { status: 403 });
  
  const walletAddress = getAuthenticatedWallet(request);
  if (!walletAddress) return NextResponse.json({ error: 'Wallet required.' }, { status: 401 });
  
  try {
    await connectDB();
    const user = await User.findOneAndUpdate(
      { walletAddress },
      { $inc: { pullsLeft: 1 } },
      { new: true }
    );
    
    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, user: publicUser(user) });
  } catch (error) {
    console.error('Failed to add bonus pull:', error);
    return NextResponse.json({ error: 'Failed to add bonus.' }, { status: 500 });
  }
}
