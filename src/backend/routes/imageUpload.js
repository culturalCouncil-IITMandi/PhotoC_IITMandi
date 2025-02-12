import express from 'express'

import { uploadImages } from '../controllers/imageUpload.js'
import { isAuthenticated } from '../middleware/firebase.js'
import { likePhoto, getLikes } from '../controllers/like.js'

const router = express.Router();
router.post('/upload', uploadImages); // REMINDER: Add auth middleware here
router.post('/like/:id', likePhoto);
router.get('/likes/:id', getLikes);

export default router;
