import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './SubjectPicker.css';

function SubjectPicker({ sessionContext, setSessionContext }) {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch subjects from backend
    axios.get('/api/subjects')
      .then(response => {
        setSubjects(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching subjects:', error);
        setLoading(false);
      });
  }, []);

  const handleSubjectSelection = (subject) => {
    setSessionContext(prev => ({ ...prev, subject, chapter: null }));
    navigate('/chapter');
  };

  const handleBack = () => {
    navigate('/');
  };

  const getModeEmoji = () => {
    switch(sessionContext.mode) {
      case 'revision': return '🚀';
      case 'assessment': return '📝';
      case 'chat': return '💬';
      default: return '📚';
    }
  };

  const getModeLabel = () => {
    return sessionContext.mode.charAt(0).toUpperCase() + sessionContext.mode.slice(1);
  };

  if (loading) {
    return (
      <div className="subject-picker">
        <div className="loading">Loading subjects...</div>
      </div>
    );
  }

  return (
    <div className="subject-picker">
      <div className="picker-container">
        <div className="breadcrumb">
          <span onClick={handleBack} className="breadcrumb-item clickable">Home</span>
          <span className="breadcrumb-separator">/</span>
          <span className="breadcrumb-item active">Select Subject</span>
        </div>

        <header className="picker-header">
          <div className="mode-badge">
            <span className="mode-emoji">{getModeEmoji()}</span>
            <span className="mode-text">{getModeLabel()} Mode</span>
          </div>
          <h1>Choose Your Subject</h1>
          <p>Select the subject you want to focus on</p>
        </header>

        <div className="subjects-grid">
          {subjects.map((subject) => (
            <div
              key={subject.id}
              className="subject-card"
              onClick={() => handleSubjectSelection(subject)}
            >
              <div className="subject-icon">{subject.icon}</div>
              <h3>{subject.name}</h3>
              <p className="subject-description">{subject.description}</p>
              <span className="chapter-count">{subject.chapterCount} chapters</span>
            </div>
          ))}
        </div>

        <button className="back-button" onClick={handleBack}>
          ← Back to Mode Selection
        </button>
      </div>
    </div>
  );
}

export default SubjectPicker;
