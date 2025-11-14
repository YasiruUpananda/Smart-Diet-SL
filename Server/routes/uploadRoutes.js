import express from 'express';
import { protect } from '../middlewares/auth.js';
import { upload } from '../config/cloudinary.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// @desc    Upload image
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Check if Cloudinary is configured
    if (!process.env.CLOUDINARY_CLOUD_NAME || 
        !process.env.CLOUDINARY_API_KEY || 
        !process.env.CLOUDINARY_API_SECRET) {
      return res.status(400).json({
        message: 'Cloudinary not configured. Please add Cloudinary credentials to .env file',
      });
    }

    // If file is in memory buffer (from multer.memoryStorage)
    if (req.file.buffer) {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'smart-diet-sl',
            resource_type: 'image',
            allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
          },
          (error, result) => {
            if (error) {
              console.error('Cloudinary upload error:', error);
              reject(error);
            } else {
              resolve(
                res.json({
                  message: 'Image uploaded successfully',
                  url: result.secure_url,
                  publicId: result.public_id,
                  width: result.width,
                  height: result.height,
                  format: result.format,
                })
              );
            }
          }
        );

        uploadStream.end(req.file.buffer);
      });
    }

    // If file path exists (from CloudinaryStorage)
    if (req.file.path) {
      return res.json({
        message: 'Image uploaded successfully',
        url: req.file.path,
        publicId: req.file.filename,
      });
    }

    // Fallback
    res.status(400).json({
      message: 'Unable to process file upload',
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      message: 'Failed to upload image',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error',
    });
  }
});

export default router;

