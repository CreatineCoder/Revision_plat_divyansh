# 🚀 Quick Start Guide

Get the AI Revision Platform running in minutes!

## ⚡ Fast Setup (5 minutes)

### 1. Install Dependencies

Open PowerShell in the project root:

```powershell
npm run install-all
```

### 2. Start Development Servers

```powershell
npm run dev
```

That's it! Open http://localhost:5173 in your browser.

---

## 🎯 What You'll See

1. **Landing Page** - Choose your mode (Revision/Assessment/Chat)
2. **Subject Selection** - Pick a subject (Physics, Chemistry, Math, etc.)
3. **Chapter Selection** - Choose specific chapter
4. **AI Response** - Get personalized content!

---

## 🔧 Current Status

✅ **Working out of the box** with mock AI responses  
⚠️ **Vertex AI not yet configured** - showing demo content

The UI, routing, and all functionality work perfectly. To enable real AI responses, follow the Vertex AI setup in the main README.

---

## 📱 Access Points

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3001
- **Health Check:** http://localhost:3001/api/health

---

## 🛠️ Troubleshooting

### Port Already in Use?

**Frontend (5173):**
```powershell
# Edit frontend/vite.config.js, change port to 3000
server: {
  port: 3000
}
```

**Backend (3001):**
```powershell
# Edit backend/.env, change PORT to 4000
PORT=4000
```

### Dependencies Not Installing?

```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules, frontend/node_modules, backend/node_modules
npm run install-all
```

### Backend Not Starting?

Check if `.env` file exists in `backend/` folder. If not:
```powershell
Copy-Item backend\.env.example backend\.env
```

---

## 📚 Next Steps

1. ✅ Test all three modes (Revision, Assessment, Chat)
2. ✅ Try different subjects and chapters
3. ✅ Test chat functionality
4. 📖 Read main README for Vertex AI setup
5. 🎨 Customize subjects/chapters in `backend/data/`

---

## 💡 Tips

- Use **Ctrl+C** in terminal to stop servers
- Frontend auto-reloads on code changes
- Backend restarts automatically with nodemon
- Check browser console (F12) for errors

---

## 🆘 Need Help?

The platform works with mock data by default. You can:

1. **Use as-is** for demo/testing
2. **Add real subjects** in `backend/data/subjects.json`
3. **Configure Vertex AI** following main README

Enjoy building! 🎉
