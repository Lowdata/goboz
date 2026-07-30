import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { Task } from '@/models/Task';
import { assertSameOrigin, getAuthenticatedWallet, publicUser } from '@/lib/security';

function startOfToday() {
  const now = new Date();
  return new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
}

export async function POST(request: NextRequest) {
  if (!assertSameOrigin(request)) return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 });
  const walletAddress = getAuthenticatedWallet(request);
  if (!walletAddress) return NextResponse.json({ error: 'Wallet authentication required.' }, { status: 401 });
  try {
    const { taskId } = await request.json();
    if (typeof taskId !== 'string' || !/^[a-z_]{2,40}$/.test(taskId)) {
      return NextResponse.json({ error: 'Invalid task.' }, { status: 400 });
    }
    if (taskId === 'refer_friend') return NextResponse.json({ error: 'Referral rewards are granted when a friend applies your code.' }, { status: 400 });
    await connectDB();
    const task = await Task.findOne({ id: taskId }).lean();
    if (!task || taskId === 'connect_wallet') return NextResponse.json({ error: 'Task not available.' }, { status: 404 });

    const filter: Record<string, unknown> = { walletAddress };
    const update: Record<string, unknown> = { $inc: { pullsLeft: task.rewardPulls }, $addToSet: { completedTasks: taskId } };
    if (taskId === 'daily_claim') {
      filter.$or = [{ lastDailyClaim: null }, { lastDailyClaim: { $lt: startOfToday() } }];
      update.$set = { lastDailyClaim: new Date() };
    } else {
      filter.completedTasks = { $ne: taskId };
    }
    const user = await User.findOneAndUpdate(filter, update, { new: true });
    if (!user) {
      return NextResponse.json({ error: taskId === 'daily_claim' ? 'Daily claim already used today.' : 'Task already completed.' }, { status: 409 });
    }
    return NextResponse.json({ success: true, user: publicUser(user), rewardPulls: task.rewardPulls });
  } catch {
    return NextResponse.json({ error: 'Unable to complete task.' }, { status: 500 });
  }
}
