@echo off
REM Vigilant AI - Startup Script (Windows)
REM Starts both backend API server and frontend dev server

echo ======================================
echo   Vigilant AI - Starting Services
echo ======================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if errorlevel 1 (
    echo X Python is not installed. Please install Python 3.8+ first.
    pause
    exit /b 1
)

REM Check if Node.js is available
node --version >nul 2>&1
if errorlevel 1 (
    echo X Node.js is not installed. Please install Node.js 18+ first.
    pause
    exit /b 1
)

echo OK Python found
echo OK Node.js found
echo.

REM Start Backend API Server
echo Starting Backend API Server...
cd vigilant_AI\cyber-security-llm-agents
start "Vigilant AI Backend" cmd /k python api_server.py
cd ..\..

echo    Waiting for backend to start...
timeout /t 5 /nobreak >nul

echo.

REM Start Frontend Dev Server
echo Starting Frontend Dev Server...
cd frontend
start "Vigilant AI Frontend" cmd /k npm run dev
cd ..

echo.
echo ======================================
echo   Services Started Successfully!
echo ======================================
echo.
echo Backend API:  http://localhost:5000
echo Frontend:     http://localhost:5173
echo.
echo Two terminal windows have been opened.
echo Close them to stop the services.
echo.
pause
