import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load the environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Make sure to export INITIAL_DB_TASKS if you haven't already. 
// Note: In development with ts-node, we can just import it.
import { Task, INITIAL_DB_TASKS } from '../models/Task';

async function seedDatabase() {
  const uri = process.env.MONGO_URI_PROD || process.env.MONGO_URI;

  if (!uri) {
    console.error('❌ MONGO_URI_PROD is missing in .env.local');
    process.exit(1);
  }

  try {
    console.log(`⏳ Connecting to MongoDB at ${uri.split('@')[1] || uri}...`);
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB.');

    console.log('⏳ Clearing old tasks that are no longer in our list...');
    await Task.deleteMany({ id: { $nin: INITIAL_DB_TASKS.map((t) => t.id) } });

    console.log('⏳ Seeding tasks...');
    for (const item of INITIAL_DB_TASKS) {
      await Task.findOneAndUpdate({ id: item.id }, item, { upsert: true });
      console.log(`  - Seeded task: ${item.id}`);
    }

    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();
