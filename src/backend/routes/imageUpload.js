import express from 'express'

import { uploadImages } from '../controllers/imageUpload.js'
import { isAuthenticated } from '../middleware/firebase.js'

const router = express.Router();
router.post('/upload', isAuthenticated, uploadImages); // REMINDER: Add auth middleware here

export default router;
