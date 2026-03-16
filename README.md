# Vigilant AI - Cybersecurity Simulation Platform

> **Collaborative LLM-driven cybersecurity simulation platform with React dashboard**

A full-stack application combining a Python-based multi-agent cybersecurity backend with a modern React dashboard for visualization and control.

---

## 🌟 Features

- **Multi-Agent System**: Coordinated AI agents for cybersecurity operations
- **Scenario Execution**: Pre-defined and custom security scenarios
- **Real-time Monitoring**: Live agent status and log streaming
- **Artifact Management**: Centralized storage and retrieval of operation outputs
- **Interactive Dashboard**: Modern React UI with real-time updates
- **Report Generation**: Automated analysis and reporting

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Dashboard                          │
│              (Port 5173 - Development)                      │
└─────────────────┬───────────────────────────────────────────┘
                  │ REST API
                  ↓
┌─────────────────────────────────────────────────────────────┐
│              Flask API Server (Port 5000)                   │
└─────────────────┬───────────────────────────────────────────┘
                  │ Direct Access
                  ↓
┌─────────────────────────────────────────────────────────────┐
│           Vigilant AI Backend (Python)                      │
│  • Agent Orchestration  • SQLite Logging                    │
│  • Caldera Integration  • Artifact Storage                  │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- **Python 3.8+** with pip
- **Node.js 18+** with npm
- **Git**

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd baap
```

2. **Install Backend Dependencies**
```bash
cd vigilant_AI/cyber-security-llm-agents
pip install -r requirements.txt
cd ../..
```

3. **Install Frontend Dependencies**
```bash
cd frontend
npm install
cd ..
```

4. **Configure Environment**

Copy and update environment files:
```bash
# Backend
cp vigilant_AI/cyber-security-llm-agents/.env.example vigilant_AI/cyber-security-llm-agents/.env

# Frontend
cp frontend/.env.example frontend/.env
```

Update `vigilant_AI/cyber-security-llm-agents/.env`:
- Set your `OPENAI_API_KEY` (or Groq API key)
- Configure `CALDERA_SERVER` and `CALDERA_API_KEY` if using Caldera

### Running the Application

#### Option 1: Using Startup Scripts

**Windows:**
```bash
start.bat
```

**Linux/Mac:**
```bash
chmod +x start.sh
./start.sh
```

#### Option 2: Manual Start

**Terminal 1 - Backend API:**
```bash
cd vigilant_AI/cyber-security-llm-agents
python api_server.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

### Access the Dashboard

Open your browser to: **http://localhost:5173**

---

## 📁 Project Structure

```
baap/
├── frontend/                    # React dashboard
│   ├── src/
│   │   ├── components/         # UI components
│   │   ├── pages/              # Page components
│   │   ├── services/           # API integration layer
│   │   ├── hooks/              # React hooks
│   │   └── layout/             # Layout components
│   ├── package.json
│   └── vite.config.js
│
├── vigilant_AI/                 # Python backend
│   └── cyber-security-llm-agents/
│       ├── api_server.py       # Flask API wrapper (NEW)
│       ├── run_agents.py       # Agent orchestration
│       ├── agents/             # Agent implementations
│       ├── tools/              # Tool definitions
│       ├── utils/              # Utilities
│       ├── actions/            # Scenario definitions
│       ├── logs.db             # SQLite logs (created on first run)
│       └── llm_working_folder/ # Artifact storage
│
├── INTEGRATION.md              # Detailed integration guide
├── start.sh                    # Linux/Mac startup script
├── start.bat                   # Windows startup script
└── README.md                   # This file
```

---

## 🎮 Usage

### Running a Scenario

1. Open the dashboard at http://localhost:5173
2. Navigate to **Dashboard** or **Agents** page
3. Select a scenario (e.g., "DETECT_EDR", "HELLO_AGENTS")
4. Click **Run Scenario**
5. Monitor progress in real-time

### Viewing Logs

1. Navigate to **Logs** page
2. Logs stream automatically every 2 seconds
3. Filter by:
   - **Level**: INFO, WARN, ERROR
   - **Agent**: Coordinator, Recon Agent, etc.
4. Export logs as JSON if needed

### Browsing Artifacts

1. Navigate to **Artifacts** page
2. Browse folder structure:
   - `caldera/` - Caldera-related outputs
   - `code/` - Code execution results
   - `pdf/` - Generated reports
   - `http_server/` - Web server files
3. Download or preview files

### Generating Reports

1. Navigate to **Reports** page
2. View auto-generated summaries
3. Export reports as JSON/CSV

---

## 🔧 Configuration

### Backend Configuration

File: `vigilant_AI/cyber-security-llm-agents/.env`

```env
# API Server
API_PORT=5000

# LLM Configuration
OPENAI_MODEL_NAME="llama-3.1-8b-instant"
OPENAI_API_KEY="your-api-key-here"

# Caldera (Optional)
CALDERA_SERVER="http://localhost:8888"
CALDERA_API_KEY="your-caldera-key"

# Working Directory
LLM_WORKING_FOLDER="llm_working_folder"
```

### Frontend Configuration

File: `frontend/.env`

```env
# Backend API URL
VITE_API_BASE_URL=http://localhost:5000

# Polling Intervals (optional)
VITE_AGENT_POLL_INTERVAL=3000
VITE_LOG_POLL_INTERVAL=2000
```

---

## 📚 Available Scenarios

| Scenario ID | Description |
|-------------|-------------|
| `HELLO_AGENTS` | Simple test scenario |
| `DETECT_EDR` | Detect endpoint security products |
| `DETECT_AGENT_PRIVILEGES` | Check agent privileges |
| `COLLECT_CALDERA_INFO` | Gather Caldera operation info |
| `IDENTIFY_EDR_BYPASS_TECHNIQUES` | Find EDR telemetry gaps |
| `SUMMARIZE_RECENT_CISA_VULNS` | Analyze recent CISA vulnerabilities |

To run via CLI:
```bash
cd vigilant_AI/cyber-security-llm-agents
python run_agents.py DETECT_EDR
```

---

## 🔍 API Endpoints

The Flask API server exposes the following endpoints:

### Agents
- `GET /api/agents` - List all agents
- `GET /api/agents/<id>` - Get agent details

### Logs
- `GET /api/logs` - Retrieve logs (query params: level, agent, limit)
- `GET /api/logs/stats` - Get log statistics

### Scenarios
- `GET /api/scenarios` - List scenarios
- `POST /api/scenarios/<id>/run` - Execute scenario
- `GET /api/scenarios/<id>/status` - Check scenario status

### Artifacts
- `GET /api/artifacts` - List all artifacts
- `GET /api/artifacts/<path>` - Download artifact

### Coordinator
- `GET /api/coordinator/status` - Get system status

### Health
- `GET /api/health` - Health check

---

## 🧪 Development

### Running Tests

**Backend:**
```bash
cd vigilant_AI/cyber-security-llm-agents
python -m pytest
```

**Frontend:**
```bash
cd frontend
npm test
```

### Building for Production

**Frontend:**
```bash
cd frontend
npm run build
# Output: frontend/dist/
```

**Backend:**
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 api_server:app
```

### Code Style

- **Backend**: PEP 8, run `flake8`
- **Frontend**: ESLint, run `npm run lint`

---

## 🐛 Troubleshooting

### Issue: Backend won't start

**Check:**
1. Python dependencies installed: `pip install -r requirements.txt`
2. `.env` file exists with valid API keys
3. Port 5000 is not in use

### Issue: Frontend can't connect

**Check:**
1. Backend is running: `curl http://localhost:5000/api/health`
2. `VITE_API_BASE_URL` in `frontend/.env` is correct
3. CORS is enabled (already configured)

### Issue: No logs appear

**Solution:** Run a scenario first to create the logs database:
```bash
python run_agents.py HELLO_AGENTS
```

### Issue: Scenarios fail to execute

**Check:**
1. Valid `OPENAI_API_KEY` in backend `.env`
2. Backend terminal shows detailed error logs
3. Network connectivity for API calls

For more troubleshooting, see [INTEGRATION.md](INTEGRATION.md#troubleshooting).

---

## 📖 Documentation

- **[INTEGRATION.md](INTEGRATION.md)** - Detailed integration guide
- **[frontend/README.md](frontend/README.md)** - Frontend documentation
- **Backend Docs** - See `vigilant_AI/cyber-security-llm-agents/documentation/`

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

[Specify License]

---

## 🙏 Acknowledgments

- Built on the **Vigilant AI** cybersecurity platform
- Uses **AutoGen** for multi-agent orchestration
- Powered by **OpenAI**/**Groq** LLMs
- Integrates with **MITRE Caldera**

---

## 📞 Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Contact the development team
- Check the [INTEGRATION.md](INTEGRATION.md) guide

---

**Made with ❤️ for cybersecurity research and education**
