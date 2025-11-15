// Script to check if all required environment variables are set
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

console.log('\n🔍 Checking Environment Variables...\n');
console.log('==========================================\n');

// Required variables
const required = [
  'PORT',
  'NODE_ENV',
  'MONGODB_URI',
  'JWT_SECRET',
  'JWT_EXPIRE',
  'CLIENT_URL',
];

// Optional variables
const optional = [
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'OPENAI_API_KEY',
  'OPENAI_MODEL',
  'HUGGINGFACE_API_KEY',
  'HUGGINGFACE_MODEL',
];

let hasErrors = false;
let hasWarnings = false;

// Check required variables
console.log('📋 REQUIRED VARIABLES:\n');
required.forEach((varName) => {
  const value = process.env[varName];
  if (!value || value.trim() === '') {
    console.log(`❌ ${varName}: NOT SET`);
    hasErrors = true;
  } else {
    // Mask sensitive values
    if (varName === 'JWT_SECRET' || varName === 'MONGODB_URI') {
      const masked = varName === 'JWT_SECRET' 
        ? (value.length > 10 ? `${value.substring(0, 10)}...` : '***')
        : value.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@'); // Mask MongoDB credentials
      console.log(`✅ ${varName}: SET (${masked})`);
    } else {
      console.log(`✅ ${varName}: SET (${value})`);
    }
  }
});

// Check optional variables
console.log('\n📋 OPTIONAL VARIABLES:\n');
optional.forEach((varName) => {
  const value = process.env[varName];
  if (!value || value.trim() === '') {
    console.log(`⚠️  ${varName}: NOT SET (Optional)`);
    
    // Show warnings for important optional features
    if (varName === 'OPENAI_API_KEY') {
      console.log('   ⚠️  LankaNutri Chatbot will not work without this!');
      hasWarnings = true;
    }
    if (varName === 'CLOUDINARY_CLOUD_NAME' || varName === 'CLOUDINARY_API_KEY') {
      console.log('   ⚠️  Image uploads will not work without Cloudinary credentials!');
      hasWarnings = true;
    }
  } else {
    // Mask sensitive values
    if (varName.includes('KEY') || varName.includes('SECRET')) {
      const masked = value.length > 10 ? `${value.substring(0, 10)}...` : '***';
      console.log(`✅ ${varName}: SET (${masked})`);
    } else {
      console.log(`✅ ${varName}: SET (${value})`);
    }
  }
});

// Check .env file exists
const envPath = path.join(__dirname, '../.env');
if (!fs.existsSync(envPath)) {
  console.log('\n❌ ERROR: .env file not found!');
  console.log(`   Expected location: ${envPath}`);
  console.log('   Please create a .env file based on .env.example');
  hasErrors = true;
} else {
  console.log('\n✅ .env file exists');
}

// Summary
console.log('\n==========================================');
console.log('📊 SUMMARY:\n');

if (hasErrors) {
  console.log('❌ ERRORS FOUND: Some required variables are missing!');
  console.log('   Please set all required variables in your .env file.');
  console.log('   Check .env.example for reference.');
  process.exit(1);
} else {
  console.log('✅ All required variables are set!');
}

if (hasWarnings) {
  console.log('⚠️  WARNINGS: Some optional features may not work.');
  console.log('   Check the optional variables above.');
}

// Additional checks
console.log('\n🔍 ADDITIONAL CHECKS:\n');

// Check JWT_SECRET strength
if (process.env.JWT_SECRET) {
  const jwtSecret = process.env.JWT_SECRET;
  if (jwtSecret.length < 32) {
    console.log('⚠️  WARNING: JWT_SECRET is less than 32 characters.');
    console.log('   For production, use a stronger secret (at least 32 characters).');
  } else if (jwtSecret === 'your_super_secret_jwt_key_change_this' || jwtSecret.includes('change_this')) {
    console.log('⚠️  WARNING: JWT_SECRET appears to be a default/example value.');
    console.log('   Please change this to a unique, random string for security!');
  } else {
    console.log('✅ JWT_SECRET: Strong enough');
  }
}

// Check OpenAI API key format
if (process.env.OPENAI_API_KEY) {
  const openaiKey = process.env.OPENAI_API_KEY;
  if (!openaiKey.startsWith('sk-')) {
    console.log('⚠️  WARNING: OPENAI_API_KEY does not start with "sk-"');
    console.log('   Please verify your OpenAI API key is correct.');
  } else {
    console.log('✅ OPENAI_API_KEY: Format looks correct');
  }
}

// Check MongoDB URI format
if (process.env.MONGODB_URI) {
  const mongoUri = process.env.MONGODB_URI;
  if (mongoUri.startsWith('mongodb://') || mongoUri.startsWith('mongodb+srv://')) {
    console.log('✅ MONGODB_URI: Format looks correct');
  } else {
    console.log('⚠️  WARNING: MONGODB_URI format may be incorrect');
    console.log('   Should start with "mongodb://" or "mongodb+srv://"');
  }
}

console.log('\n==========================================\n');

if (!hasErrors) {
  console.log('✅ Environment configuration looks good!');
  console.log('   You can start your server now.\n');
}

