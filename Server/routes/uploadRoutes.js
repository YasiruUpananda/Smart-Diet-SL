import express from 'express';
import { protect } from '../middlewares/auth.js';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import { v4 as uuid } from 'uuid';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Configure Cloudinary
const hasCloudinaryConfig = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_API_KEY && 
  process.env.CLOUDINARY_API_SECRET;

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('✅ Cloudinary configured');
} else {
  console.warn('⚠️  Cloudinary credentials not found in .env file');
  console.warn('   Missing:', {
    cloud_name: !process.env.CLOUDINARY_CLOUD_NAME,
    api_key: !process.env.CLOUDINARY_API_KEY,
    api_secret: !process.env.CLOUDINARY_API_SECRET,
  });
}

// Multer temp storage - saves files to uploads/ directory
const upload = multer({ 
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log('📁 Created uploads directory');
}

// @desc    Upload image
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res) => {
  let tempFilePath = null;
  
  try {
    console.log('📥 Upload request received');
    console.log('   File:', req.file ? req.file.originalname : 'No file');
    console.log('   User:', req.user ? req.user.email : 'No user');

    if (!req.file) {
      console.error('❌ No file in request');
      return res.status(400).json({ message: 'No file uploaded' });
    }

    tempFilePath = req.file.path;
    console.log('   Temp file path:', tempFilePath);
    console.log('   File exists:', fs.existsSync(tempFilePath));

    // Check if Cloudinary is configured
    if (!hasCloudinaryConfig) {
      console.error('❌ Cloudinary not configured');
      // Clean up temp file
      if (tempFilePath && fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      return res.status(400).json({
        message: 'Cloudinary not configured. Please add Cloudinary credentials to .env file',
      });
    }

    console.log('📤 Uploading to Cloudinary:', req.file.originalname);
    console.log('   File size:', req.file.size, 'bytes');
    console.log('   File type:', req.file.mimetype);

    // Upload to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(tempFilePath, {
      folder: 'smart-diet-sl/products',
      public_id: uuid(),
      resource_type: 'image',
    });

    console.log('✅ Upload successful!');
    console.log('   URL:', uploadResult.secure_url);

    // Remove temp file after successful upload
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
        console.log('🗑️  Temp file removed');
      } catch (unlinkError) {
        console.error('⚠️  Error removing temp file:', unlinkError);
      }
    }

    return res.json({
      message: 'Image uploaded successfully',
      url: uploadResult.secure_url,
      imageUrl: uploadResult.secure_url,
      path: uploadResult.secure_url,
      publicId: uploadResult.public_id,
    });
  } catch (error) {
    // Clean up temp file if upload failed
    if (tempFilePath && fs.existsSync(tempFilePath)) {
      try {
        fs.unlinkSync(tempFilePath);
        console.log('🗑️  Cleaned up temp file after error');
      } catch (unlinkError) {
        console.error('⚠️  Error removing temp file:', unlinkError);
      }
    }

    console.error('❌ Upload error occurred');
    console.error('   Error name:', error.name);
    console.error('   Error message:', error.message);
    if (error.http_code) {
      console.error('   HTTP code:', error.http_code);
    }
    if (error.stack) {
      console.error('   Stack:', error.stack);
    }

    return res.status(500).json({
      message: 'Upload failed',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
});

export default router;