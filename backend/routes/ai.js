import express from 'express';
import { callVertexAI, callVertexAIChat } from '../services/vertexAI.js';

const router = express.Router();

// Generate initial AI content based on mode, subject, and chapter
router.post('/generate', async (req, res) => {
  try {
    const { mode, subject, chapter, request } = req.body;

    if (!mode || !subject || !chapter) {
      return res.status(400).json({ 
        error: 'Missing required fields: mode, subject, chapter' 
      });
    }

    console.log(`Generating ${mode} content for ${subject} - ${chapter}`);

    // Call Vertex AI service
    const aiResponse = await callVertexAI({
      mode,
      subject,
      chapter,
      request: request || `Generate ${mode} content for ${chapter} in ${subject}`
    });

    res.json({
      content: aiResponse,
      metadata: {
        mode,
        subject,
        chapter,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Error generating AI content:', error);
    res.status(500).json({ 
      error: 'Failed to generate content',
      message: error.message 
    });
  }
});

// Handle chat messages with context
router.post('/chat', async (req, res) => {
  try {
    const { mode, subject, chapter, message, history } = req.body;

    if (!mode || !subject || !chapter || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields: mode, subject, chapter, message' 
      });
    }

    console.log(`Processing chat message for ${subject} - ${chapter}`);

    // Call Vertex AI chat service with history
    const aiResponse = await callVertexAIChat({
      mode,
      subject,
      chapter,
      message,
      history: history || []
    });

    res.json({
      content: aiResponse,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error processing chat message:', error);
    res.status(500).json({ 
      error: 'Failed to process message',
      message: error.message 
    });
  }
});

// Test endpoint (uses mock responses when Vertex AI is not configured)
router.get('/test', (req, res) => {
  res.json({
    message: 'AI service is running',
    vertexAIConfigured: !!process.env.GOOGLE_CLOUD_PROJECT_ID,
    timestamp: new Date().toISOString()
  });
});

export default router;
