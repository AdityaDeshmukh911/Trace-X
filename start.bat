@echo off
echo ===================================================
echo           STARTING TRACE-X PLATFORM
echo ===================================================
echo [1/2] Launching Backend on http://127.0.0.1:8000 ...
start "TRACE-X Backend" cmd /k "cd /d "%~dp0backend" && py -m uvicorn app.main:app --reload --port 8000"

echo [2/2] Launching Frontend on http://localhost:3001 ...
start "TRACE-X Frontend" cmd /k "cd /d "%~dp0frontend" && npm run dev"

echo.
echo ===================================================
echo TRACE-X is now running!
echo Open your browser at: http://localhost:3001
echo Login: aditya@mitaoe.ac.in / tracex@2024
echo ===================================================
timeout /t 3 >nul
start http://localhost:3001
