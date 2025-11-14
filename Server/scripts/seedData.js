import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/database.js';
import TraditionalFood from '../models/TraditionalFood.js';
import DailyTip from '../models/DailyTip.js';
import { sampleTraditionalFoods, sampleDailyTips } from '../data/sampleTraditionalFoods.js';

// Load environment variables
dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('🔄 Connecting to database...');
    await connectDB();
    console.log('✅ Connected to database');

    // Clear existing data (optional - comment out if you want to keep existing data)
    console.log('🗑️  Clearing existing data...');
    await TraditionalFood.deleteMany({});
    await DailyTip.deleteMany({});
    console.log('✅ Cleared existing data');

    // Insert Traditional Foods
    console.log('📦 Inserting traditional foods...');
    const insertedFoods = await TraditionalFood.insertMany(sampleTraditionalFoods);
    console.log(`✅ Inserted ${insertedFoods.length} traditional foods`);

    // Insert Daily Tips
    console.log('💡 Inserting daily tips...');
    const insertedTips = await DailyTip.insertMany(sampleDailyTips);
    console.log(`✅ Inserted ${insertedTips.length} daily tips`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   - Traditional Foods: ${insertedFoods.length}`);
    console.log(`   - Daily Tips: ${insertedTips.length}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();

