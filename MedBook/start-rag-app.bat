@echo off
echo Starting MedBook RAG Application...

echo Starting RAG Backend Server...
start cmd /k "cd rag-backend && npm start"

echo Starting Frontend Server...
start cmd /k "cd frontend && npm run dev"

echo.
echo Servers started! Access the application at:
echo http://localhost:5173/chat4health
echo.
echo Press any key to exit this window...
pause > nul
