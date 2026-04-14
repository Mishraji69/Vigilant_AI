## Railway deployment (frontend + backend separately)

### Backend service (Flask, `vigilant_AI/cyber-security-llm-agents`)

- **Root directory**: `vigilant_AI/cyber-security-llm-agents`
- **Start command**: `python api_server.py`
- **Port binding**: backend prefers Railway’s injected `PORT` (falls back to `API_PORT` / `5000` locally)

**Set Railway variables (Backend)**:

- **`OPENAI_API_KEY`**: your provider key
- **`OPENAI_MODEL_NAME`**: model name for your provider
- **`CALDERA_SERVER`** / **`CALDERA_API_KEY`**: optional (only if using real Caldera)

Deploy, then copy the backend public URL.

---

### Frontend service (Vite, `frontend/`)

- **Root directory**: `frontend`
- **Start command**: (configured in `frontend/railway.json`)
  - `npm run build && npm run preview -- --host 0.0.0.0 --port $PORT`

**Set Railway variables (Frontend)**:

- **`VITE_API_BASE_URL`**: your backend Railway URL (example: `https://<your-backend>.up.railway.app`)

Important: Vite reads `VITE_*` variables at **build time**, so set this before deploy (or redeploy after setting it).

---

### Quick verification

**Backend health**:
- `GET /api/health`

**Frontend**:
- Open the Railway frontend URL in browser
- Run `HELLO_AGENTS` from the Dashboard

