import express from 'express';
import { upload, uploadVideo } from '../controllers/upload.js';

const router = express.Router();

// Upload endpoint
router.post('/', upload.single('file'), uploadVideo);

export default router;
