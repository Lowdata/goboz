import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';
import { Task } from '@/models/Task';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { walletAddress, taskId } = body;

    if (!walletAddress || !taskId) {
      return NextResponse.json(
        { error: 'walletAddress and taskId are required.' },
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

    let task = await Task.findOne({ id: taskId });
    if (!task) {
      const defaultTasks: Record<string, number> = {
        connect_wallet: 3,
        follow_x: 1,
        like_rt: 1,
        refer_friend: 2,
        daily_claim: 1,
        share_result: 1
      };
      if (taskId in defaultTasks) {
        task = await Task.create({
          id: taskId,
          title: taskId,
          subtitle: 'Completed task',
          rewardText: `+${defaultTasks[taskId]} PULLS`,
          rewardPulls: defaultTasks[taskId],
          type: 'social'
        });
      } else {
        return NextResponse.json(
          { error: 'Task not found in DB.' },
          { status: 404 }
        );
      }
    }

    // Enforce once a day for daily_claim
    if (taskId === 'daily_claim') {
      const todayStr = new Date().toDateString();
      if (
        user.lastDailyClaim &&
        new Date(user.lastDailyClaim).toDateString() === todayStr
      ) {
        return NextResponse.json(
          { error: 'Daily claim already used today! Come back tomorrow.' },
          { status: 400 }
        );
      }
      user.lastDailyClaim = new Date();
    } else if (
      taskId !== 'refer_friend' &&
      user.completedTasks.includes(taskId)
    ) {
      return NextResponse.json(
        { error: 'Task already completed!' },
        { status: 400 }
      );
    }

    // Award pulls
    user.pullsLeft += task.rewardPulls;

    if (!user.completedTasks.includes(taskId)) {
      user.completedTasks.push(taskId);
    }

    await user.save();

    return NextResponse.json({
      success: true,
      user,
      rewardPulls: task.rewardPulls
    });
  } catch (error: any) {
    console.error('Error completing task:', error);
    return NextResponse.json(
      { error: 'Internal server error completing task.' },
      { status: 500 }
    );
  }
}
