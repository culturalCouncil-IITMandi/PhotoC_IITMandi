import express from 'express';

import { approvePost, delApprovePost, getApproved, disapprovePost } from '../controllers/approval.js';

const router = express.Router();

router.post("/:id", approvePost);
router.delete("/:id", delApprovePost);
router.get("/", getApproved);
router.post("/disapprove/:id", disapprovePost);

export default router;