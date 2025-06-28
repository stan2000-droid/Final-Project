import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Use main uploads directory
        const uploadDir = path.join(__dirname, '..', 'uploads');
        
        // Create directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Create unique filename with timestamp
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, `${uniqueSuffix}-${file.originalname}`);
    }
});

// Configure upload middleware
export const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        // Check if file is a video
        if (file.mimetype.startsWith('video/')) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only videos are allowed.'));
        }
    },
    limits: {
        fileSize: 16000000000 // 16GB
    }
});

// Upload controller
export const uploadVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ 
                success: false, 
                message: 'No video file provided' 
            });
        }

        // Return success response with file details
        res.status(200).json({
            success: true,
            message: 'Video uploaded successfully',
            file: {
                filename: req.file.filename,
                path: req.file.path,
                size: req.file.size
            }
        });
    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ 
            success: false, 
            message: error.message || 'Error uploading video' 
        });
    }
};
