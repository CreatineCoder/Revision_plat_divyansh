# 🤖 Vertex AI Integration Guide

Complete guide to connect your platform to Google Cloud Vertex AI for real AI responses.

## 📋 Prerequisites

- Google Cloud account
- Credit card (required for Google Cloud, but free tier available)
- Project with billing enabled

---

## 🔧 Setup Steps

### Step 1: Google Cloud Project Setup

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com

2. **Create a new project:**
   - Click "Select a project" → "New Project"
   - Name: `revision-platform-ai`
   - Note your Project ID (e.g., `revision-platform-ai-123456`)

3. **Enable billing:**
   - Go to Billing → Link billing account
   - New users get $300 free credits

### Step 2: Enable APIs

Enable these APIs in your project:

1. **Vertex AI API:**
   ```
   https://console.cloud.google.com/apis/library/aiplatform.googleapis.com
   ```

2. **Generative AI App Builder API:**
   ```
   https://console.cloud.google.com/apis/library/discoveryengine.googleapis.com
   ```

3. Click "Enable" for each

### Step 3: Create Vertex AI Agent

1. **Go to Agent Builder:**
   - Visit: https://cloud.google.com/generative-ai-app-builder
   - Or from Console: Navigation Menu → Vertex AI → Agent Builder

2. **Create a new agent:**
   - Click "Create Agent"
   - Choose "Conversational Agent"
   - Name: `Education Assistant`

3. **Configure agent settings:**
   - Model: Choose Gemini Pro or similar
   - Region: `us-central1` (or your preferred)

4. **Add playbooks (tools/instructions):**

   **Revision Playbook:**
   ```
   You are an expert tutor. Generate comprehensive revision notes with:
   - Key concepts and definitions
   - Important formulas
   - Clear examples
   - Bullet points for easy reading
   - Exam-focused content
   
   Format content with markdown for better readability.
   ```

   **Assessment Playbook:**
   ```
   You are an exam preparation expert. Generate:
   - Multiple choice questions with explanations
   - Short answer questions
   - Problem-solving exercises
   - Mix of difficulty levels
   - Correct answers with reasoning
   
   Focus on exam-style questions that test understanding.
   ```

   **Chat Playbook:**
   ```
   You are a helpful educational assistant. 
   - Answer student questions clearly
   - Provide examples when explaining
   - Break down complex topics
   - Be encouraging and supportive
   - Ask if student needs clarification
   ```

5. **Test your agent:**
   - Use the built-in tester
   - Verify responses are appropriate

6. **Note your Agent ID:**
   - Format: `projects/{PROJECT_ID}/locations/{LOCATION}/agents/{AGENT_ID}`
   - Or simplified: just the AGENT_ID part

### Step 4: Authentication Setup

**Option A: Local Development (Recommended)**

1. **Install Google Cloud SDK:**
   ```powershell
   # Download from: https://cloud.google.com/sdk/docs/install
   ```

2. **Authenticate:**
   ```powershell
   gcloud auth application-default login
   ```

3. **Set project:**
   ```powershell
   gcloud config set project YOUR_PROJECT_ID
   ```

**Option B: Service Account (Production)**

1. **Create service account:**
   ```powershell
   gcloud iam service-accounts create revision-platform \
     --display-name="Revision Platform Service Account"
   ```

2. **Grant roles:**
   ```powershell
   gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
     --member="serviceAccount:revision-platform@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
     --role="roles/aiplatform.user"
   ```

3. **Download key:**
   ```powershell
   gcloud iam service-accounts keys create credentials.json \
     --iam-account=revision-platform@YOUR_PROJECT_ID.iam.gserviceaccount.com
   ```

4. **Set environment variable:**
   ```powershell
   $env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\credentials.json"
   ```

### Step 5: Configure Backend

1. **Update `backend/.env`:**
   ```env
   GOOGLE_CLOUD_PROJECT_ID=your-actual-project-id
   GOOGLE_CLOUD_LOCATION=us-central1
   VERTEX_AI_AGENT_ID=your-agent-id
   
   # For service account (optional)
   GOOGLE_APPLICATION_CREDENTIALS=./credentials.json
   ```

2. **Install Vertex AI SDK:**
   ```powershell
   cd backend
   npm install @google-cloud/aiplatform
   ```

### Step 6: Implement Vertex AI Service

Update `backend/services/vertexAI.js`:

```javascript
import { PredictionServiceClient } from '@google-cloud/aiplatform';
import dotenv from 'dotenv';

dotenv.config();

const client = new PredictionServiceClient({
  apiEndpoint: `${process.env.GOOGLE_CLOUD_LOCATION}-aiplatform.googleapis.com`
});

export async function callVertexAI({ mode, subject, chapter, request }) {
  const endpoint = `projects/${process.env.GOOGLE_CLOUD_PROJECT_ID}/locations/${process.env.GOOGLE_CLOUD_LOCATION}/publishers/google/models/gemini-pro`;

  const prompt = buildPrompt(mode, subject, chapter, request);

  const instanceValue = {
    content: prompt
  };

  const instance = {
    structValue: {
      fields: {
        prompt: {
          stringValue: prompt
        }
      }
    }
  };

  const instances = [instance];
  const parameters = {
    structValue: {
      fields: {
        temperature: { numberValue: 0.7 },
        maxOutputTokens: { numberValue: 2048 },
        topP: { numberValue: 0.95 },
        topK: { numberValue: 40 }
      }
    }
  };

  const request = {
    endpoint,
    instances,
    parameters
  };

  try {
    const [response] = await client.predict(request);
    return response.predictions[0].structValue.fields.content.stringValue;
  } catch (error) {
    console.error('Vertex AI Error:', error);
    throw error;
  }
}
```

### Step 7: Test Integration

1. **Start your backend:**
   ```powershell
   cd backend
   npm run dev
   ```

2. **Test API endpoint:**
   ```powershell
   curl -X POST http://localhost:3001/api/ai/generate `
     -H "Content-Type: application/json" `
     -d '{
       "mode": "revision",
       "subject": "Physics",
       "chapter": "Laws of Motion",
       "request": "Generate revision notes"
     }'
   ```

3. **Check for real AI response** (not mock data)

---

## 💰 Cost Considerations

### Vertex AI Pricing (as of 2024)

**Gemini Pro:**
- Input: ~$0.00025 per 1K characters
- Output: ~$0.0005 per 1K characters

**Example costs:**
- 100 student sessions/day
- ~2000 characters per session
- **Estimated: $1-5 per day**

**Free tier:**
- $300 in credits for new users
- Vertex AI has monthly free quotas

### Cost Optimization Tips

1. **Set request limits:**
   ```javascript
   // Limit response length
   maxOutputTokens: 1024
   ```

2. **Cache responses:**
   ```javascript
   // Store common responses in Redis/database
   ```

3. **Rate limiting:**
   ```javascript
   import rateLimit from 'express-rate-limit';
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each user to 100 requests per windowMs
   });
   
   app.use('/api/ai/', limiter);
   ```

4. **Use quotas:**
   - Set daily spending limits in Google Cloud
   - Monitor usage in Cloud Console

---

## 🔍 Monitoring & Debugging

### View Logs

```powershell
# Backend logs
cd backend
npm run dev
# Watch console output

# Google Cloud logs
gcloud logging read "resource.type=aiplatform.googleapis.com" --limit 50
```

### Common Issues

**Issue: "Permission denied"**
```
Solution: Ensure service account has roles/aiplatform.user role
```

**Issue: "Quota exceeded"**
```
Solution: 
1. Check quotas in Google Cloud Console
2. Request quota increase
3. Implement rate limiting
```

**Issue: "Model not found"**
```
Solution: Verify model name and region match your setup
```

---

## 🧪 Testing Strategy

1. **Start with mock responses** (already working)
2. **Configure Vertex AI** (follow this guide)
3. **Test single request** via API
4. **Test through UI** with one mode
5. **Test all modes** (revision, assessment, chat)
6. **Monitor costs** in Google Cloud Console
7. **Implement caching** for frequently asked questions
8. **Add rate limiting** before production

---

## 📊 Alternative AI Providers

If Vertex AI doesn't fit your needs:

### OpenAI GPT-4
```javascript
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const completion = await openai.chat.completions.create({
  model: "gpt-4",
  messages: [{ role: "user", content: prompt }]
});
```

### Azure OpenAI
```javascript
import { OpenAIClient } from "@azure/openai";

const client = new OpenAIClient(
  endpoint,
  new AzureKeyCredential(apiKey)
);
```

### Anthropic Claude
```javascript
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

const message = await anthropic.messages.create({
  model: "claude-3-opus-20240229",
  max_tokens: 1024,
  messages: [{ role: "user", content: prompt }]
});
```

---

## ✅ Checklist

- [ ] Google Cloud project created
- [ ] Billing enabled
- [ ] Vertex AI API enabled
- [ ] Agent created and tested
- [ ] Authentication configured
- [ ] Environment variables set
- [ ] SDK installed
- [ ] Service code updated
- [ ] Integration tested
- [ ] Costs monitored
- [ ] Rate limiting implemented

---

## 🆘 Support Resources

- **Vertex AI Docs:** https://cloud.google.com/vertex-ai/docs
- **Agent Builder:** https://cloud.google.com/generative-ai-app-builder/docs
- **Pricing:** https://cloud.google.com/vertex-ai/pricing
- **Quotas:** https://cloud.google.com/vertex-ai/quotas

---

**Ready to go live with real AI! 🚀**
