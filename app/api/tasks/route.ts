import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Task, INITIAL_DB_TASKS } from '@/models/Task';

export async function GET() {
  try {
    await connectDB();

    const count = await Task.countDocuments();
    if (count === 0) {
      await Task.insertMany(INITIAL_DB_TASKS);
    }

    const tasks = await Task.find({}).sort({ createdAt: 1 });
    return NextResponse.json(tasks);
  } catch {
    console.error('Error fetching tasks from DB.');
    return NextResponse.json(
      { error: 'Internal server error fetching tasks.' },
      { status: 500 }
    );
  }
}
