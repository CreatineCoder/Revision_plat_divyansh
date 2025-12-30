# 📁 Complete Project Structure

```
Revision_plat_divyansh/
│
├── 📄 package.json                    # Root package.json for running both servers
├── 📄 .gitignore                      # Git ignore file
├── 📄 README.md                       # Main documentation
├── 📄 QUICKSTART.md                   # Quick setup guide
├── 📄 VERTEX_AI_SETUP.md             # Vertex AI integration guide
├── 📄 DEPLOYMENT.md                   # Deployment instructions
├── 📄 .env.example                    # Environment variables template
│
├── 📂 frontend/                       # React application
│   ├── 📂 src/
│   │   ├── 📂 pages/                 # Page components
│   │   │   ├── LandingPage.jsx       # Home - Mode selection
│   │   │   ├── LandingPage.css
│   │   │   ├── SubjectPicker.jsx     # Subject selection
│   │   │   ├── SubjectPicker.css
│   │   │   ├── ChapterPicker.jsx     # Chapter selection
│   │   │   ├── ChapterPicker.css
│   │   │   ├── AIResponseScreen.jsx  # AI content & chat
│   │   │   └── AIResponseScreen.css
│   │   │
│   │   ├── App.jsx                   # Main app with routing
│   │   ├── App.css                   # App styles
│   │   ├── main.jsx                  # Entry point
│   │   └── index.css                 # Global styles
│   │
│   ├── index.html                    # HTML template
│   ├── vite.config.js                # Vite configuration
│   ├── package.json                  # Frontend dependencies
│   └── package-lock.json
│
├── 📂 backend/                        # Express server
│   ├── 📂 routes/                    # API routes
│   │   ├── subjects.js               # GET /api/subjects
│   │   ├── chapters.js               # GET /api/chapters/:subjectId
│   │   └── ai.js                     # POST /api/ai/generate & /chat
│   │
│   ├── 📂 services/                  # Business logic
│   │   └── vertexAI.js               # Vertex AI integration
│   │
│   ├── 📂 data/                      # JSON data files
│   │   ├── subjects.json             # Subject definitions
│   │   └── chapters.json             # Chapter definitions
│   │
│   ├── server.js                     # Main server file
│   ├── .env                          # Environment variables (local)
│   ├── .env.example                  # Env template
│   ├── package.json                  # Backend dependencies
│   └── package-lock.json
│
└── 📂 node_modules/                   # Dependencies (gitignored)
```

---

## 🎯 Key Files Explained

### Root Level

| File | Purpose |
|------|---------|
| `package.json` | Scripts to run both frontend & backend together |
| `README.md` | Complete project documentation |
| `QUICKSTART.md` | Get started in 5 minutes |
| `VERTEX_AI_SETUP.md` | Connect to Google Cloud AI |
| `DEPLOYMENT.md` | Production deployment guide |
| `.gitignore` | Files to exclude from Git |

### Frontend (`/frontend/`)

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main component with React Router |
| `src/pages/LandingPage.jsx` | Mode selection (Revision/Assessment/Chat) |
| `src/pages/SubjectPicker.jsx` | Subject selection screen |
| `src/pages/ChapterPicker.jsx` | Chapter selection screen |
| `src/pages/AIResponseScreen.jsx` | AI content display + chat interface |
| `vite.config.js` | Vite build configuration |
| `index.html` | HTML entry point |

### Backend (`/backend/`)

| File | Purpose |
|------|---------|
| `server.js` | Express app setup, middleware, error handling |
| `routes/subjects.js` | API endpoints for subjects |
| `routes/chapters.js` | API endpoints for chapters |
| `routes/ai.js` | AI generation & chat endpoints |
| `services/vertexAI.js` | Vertex AI API integration |
| `data/subjects.json` | Subject definitions (6 subjects) |
| `data/chapters.json` | Chapter definitions (24 chapters) |
| `.env` | Environment configuration |

---

## 🔌 API Endpoints

### Subjects API
```
GET  /api/subjects           → List all subjects
GET  /api/subjects/:id       → Get specific subject
```

### Chapters API
```
GET  /api/chapters/:subjectId              → Get chapters for subject
GET  /api/chapters/:subjectId/:chapterId   → Get specific chapter
```

### AI API
```
POST /api/ai/generate        → Generate initial content
POST /api/ai/chat            → Chat with context
GET  /api/ai/test            → Test AI service
```

---

## 🔄 Data Flow

```
User Flow:
┌──────────────┐
│ Landing Page │ → Choose Mode (Revision/Assessment/Chat)
└──────┬───────┘
       ↓
┌──────────────┐
│Subject Picker│ → GET /api/subjects
└──────┬───────┘
       ↓
┌──────────────┐
│Chapter Picker│ → GET /api/chapters/:subjectId
└──────┬───────┘
       ↓
┌──────────────┐
│ AI Response  │ → POST /api/ai/generate
│   Screen     │   (mode + subject + chapter)
└──────┬───────┘
       ↓
┌──────────────┐
│ Chat Mode    │ → POST /api/ai/chat
│  (optional)  │   (message + context)
└──────────────┘
```

---

## 📦 Dependencies

### Frontend Dependencies
```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "react-router-dom": "^6.21.0",
  "axios": "^1.6.2"
}
```

### Backend Dependencies
```json
{
  "express": "^4.18.2",
  "cors": "^2.8.5",
  "dotenv": "^16.3.1",
  "@google-cloud/aiplatform": "^3.12.0",
  "uuid": "^9.0.1"
}
```

---

## 🚀 Quick Commands

### Setup
```powershell
npm run install-all          # Install all dependencies
```

### Development
```powershell
npm run dev                  # Run both frontend & backend
npm run server               # Run backend only
npm run client               # Run frontend only
```

### Backend Only
```powershell
cd backend
npm run dev                  # Start with nodemon
npm start                    # Start production
```

### Frontend Only
```powershell
cd frontend
npm run dev                  # Start dev server
npm run build                # Build for production
npm run preview              # Preview production build
```

---

## 🎨 Customization Points

### 1. Add New Subjects
Edit: `backend/data/subjects.json`
```json
{
  "id": "history",
  "name": "History",
  "icon": "📜",
  "description": "World history and civilizations",
  "chapterCount": 10
}
```

### 2. Add New Chapters
Edit: `backend/data/chapters.json`
```json
{
  "id": "history-1",
  "subjectId": "history",
  "name": "Ancient Civilizations",
  "description": "Early human societies",
  "difficulty": "Medium",
  "topicCount": 8
}
```

### 3. Customize Colors
Edit: `frontend/src/index.css`
```css
:root {
  --primary-color: #4F46E5;
  --secondary-color: #10B981;
  /* ... change these */
}
```

### 4. Modify AI Prompts
Edit: `backend/services/vertexAI.js`
- Change `buildPrompt()` function
- Modify mode-specific instructions
- Adjust response formatting

---

## 🧪 Testing Endpoints

### Test Backend Health
```powershell
curl http://localhost:3001/api/health
```

### Test Get Subjects
```powershell
curl http://localhost:3001/api/subjects
```

### Test AI Generation
```powershell
curl -X POST http://localhost:3001/api/ai/generate `
  -H "Content-Type: application/json" `
  -d '{
    "mode": "revision",
    "subject": "Physics",
    "chapter": "Laws of Motion",
    "request": "Generate notes"
  }'
```

---

## 📊 Current Status

✅ **Working:**
- Full UI flow (Landing → Subject → Chapter → AI Response)
- All navigation and routing
- Subject and chapter selection
- Mock AI responses (realistic demo data)
- Chat interface with message history
- Responsive design (mobile & desktop)
- Error handling
- Beautiful UI with animations

⚠️ **Needs Configuration:**
- Google Cloud Vertex AI credentials
- Real AI API integration (code ready, needs env vars)
- Production deployment setup

🔜 **Future Enhancements:**
- User authentication
- Progress tracking
- Save/bookmark content
- PDF export
- More subjects/chapters
- Analytics dashboard

---

## 📝 Environment Variables

### Required for Development
```env
# Backend only
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### Required for Vertex AI
```env
GOOGLE_CLOUD_PROJECT_ID=your-project-id
GOOGLE_CLOUD_LOCATION=us-central1
VERTEX_AI_AGENT_ID=your-agent-id
```

---

## 🎓 Learning Resources

### Frontend (React)
- React Docs: https://react.dev
- React Router: https://reactrouter.com
- Vite: https://vitejs.dev

### Backend (Node.js)
- Express.js: https://expressjs.com
- Node.js: https://nodejs.org

### AI Integration
- Vertex AI: https://cloud.google.com/vertex-ai/docs
- Agent Builder: https://cloud.google.com/generative-ai-app-builder/docs

---

## 💡 Tips

1. **Start Simple:** Use mock responses first, add AI later
2. **Customize Data:** Edit JSON files to match your curriculum
3. **Test Locally:** Ensure everything works before deploying
4. **Monitor Costs:** Watch Vertex AI usage in Google Cloud Console
5. **Iterate:** Start with one subject, expand gradually

---

## 🆘 Common Issues

### Port Already in Use
- Change `PORT` in `backend/.env`
- Change port in `frontend/vite.config.js`

### CORS Errors
- Check `FRONTEND_URL` in `backend/.env`
- Ensure frontend URL matches CORS settings

### AI Not Working
- Verify `.env` variables are set
- Check Google Cloud authentication
- Review console logs for errors

### Build Errors
- Delete `node_modules` and reinstall
- Clear npm cache: `npm cache clean --force`
- Check Node.js version (need 18+)

---

**🎉 You're all set! Start with `npm run dev` and explore the application.**
