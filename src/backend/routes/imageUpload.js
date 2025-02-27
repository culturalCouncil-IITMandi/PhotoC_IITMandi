import express from 'express'

import { uploadImages } from '../controllers/imageUpload.js'
import { likePhoto, getLikes, downloadPhoto } from '../controllers/like.js'

const router = express.Router();
router.post('/upload', uploadImages); // REMINDER: Add auth middleware here
router.post('/like/:id', likePhoto);
router.get('/likes/:id', getLikes);
router.get('/download/:id', downloadPhoto);

export default router;
