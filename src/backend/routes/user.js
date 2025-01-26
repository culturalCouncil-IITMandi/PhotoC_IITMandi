import express from 'express';

import { userLogin } from '../controllers/user.js'

const router = express.Router();

router.post('/login', userLogin);

export default router;