import express from 'express';
import { imageFilters } from '../controllers/imageAccess.js';

import { uploadImages } from '../controllers/imageUpload.js'

const router = express.Router();
router.post('/upload', uploadImages); // REMINDER: Add auth middleware here
router.get('/images', imageFilters);

export default router;
