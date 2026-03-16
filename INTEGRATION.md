# Vigilant AI - Frontend & Backend Integration Guide

## 📋 Overview

This guide documents the complete integration between the **React frontend dashboard** and the **Python backend** (vigilant_AI) for the Vigilant AI cybersecurity simulation platform.

### Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                        │
│  ┌────────────┐  ┌────────────┐  ┌──────────────┐         │
│  │   Pages    │  │   Hooks    │  │  Components  │         │
│  └─────┬──────┘  └─────┬──────┘  └──────┬───────┘         │
│        │               │                 │                  │
│        └───────────────┴─────────────────┘                  │
│                        ↓                                     │
│        ┌───────────────────────────────────┐                │
│        │    Services (Real Implementation) │                │
│        │  • agentService.js                │                │
│        │  • logService.js                  │                │
│        │  • artifactService.js             │                │
│        │  • reportService.js               │                │
│        │  • coordinatorService.js          │                │
│        └────────────┬──────────────────────┘                │
│                     ↓                                        │
│        ┌────────────────────────┐                           │
│        │   apiClient.js         │                           │
│        │   (Central HTTP Layer) │                           │
│        └────────────┬───────────┘                           │
└─────────────────────┼────────────────────────────────────────┘
                      │ HTTP (REST API)
                      ↓
┌─────────────────────────────────────────────────────────────┐
│              API SERVER (Flask - api_server.py)             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  REST Endpoints:                                      │  │
│  │  • /api/agents          → Agent management           │  │
│  │  • /api/logs            → Log retrieval              │  │
│  │  • /api/scenarios       → Scenario execution         │  │
│  │  • /api/artifacts       → File access                │  │
│  │  • /api/coordinator     → System status              │  │
│  └─────────────┬────────────────────────────────────────┘  │
│                ↓                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │         VIGILANT_AI BACKEND (Unchanged)             │   │
│  │  • run_agents.py    → Agent orchestration           │   │
│  │  • logs.db          → SQLite logging                │   │
│  │  • llm_working_folder/ → Artifacts                  │   │
│  │  • agents/          → Agent implementations         │   │
│  │  • tools/           → Tool definitions              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ and npm/yarn
- **Python** 3.8+
- **Git**

### 1. Install Dependencies

#### Backend (vigilant_AI)
```bash
cd vigilant_AI/cyber-security-llm-agents
pip install -r requirements.txt
```

#### Frontend
```bash
cd frontend
npm install
```

### 2. Configure Environment Variables

#### Backend (.env)
Location: `vigilant_AI/cyber-security-llm-agents/.env`

```env
API_PORT=5000
LLM_WORKING_FOLDER="llm_working_folder"
OPENAI_MODEL_NAME="llama-3.1-8b-instant"
OPENAI_API_KEY="your-api-key-here"
```

#### Frontend (.env)
Location: `frontend/.env`

```env
VITE_API_BASE_URL=http://localhost:5000
```

### 3. Start the Services

#### Terminal 1: Start the API Server
```bash
cd vigilant_AI/cyber-security-llm-agents
python api_server.py
```

Expected output:
```
Starting Vigilant AI API Server on port 5000...
 * Running on http://0.0.0.0:5000
```

#### Terminal 2: Start the Frontend
```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v5.x.x ready in xxx ms
➜  Local:   http://localhost:5173/
```

### 4. Access the Dashboard

Open your browser to: **http://localhost:5173**

---

## 🏗️ Integration Components

### Frontend Services

All services are located in `frontend/src/services/`

#### 1. **apiClient.js**
Central HTTP client with:
- Timeout handling (30s default)
- Error handling and retries
- Automatic JSON parsing
- Base URL configuration from env

#### 2. **adapters.js**
Data transformation layer:
- Converts backend responses to frontend format
- Maintains UI compatibility
- Handles field name mapping

#### 3. **Service Implementations**

| Service | File | Purpose |
|---------|------|---------|
| Agent Service | `agentService.js` | Fetch agent status, monitor agents |
| Log Service | `logService.js` | Retrieve logs from SQLite DB |
| Artifact Service | `artifactService.js` | Access files in llm_working_folder |
| Report Service | `reportService.js` | Generate reports from data |
| Coordinator Service | `coordinatorService.js` | Run scenarios, check status |

### Backend API Server

**File:** `vigilant_AI/cyber-security-llm-agents/api_server.py`

A lightweight Flask wrapper that exposes the backend via REST API **without modifying core backend logic**.

#### Key Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/agents` | GET | List all available agents |
| `/api/agents/<id>` | GET | Get specific agent details |
| `/api/logs` | GET | Retrieve logs (filters: level, agent, limit) |
| `/api/logs/stats` | GET | Aggregate log statistics |
| `/api/scenarios` | GET | List available scenarios |
| `/api/scenarios/<id>/run` | POST | Execute a scenario |
| `/api/scenarios/<id>/status` | GET | Check scenario execution status |
| `/api/artifacts` | GET | List all artifacts |
| `/api/artifacts/<path>` | GET | Download specific artifact |
| `/api/coordinator/status` | GET | Get coordinator status |
| `/api/health` | GET | Health check endpoint |

---

## 📊 Data Flow Examples

### Example 1: Loading Agents on Dashboard

1. **User** opens Dashboard page
2. **Dashboard** component calls `useAgents()` hook
3. **useAgents** calls `agentService.getAgents()`
4. **agentService** → `apiClient.get('/api/agents')`
5. **API Server** reads agent definitions and returns JSON
6. **apiClient** receives response
7. **adapters** transform backend format → frontend format
8. **Dashboard** displays agent cards

### Example 2: Running a Scenario

1. **User** clicks "Run Scenario" button
2. **Component** calls `coordinatorService.runScenario('DETECT_EDR')`
3. **coordinatorService** → `apiClient.post('/api/scenarios/DETECT_EDR/run')`
4. **API Server** spawns thread → calls `python run_agents.py DETECT_EDR`
5. **Backend** executes scenario, logs to SQLite
6. **API Server** returns `{ status: 'running', scenario_id: 'DETECT_EDR' }`
7. **Component** starts polling scenario status
8. **Frontend** displays live progress

### Example 3: Viewing Logs

1. **User** navigates to Logs page
2. **Logs** component calls `useLogs()` hook
3. **useLogs** calls `logService.streamLogs()` (polls every 2s)
4. **logService** → `apiClient.get('/api/logs', { limit: 100 })`
5. **API Server** queries `logs.db` SQLite database
6. **Adapters** transform DB rows → UI log format
7. **LogViewer** component displays formatted logs

---

## 🔧 Configuration

### Frontend Polling Intervals

You can customize polling behavior via environment variables:

```env
# frontend/.env
VITE_AGENT_POLL_INTERVAL=3000    # Agents refresh every 3s
VITE_LOG_POLL_INTERVAL=2000      # Logs refresh every 2s
VITE_STATUS_POLL_INTERVAL=3000   # Status refresh every 3s
```

To modify in code, edit the hook calls:
```javascript
// In useAgents.js
cleanup = agentService.subscribeToAgentUpdates(callback, 5000); // 5s interval
```

### Backend API Port

Change API server port:
```env
# vigilant_AI/cyber-security-llm-agents/.env
API_PORT=8080
```

Then update frontend:
```env
# frontend/.env
VITE_API_BASE_URL=http://localhost:8080
```

---

## 🧪 Testing the Integration

### 1. Check Backend Health

```bash
curl http://localhost:5000/api/health
```

Expected:
```json
{
  "status": "healthy",
  "timestamp": "2024-02-14T10:30:00.000Z"
}
```

### 2. List Agents

```bash
curl http://localhost:5000/api/agents
```

### 3. Trigger a Scenario

```bash
curl -X POST http://localhost:5000/api/scenarios/HELLO_AGENTS/run
```

### 4. Check Logs

```bash
curl "http://localhost:5000/api/logs?limit=10"
```

---

## 📁 File Structure

```
root/
├── frontend/
│   ├── src/
│   │   ├── services/
│   │   │   ├── apiClient.js          ← New: HTTP client
│   │   │   ├── adapters.js           ← New: Data transformations
│   │   │   ├── agentService.js       ← New: Real implementation
│   │   │   ├── logService.js         ← New: Real implementation
│   │   │   ├── artifactService.js    ← New: Real implementation
│   │   │   ├── reportService.js      ← New: Real implementation
│   │   │   ├── coordinatorService.js ← New: Real implementation
│   │   │   ├── mockAgentService.js   ← Old: Kept for reference
│   │   │   └── ...
│   │   ├── hooks/
│   │   │   ├── useAgents.js          ← Modified: Uses real service
│   │   │   ├── useLogs.js            ← Modified: Uses real service
│   │   │   └── useCoordinator.js     ← Modified: Uses real service
│   │   └── ...
│   ├── .env                           ← New: Environment config
│   └── .env.example                   ← New: Template
│
└── vigilant_AI/
    └── cyber-security-llm-agents/
        ├── api_server.py              ← New: Flask API wrapper
        ├── requirements.txt           ← Modified: Added Flask
        ├── .env                       ← Modified: Added API_PORT
        ├── run_agents.py              ← Unchanged
        ├── logs.db                    ← Used by API
        ├── llm_working_folder/        ← Served via API
        └── ...                        ← All other files unchanged
```

---

## 🔍 Troubleshooting

### Frontend can't connect to backend

**Symptom:** UI shows "Failed to fetch agents" or connection errors

**Solutions:**
1. Check backend is running: `curl http://localhost:5000/api/health`
2. Verify `VITE_API_BASE_URL` in `frontend/.env`
3. Check CORS is enabled (already configured in `api_server.py`)
4. Check browser console for detailed errors

### No logs displayed

**Symptom:** Logs page is empty

**Possible causes:**
1. No scenarios have been run yet → Run a scenario first
2. `logs.db` doesn't exist → Backend will create it on first scenario run
3. Backend not started → Start `api_server.py`

**Fix:**
```bash
cd vigilant_AI/cyber-security-llm-agents
python run_agents.py HELLO_AGENTS
# This creates logs.db
```

### Scenarios not running

**Symptom:** Clicking "Run Scenario" does nothing

**Check:**
1. Backend API server is running (not just frontend)
2. Python dependencies are installed
3. Check backend terminal for errors
4. Verify `.env` has correct `OPENAI_API_KEY`

### Artifacts not loading

**Symptom:** Artifacts page is empty

**Possible causes:**
1. `llm_working_folder/` is empty → Run scenarios to generate artifacts
2. Folder permissions issue

**Fix:**
```bash
cd vigilant_AI/cyber-security-llm-agents
ls -la llm_working_folder/
# Should show subfolders: caldera, code, pdf, http_server, ftp_server
```

---

## 🚦 Development Workflow

### Running in Development Mode

**Backend (with auto-reload):**
```bash
cd vigilant_AI/cyber-security-llm-agents
export FLASK_ENV=development  # Linux/Mac
# OR
set FLASK_ENV=development     # Windows
python api_server.py
```

**Frontend (with HMR):**
```bash
cd frontend
npm run dev
```

### Making Changes

#### Adding a New Service Method

1. **Define endpoint** in `api_server.py`:
```python
@app.route('/api/new-endpoint', methods=['GET'])
def new_endpoint():
    return jsonify({"data": "value"})
```

2. **Add service method** in appropriate service file:
```javascript
// frontend/src/services/someService.js
async getNewData() {
  const response = await apiClient.get('/api/new-endpoint');
  return response;
}
```

3. **Use in component/hook**:
```javascript
const data = await someService.getNewData();
```

---

## 📦 Deployment

### Production Build

#### Frontend
```bash
cd frontend
npm run build
# Outputs to: frontend/dist/
```

Serve with:
- **Nginx**
- **Apache**
- **Netlify/Vercel** (configure `VITE_API_BASE_URL` to production backend URL)

#### Backend
Use a production WSGI server:

```bash
pip install gunicorn
cd vigilant_AI/cyber-security-llm-agents
gunicorn -w 4 -b 0.0.0.0:5000 api_server:app
```

Or use **uWSGI**, **waitress**, etc.

### Environment Variables for Production

**Backend:**
```env
API_PORT=5000
FLASK_ENV=production
```

**Frontend:**
```env
VITE_API_BASE_URL=https://your-backend-domain.com
```

---

## 🎯 Key Design Decisions

### Why Flask instead of extending existing backend?

- **Non-invasive:** Backend remains untouched and production-ready
- **Separation of concerns:** API layer is independent
- **Easy maintenance:** Can be updated without affecting core agents

### Why polling instead of WebSockets?

- **Simplicity:** Easier to implement and debug
- **Compatibility:** Works with any HTTP server
- **Good enough:** 2-3s polling provides near real-time experience for this use case
- **Future:** Can upgrade to WebSockets without changing frontend hooks

### Why adapters?

- **Flexibility:** Backend and frontend models can evolve independently
- **Type safety:** Single source of transformation logic
- **Maintainability:** Easy to update if backend response structure changes

---

## 📚 Additional Resources

- [Frontend README](frontend/README.md)
- [Backend Documentation](vigilant_AI/cyber-security-llm-agents/documentation/)
- [Mock Data Reference](frontend/src/mock/mockData.js)

---

## ✅ Checklist

Before deploying:

- [ ] Backend dependencies installed (`pip install -r requirements.txt`)
- [ ] Frontend dependencies installed (`npm install`)
- [ ] Environment variables configured (`.env` files)
- [ ] API server starts without errors
- [ ] Frontend connects to backend successfully
- [ ] Health check endpoint responds
- [ ] At least one scenario has been run (to create logs.db)
- [ ] Artifacts are accessible
- [ ] Logs display correctly

---

## 🤝 Contributing

When extending this integration:

1. **Keep backend unchanged** unless absolutely necessary
2. **Add new endpoints** in `api_server.py`
3. **Update services** in `frontend/src/services/`
4. **Add adapters** for new data structures
5. **Update this documentation**

---

## 📝 License

[Same as parent project]

---

**Integration completed successfully! 🎉**

For issues or questions, please refer to the troubleshooting section or check the backend logs.
