import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config(); // Đọc file .env

// Cấu hình Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET,
});