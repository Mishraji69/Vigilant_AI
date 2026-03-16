#!/bin/bash

# Vigilant AI - Startup Script (Linux/Mac)
# Starts both backend API server and frontend dev server

echo "======================================"
echo "  Vigilant AI - Starting Services"
echo "======================================"
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+ first."
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

echo "✅ Python found: $(python3 --version)"
echo "✅ Node.js found: $(node --version)"
echo ""

# Start Backend API Server
echo "🚀 Starting Backend API Server..."
cd vigilant_AI/cyber-security-llm-agents
python3 api_server.py &
BACKEND_PID=$!
cd ../..

echo "   Backend PID: $BACKEND_PID"
echo "   Waiting for backend to start..."
sleep 3

# Check if backend is running
if curl -s http://localhost:5000/api/health > /dev/null 2>&1; then
    echo "✅ Backend is healthy!"
else
    echo "⚠️  Backend health check failed, but continuing..."
fi

echo ""

# Start Frontend Dev Server
echo "🚀 Starting Frontend Dev Server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "   Frontend PID: $FRONTEND_PID"
echo ""

echo "======================================"
echo "  ✅ Services Started Successfully!"
echo "======================================"
echo ""
echo "📊 Backend API:  http://localhost:5000"
echo "🎨 Frontend:     http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all services..."
echo ""

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo "✅ Services stopped."
    exit 0
}

trap cleanup INT TERM

# Wait for user interrupt
wait
