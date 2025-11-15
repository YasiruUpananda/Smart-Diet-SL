# How to Start the Server

## Quick Start

1. **Navigate to Server folder:**
   ```bash
   cd Smart-Diet-SL/Server
   ```

2. **Install dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Make sure you have a `.env` file** with at least:
   ```
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. **Start the server:**
   ```bash
   npm run dev
   ```
   or
   ```bash
   npm start
   ```

## Troubleshooting

### If server crashes on startup:

1. **Check the terminal output** - The error handlers will show the exact error
2. **Check your `.env` file** - Make sure `MONGODB_URI` is set
3. **Check if MongoDB is running** (if using local MongoDB)
4. **Check if port 5000 is already in use**

### Common Errors:

- **"MONGODB_URI is not defined"** → Add `MONGODB_URI` to your `.env` file
- **"Cannot find module"** → Run `npm install`
- **"Port already in use"** → Change `PORT` in `.env` or kill the process using port 5000

## Verify Server is Running

Once started, you should see:
```
✅ Database initialization complete
Server running in development mode on port 5000
```

Then test: http://localhost:5000/api/health


