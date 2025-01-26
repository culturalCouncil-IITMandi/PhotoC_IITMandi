import express from 'express';
import { imageFilters } from '../controllers/imageAccess.js'

const router = express.Router();
router.get('/', imageFilters);

export default router;