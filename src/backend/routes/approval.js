import express from 'express';

import { approvePost, delApprovePost, getApproved } from '../controllers/approval.js';

const router = express.Router();

router.post("/:id", approvePost);
router.delete("/:id", delApprovePost);
router.get("/", getApproved);

export default router;