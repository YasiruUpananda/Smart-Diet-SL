# How to Use Sample Traditional Foods Data

This guide explains how to populate your database with the sample Sri Lankan traditional foods and daily tips data.

## 📁 File Location

The sample data file is located at:
```
Server/data/sampleTraditionalFoods.js
```

This file contains:
- **sampleTraditionalFoods**: Array of traditional Sri Lankan foods with nutritional data
- **sampleDailyTips**: Array of daily health tips in multiple languages

## 🚀 Method 1: Using the Seed Script (Recommended)

### Step 1: Make sure your database is configured

Ensure your `Server/.env` file has the correct `MONGODB_URI`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/test
```

### Step 2: Run the seed script

Navigate to the Server directory and run:

```bash
cd Server
npm run seed
```

This will:
- ✅ Connect to your database
- ✅ Clear existing traditional foods and daily tips (optional - you can modify the script)
- ✅ Insert all sample foods
- ✅ Insert all sample daily tips
- ✅ Show a summary of what was inserted

### Expected Output:

```
🔄 Connecting to database...
✅ Connected to database
🗑️  Clearing existing data...
✅ Cleared existing data
📦 Inserting traditional foods...
✅ Inserted 7 traditional foods
💡 Inserting daily tips...
✅ Inserted 3 daily tips

🎉 Database seeding completed successfully!

📊 Summary:
   - Traditional Foods: 7
   - Daily Tips: 3
```

## 🔧 Method 2: Manual Insertion via MongoDB Compass/Atlas

### Option A: Using MongoDB Atlas Data Explorer

1. Open MongoDB Atlas and go to your cluster
2. Click on "Browse Collections"
3. Select your database (e.g., `test`)
4. Find or create the `traditionalfoods` collection
5. Click "Insert Document"
6. Copy the JSON from one of the food objects in `sampleTraditionalFoods.js`
7. Paste and click "Insert"
8. Repeat for all foods

### Option B: Using MongoDB Compass

1. Connect to your MongoDB instance
2. Navigate to your database
3. Create a new collection: `traditionalfoods`
4. Click "Add Data" → "Insert Document"
5. Copy and paste the JSON data from the sample file
6. Click "Insert"

## 📝 Method 3: Using Node.js Script Directly

You can also create a custom script:

```javascript
// customSeed.js
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import TraditionalFood from './models/TraditionalFood.js';
import { sampleTraditionalFoods } from './data/sampleTraditionalFoods.js';

dotenv.config();

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await TraditionalFood.insertMany(sampleTraditionalFoods);
  console.log('Data seeded!');
  process.exit(0);
}

seed();
```

Run with:
```bash
node customSeed.js
```

## 📊 What Gets Inserted

### Traditional Foods (7 items):
1. **Suwandel Rice** - Low GI rice variety
2. **Kekulu Rice** - Popular traditional rice
3. **Kurakkan (Finger Millet)** - High calcium grain
4. **Gotukola** - Iron-rich leafy green
5. **Manioc (Cassava)** - Root vegetable
6. **Dhal (Lentils)** - High protein curry
7. **Beli Mal Tea** - Traditional herbal tea

### Daily Tips (3 items):
1. Weight loss tip about Manioc substitution
2. Cooking tip about reducing oil in dhal
3. General health tip about Gotukola

## ⚙️ Customizing the Seed Script

### To Keep Existing Data

Edit `Server/scripts/seedData.js` and comment out the delete operations:

```javascript
// Comment out these lines if you want to keep existing data
// await TraditionalFood.deleteMany({});
// await DailyTip.deleteMany({});
```

### To Add More Data

1. Edit `Server/data/sampleTraditionalFoods.js`
2. Add more food objects to the `sampleTraditionalFoods` array
3. Run `npm run seed` again

### To Seed Only Specific Categories

Modify the seed script to filter:

```javascript
// Only seed rice varieties
const riceFoods = sampleTraditionalFoods.filter(food => food.category === 'rice');
await TraditionalFood.insertMany(riceFoods);
```

## 🔍 Verifying the Data

After seeding, you can verify the data was inserted:

### Using API:
```bash
# Get all traditional foods
curl http://localhost:5000/api/traditional-foods

# Get foods by category
curl http://localhost:5000/api/traditional-foods?category=rice

# Get today's tip
curl http://localhost:5000/api/daily-tips/today
```

### Using MongoDB:
```javascript
// In MongoDB shell or Compass
db.traditionalfoods.find().pretty()
db.dailytips.find().pretty()
```

## 🐛 Troubleshooting

### Error: "Cannot find module"
Make sure you're running from the Server directory:
```bash
cd Server
npm run seed
```

### Error: "MONGODB_URI is not defined"
Check that your `.env` file exists in the `Server` directory and has `MONGODB_URI` set.

### Error: "Connection timeout"
- Check your internet connection
- Verify MongoDB Atlas IP whitelist includes your IP
- Check your connection string is correct

### Data Not Appearing
- Check you're looking at the correct database
- Verify the collection names: `traditionalfoods` and `dailytips`
- Check server logs for any errors

## 📚 Next Steps

After seeding:
1. ✅ Test the Amma's Kitchen visualizer at `/ammas-kitchen`
2. ✅ Check the daily tip on the home page
3. ✅ Try generating a plate at `/sri-lankan-plates`
4. ✅ Add more foods to the sample data file as needed

## 💡 Tips

- **Backup First**: If you have important data, backup your database before running the seed script
- **Incremental Updates**: You can run the seed script multiple times (it will clear and re-insert)
- **Custom Data**: Feel free to modify the sample data file to add your own traditional foods
- **Language Support**: All foods include English, Sinhala, and Tamil translations

---

Happy seeding! 🌱

