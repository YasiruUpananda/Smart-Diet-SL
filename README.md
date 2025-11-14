# Smart Diet SL - MERN Stack Nutrition Advisor

A comprehensive MERN stack application for managing nutrition and diet plans specifically designed for Sri Lankan diets.

## Features

- ✅ User Registration & Login with JWT Authentication
- ✅ Product Management (Browse, Search, Filter)
- ✅ Shopping Cart & Checkout
- ✅ Nutrition Calculator
- ✅ Recommended Diet Plans
- ✅ User Profile Management
- ✅ Image Upload with Cloudinary
- ✅ Responsive Design with Tailwind CSS
- ✅ State Management with Redux Toolkit

## Tech Stack

### Frontend
- React 19
- Redux Toolkit
- React Router DOM
- Axios
- Tailwind CSS
- React Hot Toast

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- Cloudinary (Image Upload)
- Bcrypt (Password Hashing)

## Project Structure

```
Smart-Diet-SL/
├── Client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   └── common/    # Header, Footer, etc.
│   │   ├── pages/         # Page components
│   │   │   ├── auth/      # Login, Register
│   │   │   ├── home/      # Home page
│   │   │   ├── products/  # Products listing & detail
│   │   │   ├── cart/      # Shopping cart
│   │   │   ├── checkout/  # Checkout page
│   │   │   ├── calculator/# Nutrition calculator
│   │   │   ├── diet-plans/# Diet plans
│   │   │   └── profile/   # User profile
│   │   ├── store/         # Redux store
│   │   │   └── slices/    # Redux slices
│   │   ├── services/      # API services
│   │   └── App.jsx        # Main App component
│   └── package.json
│
└── Server/                # Node.js Backend
    ├── config/           # Database & Cloudinary config
    ├── controllers/      # Route controllers
    ├── middlewares/      # Auth middleware
    ├── models/          # Mongoose models
    ├── routes/          # API routes
    ├── utils/           # Utility functions
    └── server.js        # Entry point
```

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Cloudinary account
- Git

### Step 1: Clone the Repository
```bash
git clone <your-repo-url>
cd Smart-Diet-SL
```

### Step 2: Server Setup

1. Navigate to Server directory:
```bash
cd Server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the `Server` directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/smart-diet-sl
JWT_SECRET=your_super_secret_jwt_key_change_this
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLIENT_URL=http://localhost:5173
```

4. Start the server:
```bash
npm run dev
```

Server will run on http://localhost:5000

### Step 3: Client Setup

1. Navigate to Client directory (in a new terminal):
```bash
cd Client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file in the `Client` directory (optional):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the client:
```bash
npm run dev
```

Client will run on http://localhost:5173

## Environment Variables

### Server (.env)
- `PORT` - Server port (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRE` - JWT expiration time
- `CLOUDINARY_CLOUD_NAME` - Your Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Your Cloudinary API key
- `CLOUDINARY_API_SECRET` - Your Cloudinary API secret
- `CLIENT_URL` - Frontend URL for CORS

### Client (.env)
- `VITE_API_URL` - Backend API URL (default: http://localhost:5000/api)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create order (Protected)
- `GET /api/orders/myorders` - Get user orders (Protected)
- `GET /api/orders/:id` - Get order by ID (Protected)
- `PUT /api/orders/:id/pay` - Update order to paid (Protected)
- `PUT /api/orders/:id/deliver` - Update order to delivered (Admin)

### Diet Plans
- `GET /api/diet-plans` - Get all diet plans
- `GET /api/diet-plans/:id` - Get single diet plan
- `POST /api/diet-plans` - Create diet plan (Admin)
- `PUT /api/diet-plans/:id` - Update diet plan (Admin)
- `DELETE /api/diet-plans/:id` - Delete diet plan (Admin)

## Getting Cloudinary Credentials

1. Go to https://cloudinary.com
2. Sign up or log in
3. Go to Dashboard
4. Copy your:
   - Cloud Name
   - API Key
   - API Secret

## Getting MongoDB Connection String

### Local MongoDB
```
mongodb://localhost:27017/smart-diet-sl
```

### MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a new cluster
4. Create a database user
5. Whitelist your IP (0.0.0.0/0 for development)
6. Get connection string:
```
mongodb+srv://username:password@cluster.mongodb.net/smart-diet-sl
```

## Usage

1. Start both server and client
2. Register a new account or login
3. Browse products and add to cart
4. Use the nutrition calculator to track your intake
5. View recommended diet plans
6. Update your profile

## Development

### Server Scripts
- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

### Client Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Notes for Beginners

1. **Always set up environment variables** before running the application
2. **Make sure MongoDB is running** (local) or connection string is correct (Atlas)
3. **Cloudinary credentials are required** for image uploads
4. **JWT_SECRET should be a strong random string** in production
5. **CORS is configured** to allow requests from the client URL

## Troubleshooting

### MongoDB Connection Issues
- Check if MongoDB is running (local)
- Verify connection string in `.env`
- Check network access (Atlas)

### CORS Errors
- Verify `CLIENT_URL` in server `.env` matches your client URL
- Check server CORS configuration

### Image Upload Issues
- Verify Cloudinary credentials
- Check file size limits
- Ensure correct file formats (jpg, png, etc.)

## License

ISC

## Author

Smart Diet SL Development Team
