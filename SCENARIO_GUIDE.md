# 🎯 Vigilant AI Scenario Execution Guide

Complete guide to executing all 9 security scenarios via the frontend interface.

---

## 🚀 Quick Start

### 1. Start the System

**Terminal 1 - Backend:**
```bash
cd vigilant_AI/cyber-security-llm-agents
python api_server.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Browser:** Open `http://localhost:5173`

---

## 📋 All 9 Available Scenarios

### 🧪 **Test/Demo Scenarios**

#### 1. **HELLO_AGENTS** - Cybersecurity Joke
- **Purpose**: Test basic LLM functionality
- **Requirements**: 
  - ✅ LLM API key configured
  - ❌ No Caldera needed
- **Duration**: ~5-10 seconds
- **What happens**:
  1. Text Analyst agent receives request
  2. LLM generates cybersecurity joke
  3. Response logged to database
- **Check results**: Go to **Logs** page

#### 2. **HELLO_CALDERA** - Message Box on Target
- **Purpose**: Test Caldera C2 connection
- **Requirements**:
  - ✅ LLM API key
  - ✅ Active Caldera server
  - ✅ Connected Caldera agent
- **Duration**: ~15-20 seconds
- **What happens**:
  1. Collects Caldera operation info
  2. Executes PowerShell on target
  3. Displays message box with joke
- **Check results**: Look at target machine screen + **Logs** page

---

### 🔍 **Reconnaissance Scenarios**

#### 3. **DETECT_EDR** - Identify Security Products
- **Purpose**: Detect endpoint security tools on target
- **Requirements**:
  - ✅ LLM API key
  - ✅ Active Caldera agent
  - ✅ Internet connection
- **Duration**: ~30-45 seconds
- **What happens**:
  1. Downloads EDR product list from GitHub
  2. Lists all Windows services on target via Caldera
  3. LLM compares and identifies security products (Elastic, CrowdStrike, Defender, etc.)
- **Output Example**:
  ```
  Detected Security Products:
  - Elastic Agent (ElasticEndpoint service)
  - Windows Defender (WinDefend service)
  ```
- **Check results**: **Logs** page

#### 4. **DETECT_AGENT_PRIVILEGES** - Check Privilege Level
- **Purpose**: Determine if agent runs as User/Admin/System
- **Requirements**:
  - ✅ LLM API key
  - ✅ Active Caldera agent
- **Duration**: ~20-30 seconds
- **What happens**:
  1. Collects Caldera operation info
  2. Executes `whoami /priv` via PowerShell
  3. LLM analyzes privileges and determines access level
- **Output Example**:
  ```
  Privilege Analysis:
  SeDebugPrivilege: Enabled
  Conclusion: Running with Administrator privileges
  ```
- **Check results**: **Logs** page

#### 5. **COLLECT_CALDERA_INFO** - Get C2 Metadata
- **Purpose**: Gather Caldera operation details
- **Requirements**:
  - ✅ LLM API key
  - ✅ Active Caldera server
- **Duration**: ~10-15 seconds
- **What happens**:
  1. Queries Caldera API for operation ID
  2. Gets agent PAW (unique identifier)
- **Output Example**:
  ```
  Operation ID: b0264667-e255-4455-bf8c-79fe83f049c7
  Agent PAW: ltkasc
  ```
- **Check results**: **Logs** page

---

### 📰 **Threat Intelligence Scenarios**

#### 6. **SUMMARIZE_RECENT_CISA_VULNS** - Latest Vulnerabilities
- **Purpose**: Get current exploited vulnerabilities from CISA
- **Requirements**:
  - ✅ LLM API key
  - ✅ Internet connection
  - ❌ No Caldera needed
- **Duration**: ~20-30 seconds
- **What happens**:
  1. Downloads CISA KEV JSON feed
  2. Extracts last 10 CVEs using `jq`
  3. LLM generates formatted summary table
- **Output Example**:
  ```
  | CVE ID | Product | Description |
  |--------|---------|-------------|
  | CVE-2024-1234 | Microsoft Exchange | RCE vulnerability |
  ```
- **Check results**: **Logs** page
- **Real-world use**: Stay updated on actively exploited vulnerabilities

#### 7. **TTP_REPORT_TO_TECHNIQUES** - Extract MITRE TTPs
- **Purpose**: Parse threat reports for attack techniques
- **Requirements**:
  - ✅ LLM API key
  - ✅ Internet connection
  - ❌ No Caldera needed
- **Duration**: ~30-60 seconds
- **What happens**:
  1. Downloads Microsoft threat intelligence report
  2. LLM extracts MITRE ATT&CK technique IDs (T1059, T1003, etc.)
- **Output Example**:
  ```
  Extracted Techniques:
  - T1059.001 (PowerShell)
  - T1003.001 (LSASS Memory)
  - T1078 (Valid Accounts)
  ```
- **Check results**: **Logs** page
- **Real-world use**: Convert blog posts to actionable TTPs

---

### 🕵️ **Research Scenarios**

#### 8. **IDENTIFY_EDR_BYPASS_TECHNIQUES** - Find Detection Gaps
- **Purpose**: Identify telemetry blind spots in EDR products
- **Requirements**:
  - ✅ LLM API key
  - ✅ Internet connection
  - ❌ No Caldera needed
- **Duration**: ~25-40 seconds
- **What happens**:
  1. Queries EDR-Telemetry GitHub project
  2. Extracts telemetry gaps for Elastic EDR
  3. Lists techniques with limited visibility
- **Output Example**:
  ```
  Elastic EDR Telemetry Gaps:
  - Process Injection (limited visibility)
  - Thread Execution Hijacking (not detected)
  ```
- **Check results**: **Logs** page
- **Real-world use**: Research evasion techniques for red team ops

---

### 🎭 **Advanced Scenarios**

#### 9. **TTP_REPORT_TO_ADVERSARY_PROFILE** - Build Attack Profile
- **Purpose**: Create Caldera adversary profile from threat report
- **Requirements**:
  - ✅ LLM API key
  - ✅ Active Caldera server
  - ✅ Internet connection
- **Duration**: ~60-120 seconds (complex workflow)
- **What happens**:
  1. Downloads DFIR threat report (e.g., IcedID ransomware)
  2. LLM extracts all MITRE techniques
  3. Matches techniques to Caldera abilities
  4. Creates new adversary profile in Caldera
  5. Adds matched abilities to profile
- **Output Example**:
  ```
  Created Adversary Profile: "IcedID to Dagon Locker"
  Added 12 abilities matching report TTPs
  Profile ID: abc123
  ```
- **Check results**: **Logs** page + Caldera web interface
- **Real-world use**: Emulate real-world threat actors for testing

---

## 🎮 How to Execute Scenarios

### **Step-by-Step Instructions:**

1. **Open Dashboard**
   - Navigate to `http://localhost:5173`
   - Click **Dashboard** in sidebar (home icon)

2. **Select Scenario**
   - Find the dropdown menu at top-right
   - Click to see all 9 scenarios
   - Scenarios marked with 🔗 require Caldera

3. **Review Scenario Details**
   - Once selected, an info card appears below stats
   - Shows category, requirements, and description

4. **Run Scenario**
   - Click **"▶ Run Scenario"** button
   - If Caldera required, confirm the warning prompt
   - Watch pipeline progress in real-time

5. **Monitor Execution**
   - **Current Scenario** card shows active scenario
   - **Pipeline Status** shows step-by-step progress
   - **Active Agents** count updates dynamically

6. **View Results**
   - Go to **Logs** page (left sidebar)
   - Logs auto-refresh every 2 seconds
   - Filter by agent or log level if needed

7. **Check Artifacts** (Advanced scenarios)
   - Go to **Artifacts** page
   - Browse `llm_working_folder/` for downloaded files

---

## 📊 Understanding the Dashboard

### **Status Cards:**
- **Coordinator Status**: Overall system state (idle/running/error)
- **Active Agents**: How many agents currently working
- **Tasks Completed**: Finished vs pending tasks
- **System Health**: Overall operational status

### **Pipeline Progress:**
- Shows multi-step scenarios visually
- **Pending**: Not started
- **Running**: Currently executing
- **Completed**: Successfully finished
- **Failed**: Encountered error

### **Server Status:**
- **HTTP Server**: Web server status (port 8000)
- **FTP Server**: File transfer server (port 2121)
- **Database**: SQLite logs database

---

## ⚙️ Configuration Requirements

### **All Scenarios Need:**
- Valid API key in `vigilant_AI/cyber-security-llm-agents/.env`:
  ```bash
  OPENAI_API_KEY=gsk_your_groq_key_here
  OPENAI_MODEL_NAME=llama-3.1-8b-instant
  ```

### **Caldera-Required Scenarios Need:**
1. **Caldera Server Running:**
   ```bash
   # Install and start Caldera separately
   # Default: http://localhost:8888
   ```

2. **Environment Variables:**
   ```bash
   CALDERA_SERVER=http://localhost:8888
   CALDERA_API_KEY=your_api_key
   ```

3. **Active Agent Connected:**
   - Deploy Caldera agent on target system
   - Agent must appear in Caldera web UI
   - Operation must be running

### **Internet-Required Scenarios:**
- Ensure firewall allows outbound connections
- Target URLs: GitHub, CISA, Microsoft Security Blog

---

## 🔍 Troubleshooting

### **Scenario Doesn't Start:**
- ✅ Check backend terminal for errors
- ✅ Verify API key is valid
- ✅ For Caldera scenarios, check agent connection
- ✅ Check browser console (F12) for errors

### **Pipeline Stays at "Pending":**
- **This is normal** - many scenarios complete in 5-10 seconds
- Goes: Idle → Running (briefly) → Idle
- Check **Logs** page to confirm completion

### **No Logs Appear:**
- Wait 10-15 seconds for polling
- Click refresh button on Logs page
- Check `logs.db` file exists in backend folder
- Manually run: `python run_agents.py HELLO_AGENTS`

### **Caldera Scenarios Fail:**
- Verify Caldera server accessible: `curl http://localhost:8888`
- Check agent is "trusted" in Caldera UI
- Ensure operation is running (not stopped)
- Check `CALDERA_API_KEY` is correct

---

## 💡 Tips & Best Practices

### **Testing the System:**
1. Always start with **HELLO_AGENTS** (simplest)
2. Then try **SUMMARIZE_RECENT_CISA_VULNS** (no Caldera)
3. Only then test Caldera scenarios

### **Monitoring Results:**
- Keep **Logs** page open in second browser tab
- Use filter dropdown to isolate specific agent logs
- Export logs as JSON for analysis

### **For Demonstrations:**
- **DETECT_EDR** is visually impressive
- **TTP_REPORT_TO_ADVERSARY_PROFILE** shows full capability
- **HELLO_CALDERA** has physical target machine feedback

### **For Development:**
- Check `actions/agent_actions.py` to understand scenario logic
- Check `logs.db` with SQLite browser for raw data
- Monitor backend terminal for detailed errors

---

## 📚 Additional Resources

- **Integration Docs**: [INTEGRATION.md](INTEGRATION.md)
- **Quick Start**: [QUICKSTART.md](QUICKSTART.md)
- **Backend Code**: `vigilant_AI/cyber-security-llm-agents/actions/agent_actions.py`
- **Frontend Code**: `frontend/src/pages/Dashboard.jsx`
- **API Endpoints**: `vigilant_AI/cyber-security-llm-agents/api_server.py`

---

## 🎯 Summary

You now have **9 powerful scenarios** accessible via dropdown:
- ✅ 3 work without Caldera (great for testing)
- ✅ 6 require Caldera (full C2 capabilities)
- ✅ All scenarios complete in 5-120 seconds
- ✅ Results visible in Logs page
- ✅ Real-time progress monitoring

**Ready to test? Start with HELLO_AGENTS!** 🚀
