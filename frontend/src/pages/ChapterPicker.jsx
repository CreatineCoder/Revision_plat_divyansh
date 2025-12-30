import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import './ChapterPicker.css';

function ChapterPicker({ sessionContext, setSessionContext }) {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch chapters for the selected subject
    axios.get(`${BACKEND_URL}/api/chapters/${sessionContext.subject.id}`)
      .then(response => {
        setChapters(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching chapters:', error);
        setLoading(false);
      });
  }, [sessionContext.subject]);

  const handleChapterSelection = (chapter) => {
    setSessionContext(prev => ({ ...prev, chapter }));
    navigate('/learn');
  };

  const handleBack = () => {
    navigate('/subject');
  };

  const getModeEmoji = () => {
    switch(sessionContext.mode) {
      case 'revision': return '🚀';
      case 'assessment': return '📝';
      case 'chat': return '💬';
      default: return '📚';
    }
  };

  if (loading) {
    return (
      <div className="chapter-picker">
        <div className="loading">Loading chapters...</div>
      </div>
    );
  }

  return (
    <div className="chapter-picker">
      <div className="picker-container">
        <div className="breadcrumb">
          <span onClick={() => navigate('/')} className="breadcrumb-item clickable">Home</span>
          <span className="breadcrumb-separator">/</span>
          <span onClick={handleBack} className="breadcrumb-item clickable">
            {sessionContext.subject.name}
          </span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item active">Select Chapter</span>
        </div>

        <header className="picker-header">
          <div className="context-info">
            <span className="mode-badge-small">{getModeEmoji()} {sessionContext.mode}</span>
            <span className="subject-badge">{sessionContext.subject.icon} {sessionContext.subject.name}</span>
          </div>
          <h1>Select a Chapter</h1>
          <p>Choose the topic you want to learn</p>
        </header>

        <div className="chapters-list">
          {chapters.map((chapter, index) => (
            <div
              key={chapter.id}
              className="chapter-item"
              onClick={() => handleChapterSelection(chapter)}
            >
              <div className="chapter-number">{index + 1}</div>
              <div className="chapter-content">
                <h3>{chapter.name}</h3>
                <p className="chapter-description">{chapter.description}</p>
                <div className="chapter-meta">
                  <span className="difficulty-badge">{chapter.difficulty}</span>
                  <span className="topic-count">{chapter.topicCount} topics</span>
                </div>
              </div>
              <div className="chapter-arrow">→</div>
            </div>
          ))}
        </div>

        <button className="back-button" onClick={handleBack}>
          ← Back to Subject Selection
        </button>
      </div>
    </div>
  );
}

export default ChapterPicker;
