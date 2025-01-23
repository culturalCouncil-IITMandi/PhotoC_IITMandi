import express from 'express'

import { uploadImages } from '../controllers/imageUpload.js'

const router = express.Router();
router.post('/upload', uploadImages); // REMINDER: Add auth middleware here

export default router;
