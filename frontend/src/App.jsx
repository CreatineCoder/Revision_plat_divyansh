import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import SubjectPicker from './pages/SubjectPicker';
import ChapterPicker from './pages/ChapterPicker';
import AIResponseScreen from './pages/AIResponseScreen';
import './App.css';

function App() {
  const [sessionContext, setSessionContext] = useState({
    mode: null,
    subject: null,
    chapter: null,
  });

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/" 
            element={<LandingPage setSessionContext={setSessionContext} />} 
          />
          <Route 
            path="/subject" 
            element={
              sessionContext.mode ? 
              <SubjectPicker sessionContext={sessionContext} setSessionContext={setSessionContext} /> :
              <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/chapter" 
            element={
              sessionContext.subject ? 
              <ChapterPicker sessionContext={sessionContext} setSessionContext={setSessionContext} /> :
              <Navigate to="/" replace />
            } 
          />
          <Route 
            path="/learn" 
            element={
              sessionContext.chapter ? 
              <AIResponseScreen sessionContext={sessionContext} setSessionContext={setSessionContext} /> :
              <Navigate to="/" replace />
            } 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
