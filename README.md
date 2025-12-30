# 📚 AI-Powered Revision Platform

An intelligent educational platform that structures student learning through AI-powered revision, assessments, and interactive chat. Built with React, Node.js, Express, and Google Cloud Vertex AI.

![Platform Preview](https://img.shields.io/badge/Status-Ready%20to%20Deploy-success)
![Tech Stack](https://img.shields.io/badge/Stack-React%20%7C%20Node.js%20%7C%20Vertex%20AI-blue)

## 🎯 Problem Statement

Traditional educational chatbots start with an open-ended "What do you want?" approach, leading to:
- Contextless conversations
- Generic, unhelpful responses  
- Poor learning outcomes

**Our Solution:** Structured learning flow that captures student intent (mode), subject, and chapter BEFORE initiating AI interaction, ensuring:
- ✅ Contextually relevant content
- ✅ Exam-tailored notes and questions
- ✅ Focused learning sessions
- ✅ Better educational outcomes

---

## 🌟 Key Features

### 🚀 **Revision Mode**
- Comprehensive notes with key concepts
- Important definitions and formulas
- Structured content with headings
- Quick revision tips

### 📝 **Assessment Mode**
- MCQs with explanations
- Short answer questions
- Problem-solving exercises
- Instant feedback

### 💬 **Interactive Chat Mode**
- Context-aware conversations
- Follow-up questions
- Clarification of doubts
- Real-time AI responses

### 🎨 **User Experience**
- No intrusive chat popups
- Wizard-style multi-step flow
- Full-page result screens
- Session context preservation
- Beautiful, modern UI

---

## 🏗️ Architecture

```
┌─────────────────┐
│   Landing Page  │  ← Choose Mode (Revision/Assessment/Chat)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Subject Picker  │  ← Select Subject (Physics, Chemistry, etc.)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Chapter Picker  │  ← Select Chapter
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AI Response    │  ← Get AI-generated content
│  Screen         │  ← Optional chat for follow-ups
└─────────────────┘
```

### Tech Stack

**Frontend:**
- React 18 with Hooks
- React Router for navigation
- Vite for fast builds
- Axios for API calls
- CSS3 with modern features

**Backend:**
- Node.js with Express
- Google Cloud Vertex AI integration
- RESTful API architecture
- CORS enabled

**Data:**
- JSON-based subject/chapter storage
- Extensible data structure
- Easy to add new content

---

## 📁 Project Structure

```
Revision_plat_divyansh/
├── frontend/                  # React application
│   ├── src/
│   │   ├── pages/            # Page components
│   │   │   ├── LandingPage.jsx
│   │   │   ├── SubjectPicker.jsx
│   │   │   ├── ChapterPicker.jsx
│   │   │   └── AIResponseScreen.jsx
│   │   ├── App.jsx           # Main app with routing
│   │   ├── main.jsx          # Entry point
│   │   └── index.css         # Global styles
│   ├── package.json
│   └── vite.config.js
│
├── backend/                   # Express server
│   ├── routes/               # API routes
│   │   ├── subjects.js       # Subject endpoints
│   │   ├── chapters.js       # Chapter endpoints
│   │   └── ai.js             # AI generation endpoints
│   ├── services/
│   │   └── vertexAI.js       # Vertex AI integration
│   ├── data/                 # JSON data files
│   │   ├── subjects.json
│   │   └── chapters.json
│   ├── server.js             # Main server file
│   ├── .env                  # Environment variables
│   └── package.json
│
├── package.json              # Root package.json
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Google Cloud** account (for Vertex AI)
- **Git** for version control

### Installation

1. **Clone the repository:**
```powershell
git clone <repository-url>
cd Revision_plat_divyansh
```

2. **Install all dependencies:**
```powershell
npm run install-all
```

Or install manually:
```powershell
# Root dependencies
npm install

# Frontend dependencies
cd frontend
npm install

# Backend dependencies
cd ../backend
npm install
cd ..
```

### Configuration

1. **Set up Google Cloud Vertex AI:**

   - Go to [Google Cloud Console](https://console.cloud.google.com)
   - Create a new project or select existing
   - Enable Vertex AI API
   - Go to [Vertex AI Agent Builder](https://cloud.google.com/generative-ai-app-builder)
   - Create an AI agent with your educational playbooks
   - Note down: Project ID, Location, Agent ID

2. **Configure environment variables:**

   Edit `backend/.env`:
   ```env
   GOOGLE_CLOUD_PROJECT_ID=your-actual-project-id
   GOOGLE_CLOUD_LOCATION=us-central1
   VERTEX_AI_AGENT_ID=your-agent-id
   
   PORT=3001
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

3. **Set up Google Cloud authentication:**

   ```powershell
   # Install Google Cloud SDK
   # Visit: https://cloud.google.com/sdk/docs/install
   
   # Authenticate
   gcloud auth application-default login
   
   # Set project
   gcloud config set project YOUR_PROJECT_ID
   ```

### Running the Application

**Development Mode (Recommended):**

```powershell
# From root directory - runs both frontend and backend
npm run dev
```

**Or run separately:**

```powershell
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Access the Application

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3001
- **API Health Check:** http://localhost:3001/api/health

---

## 🔧 API Endpoints

### Subjects

```
GET  /api/subjects          # Get all subjects
GET  /api/subjects/:id      # Get specific subject
```

### Chapters

```
GET  /api/chapters/:subjectId              # Get chapters for subject
GET  /api/chapters/:subjectId/:chapterId   # Get specific chapter
```

### AI Generation

```
POST /api/ai/generate       # Generate initial content
POST /api/ai/chat           # Chat with context
GET  /api/ai/test          # Test AI service status
```

#### Example Request - Generate Content

```javascript
POST /api/ai/generate
Content-Type: application/json

{
  "mode": "revision",
  "subject": "Physics",
  "chapter": "Laws of Motion",
  "request": "Generate revision notes"
}
```

#### Example Request - Chat

```javascript
POST /api/ai/chat
Content-Type: application/json

{
  "mode": "revision",
  "subject": "Physics",
  "chapter": "Laws of Motion",
  "message": "Explain Newton's First Law",
  "history": [...]
}
```

---

## 🎨 Customization

### Adding New Subjects

Edit `backend/data/subjects.json`:

```json
{
  "id": "your-subject-id",
  "name": "Your Subject",
  "icon": "📖",
  "description": "Subject description",
  "chapterCount": 10
}
```

### Adding New Chapters

Edit `backend/data/chapters.json`:

```json
{
  "id": "chapter-id",
  "subjectId": "your-subject-id",
  "name": "Chapter Name",
  "description": "Chapter description",
  "difficulty": "Medium",
  "topicCount": 8
}
```

### Styling Customization

Edit CSS variables in `frontend/src/index.css`:

```css
:root {
  --primary-color: #4F46E5;
  --secondary-color: #10B981;
  --accent-color: #F59E0B;
  /* ... more variables */
}
```

---

## 🤖 Vertex AI Integration

### Current Implementation

The app currently uses **mock responses** for development. To enable real Vertex AI:

1. **Configure credentials** (as shown in Configuration section)

2. **Update `backend/services/vertexAI.js`:**

The file contains placeholder code for actual Vertex AI integration. Uncomment and configure:

```javascript
// Example implementation in vertexAI.js
import { AIPlatformClient } from '@google-cloud/aiplatform';

const client = new AIPlatformClient({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  location: process.env.GOOGLE_CLOUD_LOCATION
});

// Use client.predict() for AI calls
```

3. **Install Vertex AI SDK:**
```powershell
cd backend
npm install @google-cloud/aiplatform
```

### Testing Mock Responses

The platform works out-of-the-box with intelligent mock responses for testing UI/UX without Vertex AI setup.

---

## 📦 Building for Production

### Frontend Build

```powershell
cd frontend
npm run build
```

Output in `frontend/dist/`

### Backend Production

```powershell
cd backend
npm start
```

### Environment Variables for Production

Update `backend/.env`:
```env
NODE_ENV=production
FRONTEND_URL=https://your-domain.com
PORT=3001
```

---

## 🚢 Deployment Options

### Option 1: Google Cloud Run

1. **Build Docker containers:**
```dockerfile
# Example Dockerfile for backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

2. **Deploy:**
```powershell
gcloud run deploy revision-platform-backend --source .
```

### Option 2: Vercel (Frontend) + Cloud Run (Backend)

**Frontend (Vercel):**
```powershell
cd frontend
vercel --prod
```

**Backend (Cloud Run):**
```powershell
cd backend
gcloud run deploy
```

### Option 3: Traditional VPS

1. Install Node.js on server
2. Clone repository
3. Set up PM2 for process management
4. Configure Nginx as reverse proxy

---

## 🔒 Security Considerations

- ✅ API keys stored in environment variables
- ✅ CORS configured for specific origins
- ✅ Input validation on backend
- ✅ Rate limiting (implement with express-rate-limit)
- ✅ Sanitize user inputs
- ⚠️ Add authentication for production
- ⚠️ Implement API request quotas

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Landing page loads
- [ ] Mode selection works
- [ ] Subject picker displays subjects
- [ ] Chapter picker shows chapters
- [ ] AI content generates successfully
- [ ] Chat functionality works
- [ ] Back navigation works
- [ ] Responsive on mobile
- [ ] Error handling works

### Future: Automated Tests

```powershell
# Frontend tests (to be implemented)
cd frontend
npm test

# Backend tests (to be implemented)
cd backend
npm test
```

---

## 📈 Future Enhancements

- [ ] **User Authentication** - Login/signup system
- [ ] **Progress Tracking** - Save student progress
- [ ] **Analytics Dashboard** - Track learning metrics
- [ ] **Bookmarks** - Save favorite content
- [ ] **PDF Export** - Download notes as PDF
- [ ] **Multi-language** - Support multiple languages
- [ ] **Voice Input** - Speak questions
- [ ] **Spaced Repetition** - Smart revision scheduling
- [ ] **Collaborative Learning** - Study groups
- [ ] **Teacher Dashboard** - Monitor student progress

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 👥 Support

For questions or issues:
- 📧 Email: support@revision-platform.com
- 💬 Discord: [Join our server](#)
- 🐛 Issues: [GitHub Issues](#)

---

## 🙏 Acknowledgments

- **Google Cloud** for Vertex AI platform
- **React** team for amazing framework
- **Node.js** community
- All contributors and testers

---

## 📝 Changelog

### Version 1.0.0 (Current)
- ✅ Initial release
- ✅ Three learning modes
- ✅ Subject and chapter selection
- ✅ AI content generation
- ✅ Interactive chat
- ✅ Responsive design
- ✅ Mock AI responses for testing

---

**Built with ❤️ for students worldwide**

*Empowering education through intelligent technology*
