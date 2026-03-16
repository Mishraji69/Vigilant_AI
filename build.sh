#!/bin/bash
# Build script for Railway deployment
# Builds React frontend and copies dist to Flask's static_frontend directory

set -e

echo "=== Building Vigilant AI ==="

# 1. Install Python dependencies
echo "--- Installing Python dependencies ---"
cd vigilant_AI/cyber-security-llm-agents
pip install -r requirements.txt
cd ../..

# 2. Build React frontend
echo "--- Building React frontend ---"
cd frontend
npm install
VITE_API_BASE_URL="" npm run build
cd ..

# 3. Copy built frontend to Flask's static_frontend directory
echo "--- Copying frontend build to backend ---"
rm -rf vigilant_AI/cyber-security-llm-agents/static_frontend
cp -r frontend/dist vigilant_AI/cyber-security-llm-agents/static_frontend

echo "=== Build complete ==="
ls -la vigilant_AI/cyber-security-llm-agents/static_frontend/
