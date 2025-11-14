# How to Import JSON Files to MongoDB

This guide shows you how to import the JSON files directly into MongoDB Atlas or local MongoDB.

## 📁 JSON Files Created

1. **`traditional-foods.json`** - Contains 7 traditional Sri Lankan foods
2. **`daily-tips.json`** - Contains 3 daily health tips

## 🚀 Method 1: MongoDB Atlas (Easiest)

### Step 1: Open MongoDB Atlas
1. Go to https://cloud.mongodb.com
2. Log in and select your cluster
3. Click "Browse Collections"

### Step 2: Import Traditional Foods
1. Navigate to your database (e.g., `test`)
2. If `traditionalfoods` collection doesn't exist, create it:
   - Click "Create Collection"
   - Name: `traditionalfoods`
3. Click on the `traditionalfoods` collection
4. Click "Insert Document"
5. Click the `{}` icon (JSON view)
6. Copy the entire content from `traditional-foods.json`
7. Paste it (it's an array, so MongoDB will insert all documents)
8. Click "Insert"

### Step 3: Import Daily Tips
1. Create or select `dailytips` collection
2. Click "Insert Document"
3. Click `{}` icon
4. Copy content from `daily-tips.json`
5. Paste and click "Insert"

## 🔧 Method 2: Using MongoDB Compass

### Step 1: Connect to Database
1. Open MongoDB Compass
2. Connect using your connection string

### Step 2: Import Data
1. Select your database
2. Create collection: `traditionalfoods`
3. Click "Add Data" → "Import File"
4. Select `traditional-foods.json`
5. Choose "JSON" format
6. Click "Import"

Repeat for `daily-tips.json` into `dailytips` collection.

## 💻 Method 3: Using mongoimport (Command Line)

### For Traditional Foods:
```bash
mongoimport --uri="mongodb+srv://username:password@cluster.mongodb.net/test" \
  --collection=traditionalfoods \
  --file=traditional-foods.json \
  --jsonArray
```

### For Daily Tips:
```bash
mongoimport --uri="mongodb+srv://username:password@cluster.mongodb.net/test" \
  --collection=dailytips \
  --file=daily-tips.json \
  --jsonArray
```

**Note:** Replace the connection string with your actual MongoDB URI.

## 📋 Method 4: Using MongoDB Shell (mongosh)

```javascript
// Connect to your database
use test

// Load and insert traditional foods
db.traditionalfoods.insertMany([
  // Paste the array content from traditional-foods.json here
])

// Load and insert daily tips
db.dailytips.insertMany([
  // Paste the array content from daily-tips.json here
])
```

## ✅ Verify Import

After importing, verify the data:

### Using MongoDB Atlas:
- Browse Collections → Check `traditionalfoods` and `dailytips`
- You should see 7 foods and 3 tips

### Using API:
```bash
# Get all foods
curl http://localhost:5000/api/traditional-foods

# Get today's tip
curl http://localhost:5000/api/daily-tips/today
```

## 🎯 Quick Import in MongoDB Atlas

**Fastest Method:**
1. Open MongoDB Atlas → Browse Collections
2. Select your database
3. Click "Insert Document" in the collection
4. Switch to JSON view (`{}`)
5. Copy-paste the entire JSON array
6. Click "Insert"

MongoDB will automatically insert all documents from the array!

---

**Files ready for import:**
- ✅ `traditional-foods.json` (7 foods)
- ✅ `daily-tips.json` (3 tips)

