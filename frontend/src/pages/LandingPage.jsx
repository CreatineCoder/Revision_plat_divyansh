import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage({ setSessionContext }) {
  const navigate = useNavigate();

  const handleModeSelection = (mode) => {
    setSessionContext(prev => ({ ...prev, mode, subject: null, chapter: null }));
    navigate('/subject');
  };

  return (
    <div className="landing-page">
      <div className="landing-container">
        <header className="landing-header">
          <h1 className="main-title">📚 AI Revision Platform</h1>
          <p className="subtitle">Structure your learning journey with AI-powered assistance</p>
        </header>

        <div className="mode-selection">
          <h2 className="section-title">Choose Your Learning Mode</h2>
          
          <div className="mode-cards">
            <div 
              className="mode-card revision-card"
              onClick={() => handleModeSelection('revision')}
            >
              <div className="mode-icon">🚀</div>
              <h3>Revision</h3>
              <p>Get comprehensive notes, key concepts, and summaries tailored to your curriculum</p>
              <button className="mode-button">Start Revision</button>
            </div>

            <div 
              className="mode-card assessment-card"
              onClick={() => handleModeSelection('assessment')}
            >
              <div className="mode-icon">📝</div>
              <h3>Assessment</h3>
              <p>Practice with exam-style questions, MCQs, and problem sets with instant feedback</p>
              <button className="mode-button">Take Assessment</button>
            </div>

            <div 
              className="mode-card chat-card"
              onClick={() => handleModeSelection('chat')}
            >
              <div className="mode-icon">💬</div>
              <h3>Interactive Chat</h3>
              <p>Ask questions, clarify doubts, and explore topics through conversational learning</p>
              <button className="mode-button">Start Chat</button>
            </div>
          </div>
        </div>

        <footer className="landing-footer">
          <p>✨ Powered by AI • Designed for Students</p>
        </footer>
      </div>
    </div>
  );
}

export default LandingPage;
