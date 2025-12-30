import express from 'express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get chapters for a specific subject
router.get('/:subjectId', (req, res) => {
  try {
    const dataPath = join(__dirname, '../data/chapters.json');
    const data = readFileSync(dataPath, 'utf-8');
    const allChapters = JSON.parse(data);
    
    const subjectChapters = allChapters.filter(
      chapter => chapter.subjectId === req.params.subjectId
    );
    
    if (subjectChapters.length === 0) {
      return res.status(404).json({ error: 'No chapters found for this subject' });
    }
    
    res.json(subjectChapters);
  } catch (error) {
    console.error('Error reading chapters:', error);
    res.status(500).json({ error: 'Failed to load chapters' });
  }
});

// Get a specific chapter by ID
router.get('/:subjectId/:chapterId', (req, res) => {
  try {
    const dataPath = join(__dirname, '../data/chapters.json');
    const data = readFileSync(dataPath, 'utf-8');
    const allChapters = JSON.parse(data);
    
    const chapter = allChapters.find(
      c => c.id === req.params.chapterId && c.subjectId === req.params.subjectId
    );
    
    if (!chapter) {
      return res.status(404).json({ error: 'Chapter not found' });
    }
    
    res.json(chapter);
  } catch (error) {
    console.error('Error reading chapter:', error);
    res.status(500).json({ error: 'Failed to load chapter' });
  }
});

export default router;
