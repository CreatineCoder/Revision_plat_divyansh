import express from 'express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
console.log('this is filename', __filename );
const __dirname = dirname(__filename);
console.log("__dirname", __dirname);

// Get all subjects
router.get('/', (req, res) => {
  try {
    const dataPath = join(__dirname, '../data/subjects.json');
    console.log("dataPath", dataPath);
    const data = readFileSync(dataPath, 'utf-8');
    console.log("data", data);
    const subjects = JSON.parse(data);
    res.json(subjects);
  } catch (error) {
    console.error('Error reading subjects:', error);
    res.status(500).json({ error: 'Failed to load subjects' });
  }
});

// Get a specific subject by ID
router.get('/:id', (req, res) => {
  try {
    const dataPath = join(__dirname, '../data/subjects.json');
    const data = readFileSync(dataPath, 'utf-8');
    const subjects = JSON.parse(data);
    const subject = subjects.find(s => s.id === req.params.id);
    
    if (!subject) {
      return res.status(404).json({ error: 'Subject not found' });
    }
    
    res.json(subject);
  } catch (error) {
    console.error('Error reading subject:', error);
    res.status(500).json({ error: 'Failed to load subject' });
  }
});

export default router;
