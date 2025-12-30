import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import subjectsRouter from './routes/subjects.js';
import chaptersRouter from './routes/chapters.js';
import aiRouter from './routes/ai.js';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy for cloud hosting (Render, etc.)
app.set('trust proxy', 1);

// Middleware
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], allowedHeaders: ['Content-Type', 'Authorization'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.use('/api/subjects', subjectsRouter);
app.use('/api/chapters', chaptersRouter);
app.use('/api/ai', aiRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'Revision Platform API'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Revision Platform API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      subjects: '/api/subjects',
      chapters: '/api/chapters/:subjectId',
      aiGenerate: '/api/ai/generate',
      aiChat: '/api/ai/chat'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: {
      message: err.message || 'Internal server error',
      status: err.status || 500
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.path 
  });
});

// Start server
app.listen(PORT, () => {
  console.log('\nRevision Platform Backend Server');
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('Ready to accept requests\n');
});

export default app;
