@echo off
echo ========================================
echo    அகத்தியர் Store - Starting...
echo ========================================
echo.

echo [1/2] Starting Python Backend...
start "Backend" cmd /k "cd backend && pip install -r requirements.txt && python app.py"

timeout /t 3 /nobreak > nul

echo [2/2] Starting React Frontend...
start "Frontend" cmd /k "cd frontend && npm install && npm start"

echo.
echo ✅ Done! Browser-ல் http://localhost:3000 open ஆகும்
echo.
pause
