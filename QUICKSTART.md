# 🚀 Quick Start Checklist

Follow these steps to get Vigilant AI running:

## ✅ Pre-Flight Checklist

### 1. System Requirements
- [ ] Python 3.8+ installed (`python --version`)
- [ ] Node.js 18+ installed (`node --version`)
- [ ] Git installed
- [ ] 4GB+ RAM available
- [ ] 2GB+ disk space available

### 2. Installation

#### Backend Setup
```bash
cd vigilant_AI/cyber-security-llm-agents
pip install -r requirements.txt
```
- [ ] All Python packages installed successfully
- [ ] No error messages

#### Frontend Setup
```bash
cd frontend
npm install
```
- [ ] All npm packages installed successfully
- [ ] No error messages

### 3. Configuration

#### Backend `.env` file
Location: `vigilant_AI/cyber-security-llm-agents/.env`

- [ ] File exists
- [ ] `API_PORT=5000` is set
- [ ] `OPENAI_API_KEY` has a valid key (or Groq key starting with `gsk_`)
- [ ] `OPENAI_MODEL_NAME` is set
- [ ] `LLM_WORKING_FOLDER="llm_working_folder"` is set

#### Frontend `.env` file
Location: `frontend/.env`

- [ ] File exists
- [ ] `VITE_API_BASE_URL=http://localhost:5000` is set

### 4. First Run

#### Terminal 1 - Start Backend
```bash
cd vigilant_AI/cyber-security-llm-agents
python api_server.py
```

Expected output:
```
Starting Vigilant AI API Server on port 5000...
 * Running on http://0.0.0.0:5000
```

- [ ] Backend starts without errors
- [ ] Port 5000 is listening

**Test it:**
```bash
curl http://localhost:5000/api/health
```
Should return: `{"status": "healthy", "timestamp": "..."}`

- [ ] Health check passes

#### Terminal 2 - Start Frontend
```bash
cd frontend
npm run dev
```

Expected output:
```
VITE v5.x.x ready in xxx ms
➜  Local:   http://localhost:5173/
```

- [ ] Frontend starts without errors
- [ ] Port 5173 is listening

### 5. First Test

#### Open Dashboard
- [ ] Navigate to http://localhost:5173
- [ ] Dashboard loads successfully
- [ ] No console errors (press F12 to check)

#### Check Agents Page
- [ ] Navigate to "Agents" page
- [ ] Four agents are displayed:
  - Caldera Agent
  - Internet Agent
  - Text Analyst
  - Command Executor
- [ ] All agents show "idle" status

#### Run Test Scenario
- [ ] Navigate to "Dashboard" page
- [ ] Click "Run Scenario" or similar button
- [ ] Select "HELLO_AGENTS" scenario
- [ ] Scenario starts running
- [ ] Backend terminal shows agent activity

#### Check Logs
- [ ] Navigate to "Logs" page
- [ ] Logs appear (may take a few seconds)
- [ ] New logs stream in automatically

### 6. Verify Integration

- [ ] Agents status updates automatically
- [ ] Logs refresh every ~2 seconds
- [ ] Artifacts page loads (may be empty initially)
- [ ] Reports page loads
- [ ] Settings page loads

---

## 🎉 Success Criteria

You've successfully integrated the system if:

1. ✅ Backend API responds to health check
2. ✅ Frontend loads without errors
3. ✅ Agents are visible in the dashboard
4. ✅ You can run a scenario
5. ✅ Logs appear after running a scenario
6. ✅ No connection errors in browser console

---

## 🐛 Common Issues

### Backend won't start

**Error:** `ModuleNotFoundError: No module named 'flask'`

**Fix:**
```bash
cd vigilant_AI/cyber-security-llm-agents
pip install -r requirements.txt
```

---

### Frontend shows "Failed to fetch"

**Error:** Network errors in console

**Fix:**
1. Ensure backend is running: `curl http://localhost:5000/api/health`
2. Check `VITE_API_BASE_URL` in `frontend/.env`
3. Restart both servers

---

### Logs page is empty

**Reason:** No scenarios have been run yet

**Fix:**
1. Run a scenario from the Dashboard
2. Wait ~10 seconds
3. Refresh Logs page

OR run manually:
```bash
cd vigilant_AI/cyber-security-llm-agents
python run_agents.py HELLO_AGENTS
```

---

### OpenAI API errors

**Error:** `Authentication error` or `Invalid API key`

**Fix:**
1. Check `OPENAI_API_KEY` in backend `.env`
2. Verify it's a valid key (OpenAI or Groq)
3. For Groq keys, ensure it starts with `gsk_`

---

## 📞 Need Help?

If you encounter issues:

1. Check [INTEGRATION.md](INTEGRATION.md) troubleshooting section
2. Check backend terminal for detailed errors
3. Check browser console (F12) for frontend errors
4. Verify all checklist items above are completed

---

## ⚠️ Known Limitations

### Scenario Reliability

**✅ Fully Functional Scenarios (Verified Working):**
1. **HELLO_AGENTS** - Cybersecurity joke generation
2. **SUMMARIZE_RECENT_CISA_VULNS** - CISA vulnerability feed analysis

**⚠️ Experimental Scenarios (Unreliable):**
- **IDENTIFY_EDR_BYPASS_TECHNIQUES** - LLM tool-calling inconsistent
- **TTP_REPORT_TO_TECHNIQUES** - LLM tool-calling inconsistent

**🔗 Requires Caldera C2 (Not Tested):**
- DETECT_EDR, DETECT_AGENT_PRIVILEGES, COLLECT_CALDERA_INFO, HELLO_CALDERA, TTP_REPORT_TO_ADVERSARY_PROFILE

### Why Some Scenarios Don't Work

The current LLM model (`llama-3.3-70b-versatile` on Groq) has limitations with tool execution:
- It sometimes **hallucinates** tool results instead of actually calling functions
- Sequential agent communication doesn't reliably pass tool outputs
- Complex shell commands may be ignored or executed incorrectly

**For Production Use:**
- Stick to the 2 verified working scenarios
- Or upgrade to stronger models (GPT-4, Claude) with better tool-calling support
- Or implement direct Python scripts instead of relying on LLM tool orchestration

---

## 🎯 Next Steps

Once everything is working:

1. **Explore Scenarios:**
   - Try the **verified working** scenarios from the Dashboard
   - Check `actions/agent_actions.py` for scenario implementations

2. **Customize:**
   - Modify polling intervals in frontend `.env`
   - Add custom scenarios in backend
   - Adjust UI components

3. **Deploy:**
   - See [INTEGRATION.md](INTEGRATION.md#deployment) for production setup

---

**Congratulations! Your Vigilant AI integration is ready! 🎉**
