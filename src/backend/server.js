import express from 'express';
import path from 'path';
import cors from 'cors';

import logger from './middleware/logger.js';
import auth from './middleware/auth.js';
import notFound from './middleware/notFound.js';
import errorHandler from './middleware/error.js'
import { connectDB } from './helpers/mongoose.js';
import { initFirebase } from './controllers/user.js';

import imageRoutes from './routes/imageUpload.js';
import approvalRoutes from './routes/approval.js';
import imageAccessRoutes from './routes/imageAccess.js';
import userRoutes from './routes/user.js';

const port = process.env.PORT || 5000;
const app = express();

// Body parser middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// connecting mongodb
connectDB();
initFirebase();

// generating new API token
import { generateToken } from './helpers/jwtToken.js';
console.log(generateToken({ id: 1, email: 'divyansh.bt@gmail.com'}))

// Logging middleware
app.use(logger);
// app.use(auth);

// routes
app.use('/api/images', imageRoutes);
app.use('/api/approve', approvalRoutes);
app.use('/api/filter', imageAccessRoutes);
app.use('/api/user', userRoutes);

// Error handler
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}`));