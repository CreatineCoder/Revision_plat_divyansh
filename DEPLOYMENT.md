# 🚀 Deployment Guide

Production deployment options for the AI Revision Platform.

---

## 🌐 Deployment Architecture

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   Frontend   │──────▶│   Backend    │──────▶│  Vertex AI   │
│   (React)    │       │  (Node.js)   │       │  (Google)    │
│  Vercel/     │       │  Cloud Run/  │       │              │
│  Netlify     │       │  VPS         │       │              │
└──────────────┘       └──────────────┘       └──────────────┘
```

---

## 🎯 Option 1: Vercel + Google Cloud Run (Recommended)

Best for: Production apps with easy scaling

### Frontend - Vercel

1. **Install Vercel CLI:**
   ```powershell
   npm install -g vercel
   ```

2. **Build frontend:**
   ```powershell
   cd frontend
   npm run build
   ```

3. **Deploy:**
   ```powershell
   vercel --prod
   ```

4. **Configure environment:**
   - Add environment variable in Vercel dashboard:
   - `VITE_API_URL` = `https://your-backend-url.run.app`

### Backend - Google Cloud Run

1. **Create Dockerfile** in `backend/`:
   ```dockerfile
   FROM node:18-alpine
   
   WORKDIR /app
   
   # Copy package files
   COPY package*.json ./
   
   # Install dependencies
   RUN npm ci --only=production
   
   # Copy source code
   COPY . .
   
   # Expose port
   EXPOSE 3001
   
   # Start server
   CMD ["npm", "start"]
   ```

2. **Create `.dockerignore`:**
   ```
   node_modules
   npm-debug.log
   .env
   .git
   ```

3. **Deploy to Cloud Run:**
   ```powershell
   cd backend
   
   # Build and deploy
   gcloud run deploy revision-platform-backend `
     --source . `
     --platform managed `
     --region us-central1 `
     --allow-unauthenticated `
     --set-env-vars "NODE_ENV=production,GOOGLE_CLOUD_PROJECT_ID=your-project,VERTEX_AI_AGENT_ID=your-agent"
   ```

4. **Note the service URL** (e.g., `https://revision-platform-backend-xxx.run.app`)

5. **Update frontend API URL** to point to this URL

**Pros:**
- ✅ Auto-scaling
- ✅ Pay only for usage
- ✅ Easy updates
- ✅ HTTPS included

**Costs:** ~$0-50/month depending on traffic

---

## 🎯 Option 2: Netlify + Heroku

Best for: Simple deployment with free tiers

### Frontend - Netlify

1. **Create `netlify.toml` in root:**
   ```toml
   [build]
     base = "frontend"
     publish = "dist"
     command = "npm run build"
   
   [[redirects]]
     from = "/*"
     to = "/index.html"
     status = 200
   ```

2. **Deploy:**
   ```powershell
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Deploy
   cd frontend
   netlify deploy --prod
   ```

### Backend - Heroku

1. **Create `Procfile` in `backend/`:**
   ```
   web: npm start
   ```

2. **Deploy:**
   ```powershell
   # Install Heroku CLI
   # From https://devcenter.heroku.com/articles/heroku-cli
   
   cd backend
   heroku create revision-platform-backend
   
   # Set environment variables
   heroku config:set NODE_ENV=production
   heroku config:set GOOGLE_CLOUD_PROJECT_ID=your-project
   heroku config:set VERTEX_AI_AGENT_ID=your-agent
   
   # Deploy
   git push heroku main
   ```

**Pros:**
- ✅ Free tier available
- ✅ Simple setup
- ✅ Good for demos

**Cons:**
- ⚠️ Heroku free tier sleeps after 30 min inactivity
- ⚠️ Limited free hours

---

## 🎯 Option 3: VPS (DigitalOcean/AWS/Azure)

Best for: Full control, custom configurations

### Setup on Ubuntu Server

1. **SSH into server:**
   ```bash
   ssh root@your-server-ip
   ```

2. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install PM2:**
   ```bash
   sudo npm install -g pm2
   ```

4. **Clone repository:**
   ```bash
   git clone <your-repo-url>
   cd Revision_plat_divyansh
   ```

5. **Setup backend:**
   ```bash
   cd backend
   npm install --production
   
   # Create .env file
   nano .env
   # Add your environment variables
   
   # Start with PM2
   pm2 start server.js --name revision-backend
   pm2 save
   pm2 startup
   ```

6. **Setup frontend:**
   ```bash
   cd ../frontend
   npm install
   npm run build
   
   # Serve with nginx (see nginx config below)
   ```

7. **Install Nginx:**
   ```bash
   sudo apt install nginx
   ```

8. **Configure Nginx** (`/etc/nginx/sites-available/revision-platform`):
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
   
       # Frontend
       location / {
           root /path/to/Revision_plat_divyansh/frontend/dist;
           try_files $uri $uri/ /index.html;
       }
   
       # Backend API
       location /api {
           proxy_pass http://localhost:3001;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

9. **Enable site:**
   ```bash
   sudo ln -s /etc/nginx/sites-available/revision-platform /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

10. **Setup SSL with Let's Encrypt:**
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d your-domain.com
    ```

**Pros:**
- ✅ Full control
- ✅ Predictable costs
- ✅ No vendor lock-in

**Cons:**
- ⚠️ Manual scaling
- ⚠️ Maintenance required

**Costs:** ~$5-20/month

---

## 🎯 Option 4: All-in Google Cloud

Best for: Enterprise, Google ecosystem integration

### Frontend - Cloud Storage + CDN

```powershell
cd frontend
npm run build

# Upload to Cloud Storage
gsutil mb gs://your-bucket-name
gsutil cp -r dist/* gs://your-bucket-name

# Make public
gsutil iam ch allUsers:objectViewer gs://your-bucket-name

# Enable Cloud CDN
gcloud compute backend-buckets create revision-frontend `
  --gcs-bucket-name=your-bucket-name
```

### Backend - Cloud Run

(Same as Option 1)

**Pros:**
- ✅ Everything in one platform
- ✅ Global CDN
- ✅ Easy scaling

---

## 🔒 Security Checklist

Before going live:

- [ ] Enable HTTPS (SSL certificates)
- [ ] Set CORS to specific domains (not *)
- [ ] Add rate limiting
- [ ] Implement authentication
- [ ] Hide error details in production
- [ ] Set up monitoring/alerts
- [ ] Regular security updates
- [ ] Environment variables secured
- [ ] API keys rotated regularly
- [ ] Backup strategy in place

### Rate Limiting Example

Add to `backend/server.js`:

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.'
});

app.use('/api/ai/', limiter);
```

---

## 📊 Monitoring

### Option 1: Google Cloud Monitoring

```javascript
// backend/server.js
import { monitoring } from '@google-cloud/monitoring';

const client = new monitoring.MetricServiceClient();

// Log metrics
async function logMetric(value) {
  const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
  const dataPoint = {
    interval: {
      endTime: { seconds: Date.now() / 1000 }
    },
    value: { doubleValue: value }
  };
  // ... implement metric recording
}
```

### Option 2: Simple Logging

```javascript
// backend/middleware/logger.js
export function requestLogger(req, res, next) {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log({
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    });
  });
  
  next();
}
```

---

## 🧪 Pre-Deployment Testing

### Test Checklist

```powershell
# Build test
cd frontend
npm run build
# Ensure no errors

# Backend test
cd ../backend
npm start
# Test API endpoints

# Load test (install artillery)
npm install -g artillery
artillery quick --count 10 --num 100 http://localhost:3001/api/health
```

### Environment Variables Check

Create `backend/.env.production`:

```env
NODE_ENV=production
GOOGLE_CLOUD_PROJECT_ID=your-project
GOOGLE_CLOUD_LOCATION=us-central1
VERTEX_AI_AGENT_ID=your-agent
FRONTEND_URL=https://your-frontend-domain.com
PORT=3001

# Production-specific
LOG_LEVEL=error
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Cloud SDK
        uses: google-github-actions/setup-gcloud@v0
        with:
          project_id: ${{ secrets.GCP_PROJECT_ID }}
          service_account_key: ${{ secrets.GCP_SA_KEY }}
      
      - name: Deploy to Cloud Run
        run: |
          cd backend
          gcloud run deploy revision-platform-backend \
            --source . \
            --region us-central1 \
            --allow-unauthenticated

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Install and Build
        run: |
          cd frontend
          npm ci
          npm run build
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          working-directory: ./frontend
```

---

## 💾 Backup Strategy

### Database (if added later)

```bash
# Automated backups
0 2 * * * pg_dump revision_db > /backups/db_$(date +\%Y\%m\%d).sql
```

### Code

- Use Git with GitHub/GitLab
- Tag releases: `git tag v1.0.0`
- Keep production branch separate

---

## 📈 Scaling Considerations

### When to scale:

- Response time > 3 seconds
- CPU usage > 80% consistently
- Memory usage > 85%
- Error rate > 1%

### Scaling options:

1. **Vertical** - Bigger server
2. **Horizontal** - More servers + load balancer
3. **Caching** - Redis for API responses
4. **CDN** - CloudFlare for static assets

---

## ✅ Launch Checklist

- [ ] All tests passing
- [ ] Environment variables set
- [ ] HTTPS enabled
- [ ] CORS configured
- [ ] Rate limiting active
- [ ] Monitoring setup
- [ ] Backups configured
- [ ] Documentation updated
- [ ] Domain configured
- [ ] Analytics added (optional)
- [ ] Error tracking (Sentry)
- [ ] Load tested
- [ ] Security audit done

---

## 🆘 Rollback Plan

If deployment fails:

```powershell
# Cloud Run - rollback to previous revision
gcloud run services update-traffic revision-platform-backend `
  --to-revisions=PREVIOUS_REVISION=100

# Vercel - rollback via dashboard or CLI
vercel rollback
```

---

## 📞 Support & Monitoring

### Key Metrics to Monitor

- Request latency
- Error rate
- Vertex AI costs
- User sessions
- API quota usage

### Alerting

Set up alerts for:
- Response time > 5s
- Error rate > 5%
- Daily costs > $X
- API quota > 80%

---

**Ready to deploy! 🚀**

Choose your deployment option and follow the steps. Start with Option 1 (Vercel + Cloud Run) for the best balance of ease and scalability.
