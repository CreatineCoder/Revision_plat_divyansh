import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AIResponseScreen.css';

function AIResponseScreen({ sessionContext, setSessionContext }) {
  const [aiResponse, setAiResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [chatMode, setChatMode] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initial AI request based on mode, subject, and chapter
    const requestData = {
      mode: sessionContext.mode,
      subject: sessionContext.subject.name,
      chapter: sessionContext.chapter.name,
      request: getInitialRequestPrompt()
    };

    axios.post('/api/ai/generate', requestData)
      .then(response => {
        setAiResponse(response.data);
        setMessages([{
          role: 'assistant',
          content: response.data.content,
          timestamp: new Date()
        }]);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching AI response:', error);
        setAiResponse({ 
          content: 'Error loading content. Please try again.',
          error: true 
        });
        setLoading(false);
      });
  }, [sessionContext]);

  const getInitialRequestPrompt = () => {
    switch(sessionContext.mode) {
      case 'revision':
        return `Generate comprehensive revision notes for ${sessionContext.chapter.name} in ${sessionContext.subject.name}. Include key concepts, definitions, formulas, and important points.`;
      case 'assessment':
        return `Generate practice questions and problems for ${sessionContext.chapter.name} in ${sessionContext.subject.name}. Include MCQs, short answer questions, and problem-solving exercises.`;
      case 'chat':
        return `I want to learn about ${sessionContext.chapter.name} in ${sessionContext.subject.name}. Please provide an overview and let me know I can ask questions.`;
      default:
        return `Provide learning material for ${sessionContext.chapter.name} in ${sessionContext.subject.name}.`;
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || sending) return;

    const userMessage = {
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setSending(true);

    try {
      const response = await axios.post('/api/ai/chat', {
        mode: sessionContext.mode,
        subject: sessionContext.subject.name,
        chapter: sessionContext.chapter.name,
        message: inputMessage,
        history: messages
      });

      const aiMessage = {
        role: 'assistant',
        content: response.data.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Sorry, there was an error processing your message. Please try again.',
        timestamp: new Date(),
        error: true
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleNewSession = () => {
    setSessionContext({ mode: null, subject: null, chapter: null });
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

  if (loading) {
    return (
      <div className="ai-response-screen">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Generating your personalized content...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-response-screen">
      <header className="response-header">
        <div className="context-bar">
          <div className="context-info">
            <span className="mode-badge">{getModeEmoji()} {sessionContext.mode}</span>
            <span className="subject-badge">{sessionContext.subject.icon} {sessionContext.subject.name}</span>
            <span className="chapter-badge">📖 {sessionContext.chapter.name}</span>
          </div>
          <div className="header-actions">
            <button 
              className="chat-toggle-button"
              onClick={() => setChatMode(!chatMode)}
            >
              {chatMode ? '📄 View Content' : '💬 Ask Questions'}
            </button>
            <button className="new-session-button" onClick={handleNewSession}>
              + New Session
            </button>
          </div>
        </div>
      </header>

      <div className="response-content">
        {!chatMode ? (
          <div className="content-view">
            <div className="ai-content">
              {messages.map((message, index) => (
                message.role === 'assistant' && (
                  <div key={index} className={`message-content ${message.error ? 'error' : ''}`}>
                    <div dangerouslySetInnerHTML={{ __html: formatContent(message.content) }} />
                  </div>
                )
              ))}
            </div>
            <button 
              className="enable-chat-button"
              onClick={() => setChatMode(true)}
            >
              💬 Have a question? Start chatting
            </button>
          </div>
        ) : (
          <div className="chat-view">
            <div className="chat-messages">
              {messages.map((message, index) => (
                <div key={index} className={`message ${message.role}`}>
                  <div className="message-bubble">
                    <div className="message-text">{message.content}</div>
                    <div className="message-time">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
              {sending && (
                <div className="message assistant">
                  <div className="message-bubble typing">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="chat-input-area">
              <div className="input-container">
                <textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask a question about this topic..."
                  rows="1"
                  disabled={sending}
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || sending}
                  className="send-button"
                >
                  {sending ? '⏳' : '➤'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to format content (convert markdown-like syntax to HTML)
function formatContent(content) {
  if (!content) return '';
  
  return content
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br />')
    .replace(/#{3}\s+(.*?)(<br \/>|$)/g, '<h3>$1</h3>')
    .replace(/#{2}\s+(.*?)(<br \/>|$)/g, '<h2>$1</h2>')
    .replace(/#{1}\s+(.*?)(<br \/>|$)/g, '<h1>$1</h1>')
    .replace(/•\s+(.*?)(<br \/>|$)/g, '<li>$1</li>')
    .replace(/(<li>.*?<\/li>)/g, '<ul>$1</ul>');
}

export default AIResponseScreen;
