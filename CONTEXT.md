// This file provides context and documentation for the Vigilant AI project workspace.
// Add project-wide notes, architecture overviews, and key configuration details here.

/*
Project: Vigilant AI

Backend:
- Python (Flask, AutoGen, Groq API, SQLite)
- Key files: api_server.py, .env, actions/agent_actions.py, tools/web_tools.py
- Integrates with Caldera C2 (optional)

Frontend:
- React, Vite, TailwindCSS
- Key files: src/pages/Dashboard.jsx, src/services/

Data:
- CISA KEV dataset (JSON), NVD CVE feeds

Deployment:
- Ubuntu VM recommended for Caldera
- .env config required for backend

LLMs:
- Default: llama-3.3-70b-versatile
- Anthropic Claude Opus: not available by default (provider limitation)

Usage:
- See README.md in each folder for setup and usage instructions.
- For CISA data, see scripts in backend/tools or documentation folder.
*/
