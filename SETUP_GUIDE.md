# MERN Stack Nutrition Advisor Setup Guide

## Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account (for image uploads)
- Git

## Step 1: Environment Variables Setup

### Server Environment Variables
Create a `.env` file in the `Server` folder with the following:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/smart-diet-sl
# OR use MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/smart-diet-sl

# JWT Secret
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL (for CORS)
CLIENT_URL=http://localhost:5173
```

### How to Get Cloudinary Credentials:
1. Go to https://cloudinary.com and sign up/login
2. Go to Dashboard
3. Copy your Cloud Name, API Key, and API Secret

## Step 2: Install Dependencies

### Server Dependencies
Navigate to the `Server` folder and run:
```bash
cd Server
npm install
```

**Note:** If you encounter issues with `multer-storage-cloudinary`, you may need to check the import. The package is already added to `package.json`. If the import fails, try:
```bash
npm install multer-storage-cloudinary --save
```

### Client Dependencies
Navigate to the `Client` folder and run:
```bash
cd Client
npm install
```

Additional packages that will be installed:
- `@reduxjs/toolkit` - Redux state management
- `react-redux` - React bindings for Redux
- `react-router-dom` - Routing
- `axios` - HTTP client
- `react-hot-toast` - Toast notifications

## Step 3: MongoDB Setup

### Option A: Local MongoDB
1. Install MongoDB from https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/smart-diet-sl`

### Option B: MongoDB Atlas (Cloud - Recommended for beginners)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster (free tier available)
4. Create a database user
5. Whitelist your IP address (or use 0.0.0.0/0 for development)
6. Get your connection string and add it to `.env`

## Step 4: Run the Application

### Start the Server
```bash
cd Server
npm run dev
```
Server will run on http://localhost:5000

### Start the Client
```bash
cd Client
npm run dev
```
Client will run on http://localhost:5173

## Step 5: Project Structure

### Server Structure (Already Created)
```
Server/
├── config/          # Database and other configurations
├── controllers/     # Route controllers (business logic)
├── middlewares/     # Custom middlewares (auth, validation)
├── models/          # Mongoose models (User, Product, etc.)
├── routes/          # API routes
├── utils/           # Utility functions
└── server.js        # Entry point
```

### Client Structure (Will be Created)
```
Client/src/
├── components/      # Reusable components
│   ├── common/      # Common components (Header, Footer, etc.)
│   └── ui/          # UI components (Button, Card, etc.)
├── pages/           # Page components
│   ├── auth/        # Login, Register pages
│   ├── home/        # Home page
│   ├── products/    # Products listing
│   ├── cart/        # Cart page
│   ├── checkout/    # Checkout page
│   ├── calculator/  # Nutrition Calculator
│   ├── diet-plans/  # Diet Plans page
│   └── profile/     # User Profile page
├── store/           # Redux store
│   ├── slices/      # Redux slices
│   └── store.js     # Store configuration
├── utils/           # Utility functions
├── services/        # API service functions
├── hooks/           # Custom React hooks
└── App.jsx          # Main App component
```

## Step 6: Testing the Setup

1. Start both server and client
2. Check server logs for "MongoDB Connected" message
3. Open browser to http://localhost:5173
4. You should see the application running

## Troubleshooting

### MongoDB Connection Issues
- Check if MongoDB is running (local) or connection string is correct (Atlas)
- Verify credentials in `.env` file

### Port Already in Use
- Change PORT in `.env` file
- Or kill the process using the port

### CORS Errors
- Make sure CLIENT_URL in server `.env` matches your client URL
- Check server CORS configuration

## Next Steps
After setup is complete, the following features will be implemented:
- ✅ User Registration & Login
- ✅ JWT Authentication
- ✅ Product Management
- ✅ Shopping Cart
- ✅ Checkout Process
- ✅ Nutrition Calculator
- ✅ Diet Plans
- ✅ User Profile
- ✅ Image Upload with Cloudinary

