import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const port = process.env.PORT || 5000;

const app = express();

// Body parser middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use(logger);
app.use(auth);

// Error handler
app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server is running on port ${port}`));