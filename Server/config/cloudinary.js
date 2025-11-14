import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

// Configure Cloudinary (only if credentials are provided)
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

// Configure Multer Storage
// Use memory storage as fallback - Cloudinary uploads will be handled separately
const storage = multer.memoryStorage();

export const upload = multer({ storage: storage });
export default cloudinary;

