import express from 'express';
import path from 'path';
import cors from 'cors';

import { connectDB } from './helpers/mongoose.js';
import imageRoutes from './routes/imageUpload.js';

const port = process.env.PORT || 5000;
const app = express();

// Body parser middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// connecting mongodb
connectDB();

// Logging middleware
app.use(logger);
app.use(auth);

// Error handler
app.use(notFound);
app.use(errorHandler);

// routes
app.use('/api/images', imageRoutes);

app.listen(port, () => console.log(`Server is running on port ${port}`));