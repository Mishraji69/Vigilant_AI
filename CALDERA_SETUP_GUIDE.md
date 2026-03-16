# 🔧 Caldera VM Setup Guide for Vigilant AI

Complete guide to setting up MITRE Caldera on VMs so the 5 Caldera-based scenarios work on your website.

---

## 📋 Prerequisites

- **VirtualBox** or **VMware** (for running VMs)
- **2 VMs** (or 1 VM if running Caldera locally):
  - **Caldera Server VM**: Ubuntu 22.04 LTS (2GB RAM, 20GB disk) 
  - **Target/Agent VM**: Windows 10/11 (4GB RAM, 40GB disk)
- **Host Machine**: Your current Windows PC running the Vigilant AI backend

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│  Host Machine (Your PC - Windows)                          │
│  - Vigilant AI Backend (Port 5000)                         │
│  - Vigilant AI Frontend (Port 5173)                        │
│  - Connects to Caldera API                                 │
└────────────────┬────────────────────────────────────────────┘
                 │ HTTP API Calls
                 ↓
┌─────────────────────────────────────────────────────────────┐
│  VM 1: Caldera Server (Ubuntu)                             │
│  IP: 192.168.1.100 (example)                               │
│  - Caldera Server (Port 8888)                              │
│  - Accepts API requests from backend                       │
│  - Manages agents                                          │
└────────────────┬────────────────────────────────────────────┘
                 │ C2 Connection
                 ↓
┌─────────────────────────────────────────────────────────────┐
│  VM 2: Target Machine (Windows)                            │
│  IP: 192.168.1.101 (example)                               │
│  - Caldera Agent (Sandcat)                                 │
│  - Receives commands from Caldera Server                   │
│  - Executes security tests                                 │
└─────────────────────────────────────────────────────────────┘
```

---

## 🖥️ Part 1: Set Up Caldera Server VM (Ubuntu)

### Step 1.1: Create Ubuntu VM

1. **Download Ubuntu 22.04 LTS**
   - Get from: https://ubuntu.com/download/desktop
   - Version: 22.04.x LTS

2. **Create VM in VirtualBox/VMware**
   - Name: `Caldera-Server`
   - RAM: 2GB minimum (4GB recommended)
   - Disk: 20GB
   - Network: **Bridged Adapter** (so host can reach it)

3. **Install Ubuntu**
   - Username: `caldera`
   - Password: `caldera123`
   - Skip updates during installation (do later)

### Step 1.2: Install Dependencies

Open terminal in Ubuntu VM:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Python 3.10+
sudo apt install python3 python3-pip python3-venv -y

# Install Git
sudo apt install git -y

# Install Go 1.19+ (required for Caldera)
wget https://go.dev/dl/go1.21.5.linux-amd64.tar.gz
sudo rm -rf /usr/local/go
sudo tar -C /usr/local -xzf go1.21.5.linux-amd64.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
source ~/.bashrc

# Verify Go installation
go version  # Should show: go version go1.21.5 linux/amd64

# Install Node.js and npm (for Vue UI)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify Node installation
node --version  # Should show v20.x.x
npm --version   # Should show 10.x.x
```

### Step 1.3: Clone and Install Caldera

```bash
# Clone Caldera with all plugins
cd ~
git clone https://github.com/mitre/caldera.git --recursive
cd caldera

# Install Python dependencies
pip3 install -r requirements.txt

# Build Vue UI (takes 5-10 minutes)
cd plugins/magma
npm install
npm run build
cd ~/caldera
```

### Step 1.4: Configure Caldera

```bash
# Edit config file
nano conf/default.yml
```

**Update these settings:**

```yaml
# Change these lines (around line 1-10):
api_key_red: YOUR_SECURE_API_KEY_123  # Change from ADMIN123
api_key_blue: YOUR_BLUE_API_KEY_456   # Change from BLUEADMIN123

# Keep these default:
host: 0.0.0.0
port: 8888

# Users (around line 57-61):
users:
  red:
    admin: YOUR_ADMIN_PASSWORD  # Change from 'admin'
    red: red
  blue:
    blue: blue
```

Press `Ctrl+O` to save, `Ctrl+X` to exit.

### Step 1.5: Start Caldera Server

```bash
# Start Caldera (keep terminal open)
cd ~/caldera
python3 server.py --insecure

# You should see:
# "All systems ready."
# "Access red team interface at http://0.0.0.0:8888"
```

### Step 1.6: Get Caldera Server IP Address

Open **new terminal** in Ubuntu VM:

```bash
# Get IP address
ip addr show | grep "inet "

# Look for something like:
# inet 192.168.1.100/24 ...
# This is your Caldera Server IP!
```

**Write down this IP address** (you'll need it later).

### Step 1.7: Test Caldera Web UI

On your **host Windows PC**, open browser:

```
http://192.168.1.100:8888
```

Login credentials:
- Username: `admin`
- Password: `YOUR_ADMIN_PASSWORD` (from Step 1.4)

✅ **Success if**: You see the Caldera red team dashboard.

---

## 🪟 Part 2: Set Up Target VM (Windows)

### Step 2.1: Create Windows VM

1. **Get Windows 10/11 VM**
   - Option A: Download eval from Microsoft (free 90 days)
     - https://developer.microsoft.com/en-us/windows/downloads/virtual-machines/
   - Option B: Use your own Windows ISO

2. **Create VM**
   - Name: `Caldera-Target`
   - RAM: 4GB minimum
   - Disk: 40GB
   - Network: **Bridged Adapter** (same network as Caldera Server)

3. **Install Windows**
   - Set up with local account
   - Disable Windows Defender (for testing only!)
     ```powershell
     # Run PowerShell as Administrator
     Set-MpPreference -DisableRealtimeMonitoring $true
     ```

### Step 2.2: Get Target VM IP Address

In Windows VM, open PowerShell:

```powershell
ipconfig

# Look for:
# IPv4 Address. . . . : 192.168.1.101
```

**Write down this IP address**.

### Step 2.3: Download Sandcat Agent

In Windows VM, open PowerShell as Administrator:

```powershell
# Download Sandcat agent from Caldera Server
# Replace 192.168.1.100 with your Caldera Server IP
$server = "http://192.168.1.100:8888"

# Download agent
Invoke-WebRequest -Uri "$server/file/download" `
  -Method POST `
  -Headers @{"file"="sandcat.go"} `
  -OutFile "C:\Users\Public\sandcat.exe"

# Alternatively, download from Caldera UI:
# 1. Go to Caldera UI in browser: http://192.168.1.100:8888
# 2. Click "Agents" tab
# 3. Click "Deploy an agent"
# 4. Select "Sandcat"
# 5. Select platform: "Windows"
# 6. Copy the command and run it in PowerShell
```

### Step 2.4: Start Sandcat Agent

Still in PowerShell as Administrator:

```powershell
# Start agent (connects back to Caldera Server)
# Replace 192.168.1.100 with your Caldera Server IP
cd C:\Users\Public
.\sandcat.exe -server http://192.168.1.100:8888 -group red

# Keep this PowerShell window open
# You should see: "Beacon sent successfully"
```

### Step 2.5: Verify Agent Connection

Back on your **host Windows PC**, go to Caldera UI:

```
http://192.168.1.100:8888
```

1. Go to **"Agents"** tab
2. You should see **1 active agent** listed:
   - **PAW**: Random string (e.g., `xj8s2k`)
   - **Platform**: Windows
   - **Status**: Active (green dot)

✅ **Success if**: Agent shows as "Active" with green status.

---

## 🔗 Part 3: Connect Vigilant AI to Caldera

### Step 3.1: Update Backend .env File

On your **host Windows PC**, edit:

```
c:\Users\mishr\OneDrive\Desktop\baap\vigilant_AI\cyber-security-llm-agents\.env
```

**Update these lines:**

```bash
# Replace <caldera hostname> with your Caldera Server IP
CALDERA_SERVER=http://192.168.1.100:8888

# Replace <CALDERA API KEY> with your API key from Step 1.4
CALDERA_API_KEY=YOUR_SECURE_API_KEY_123
```

Save the file.

### Step 3.2: Restart Backend

Open terminal:

```bash
# Stop backend (Ctrl+C if running)

# Restart it
cd c:\Users\mishr\OneDrive\Desktop\baap\vigilant_AI\cyber-security-llm-agents
python api_server.py
```

### Step 3.3: Test Connection

Open new terminal:

```bash
# Test if backend can reach Caldera API
curl -H "KEY: YOUR_SECURE_API_KEY_123" http://192.168.1.100:8888/api/v2/agents
```

✅ **Success if**: You see JSON response with your agent listed.

---

## 🧪 Part 4: Test Caldera Scenarios

### Step 4.1: Open Vigilant AI Dashboard

Browser: `http://localhost:5173`

### Step 4.2: Test Scenarios

Try each Caldera scenario in order:

#### 1. **COLLECT_CALDERA_INFO** (Easiest - API only)
- Click "Run Scenario"
- Select: `COLLECT_CALDERA_INFO`
- Expected result:
  ```
  Operation ID: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
  Agent PAW: xj8s2k
  ```

#### 2. **HELLO_CALDERA** (Send message box to target)
- Run scenario: `HELLO_CALDERA`
- **On Target VM**: You should see a PowerShell message box pop up with a joke
- Expected result: "Command executed successfully"

#### 3. **DETECT_AGENT_PRIVILEGES** (Check admin rights)
- Run scenario: `DETECT_AGENT_PRIVILEGES`
- Expected result:
  ```
  Privilege Analysis:
  SeDebugPrivilege: Enabled
  Conclusion: Running with Administrator privileges
  ```

#### 4. **DETECT_EDR** (Check for security software)
- Run scenario: `DETECT_EDR`
- Expected result:
  ```
  Detected Security Products:
  - Windows Defender (WinDefend service)
  ```

#### 5. **TTP_REPORT_TO_ADVERSARY_PROFILE** (Create adversary)
- Run scenario: `TTP_REPORT_TO_ADVERSARY_PROFILE`
- Expected result: New adversary profile created in Caldera
- Verify in Caldera UI → Adversaries tab

---

## ⚠️ Important Notes

### Network Configuration

**All machines must be on same network:**
- Host Windows PC: Can reach Caldera Server VM
- Caldera Server VM: Can accept connections from Host
- Target VM: Can reach Caldera Server VM

**Test connectivity:**

From Host PC:
```bash
ping 192.168.1.100  # Should respond
```

From Target VM:
```powershell
Test-NetConnection 192.168.1.100 -Port 8888  # Should succeed
```

### Firewall Rules

**On Caldera Server VM (Ubuntu):**
```bash
# Allow port 8888
sudo ufw allow 8888/tcp
sudo ufw enable
sudo ufw status
```

**On Target VM (Windows):**
```powershell
# Allow outbound to Caldera (usually allowed by default)
# If issues, disable Windows Firewall temporarily for testing
```

### LLM Reliability Reminder

⚠️ **Even with Caldera properly configured, the scenarios may still be unreliable** due to the LLM (llama-3.3-70b-versatile) tool-calling limitations mentioned earlier.

For production use, consider:
- Upgrading to GPT-4 or Claude API
- Using direct Caldera API calls (bypass LLM agents)

---

## 🐛 Troubleshooting

### "Cannot connect to Caldera API"

**Check:**
1. Caldera Server VM is running: `python3 server.py --insecure`
2. IP address is correct in `.env`
3. API key matches between `conf/default.yml` and `.env`
4. Firewall allows port 8888
5. Test: `curl http://192.168.1.100:8888/api/v2/health`

### "No agents available"

**Check:**
1. Sandcat agent is running on Target VM
2. Agent shows as "Active" in Caldera UI
3. Agent can reach Caldera Server (network connectivity)
4. Windows Defender is disabled on Target VM

### "Agent commands timeout"

**Possible causes:**
1. Sandcat agent crashed - restart it
2. Network latency - increase timeout in scenario code
3. Command blocked by Windows security - disable AV

### "Scenarios return empty results"

**This is the LLM issue:**
- llama-3.3-70b-versatile may hallucinate results
- Try running scenario multiple times
- Check Logs page for actual API responses
- Consider upgrading to better LLM model

---

## 🎯 Success Checklist

Before testing scenarios, verify:

- [ ] Caldera Server VM running Ubuntu
- [ ] Caldera Server accessible at `http://192.168.1.100:8888`
- [ ] Can login to Caldera web UI
- [ ] Target Windows VM created
- [ ] Sandcat agent running on Target VM
- [ ] Agent shows as "Active" in Caldera UI (green status)
- [ ] Backend `.env` updated with correct IP and API key
- [ ] Backend can reach Caldera API (curl test passes)
- [ ] All VMs on same network and can ping each other

---

## 📚 Additional Resources

- **Caldera Documentation**: https://caldera.readthedocs.io/
- **Caldera Training Videos**: https://www.youtube.com/playlist?list=PLF2bj1pw7-ZvLTjIwSaTXNLN2D2yx-wXH
- **Sandcat Agent Guide**: https://github.com/mitre/sandcat
- **Caldera API Reference**: http://192.168.1.100:8888/api/docs

---

## 🔐 Security Warnings

⚠️ **This setup is for TESTING ONLY in isolated environments:**

1. **Never run Caldera agents on production systems**
2. **Keep VMs isolated** from your main network
3. **Disable Windows Defender** only on test VMs
4. **Use strong passwords** for Caldera (change from defaults)
5. **Don't expose Caldera Server** to the internet
6. **Delete test VMs** when done with security research

---

## 🎉 Quick Start Summary

**1-2-3 Setup (30 minutes):**

1. **Ubuntu VM**: Install Caldera Server
   ```bash
   git clone https://github.com/mitre/caldera.git --recursive
   cd caldera && pip3 install -r requirements.txt
   python3 server.py --insecure
   ```

2. **Windows VM**: Run Sandcat Agent
   ```powershell
   .\sandcat.exe -server http://192.168.1.100:8888 -group red
   ```

3. **Host PC**: Update `.env` and restart backend
   ```bash
   CALDERA_SERVER=http://192.168.1.100:8888
   CALDERA_API_KEY=YOUR_SECURE_API_KEY_123
   ```

Test scenario: `COLLECT_CALDERA_INFO` → Should return operation ID and agent PAW.

---

**Need help? Check logs:**
- Caldera Server: Terminal where `python3 server.py` is running
- Vigilant AI Backend: Terminal where `python api_server.py` is running  
- Browser Console: F12 → Console tab
