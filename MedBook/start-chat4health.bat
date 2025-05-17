@echo off
echo Starting Chat4Health application...

echo Starting backend server...
start cmd /k "cd rag-backend && node server.js"

echo Waiting for backend to initialize...
timeout /t 5 /nobreak > nul

echo Starting frontend...
start cmd /k "cd frontend && npm run dev"

echo Chat4Health application started!
echo Backend: http://localhost:5001
echo Frontend: http://localhost:5173/chat4health
