import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { Task } from '@/models/Task';
import { assertSameOrigin, getAuthenticatedWallet, publicUser } from '@/lib/security';

/**
 * POST /api/pull/bonus
 *
 * Awards +1 pull for sharing a result card. Internally this completes the
 * "share_result" task, so the $addToSet filter makes it fully idempotent —
 * a user can only claim this bonus once regardless of how many times the
 * endpoint is called.
 */
export async function POST(request: NextRequest) {
  if (!assertSameOrigin(request)) return NextResponse.json({ error: 'Invalid origin.' }, { status: 403 });

  const walletAddress = getAuthenticatedWallet(request);
  if (!walletAddress) return NextResponse.json({ error: 'Wallet required.' }, { status: 401 });

  try {
    await connectDB();

    const task = await Task.findOne({ id: 'share_result' }).lean();
    if (!task) return NextResponse.json({ error: 'Task not configured.' }, { status: 500 });

    // Atomic: only succeeds if share_result has NOT already been completed.
    const user = await User.findOneAndUpdate(
      { walletAddress, completedTasks: { $ne: 'share_result' } },
      {
        $inc: { pullsLeft: task.rewardPulls },
        $addToSet: { completedTasks: 'share_result' }
      },
      { new: true }
    );

    if (!user) {
      // Either user not found or bonus already claimed.
      const existing = await User.findOne({ walletAddress }).lean();
      if (!existing) return NextResponse.json({ error: 'User not found.' }, { status: 404 });
      return NextResponse.json({ error: 'Share bonus already claimed.' }, { status: 409 });
    }

    return NextResponse.json({ success: true, user: publicUser(user) });
  } catch (error) {
    console.error('Failed to add bonus pull:', error);
    return NextResponse.json({ error: 'Failed to add bonus.' }, { status: 500 });
  }
}
