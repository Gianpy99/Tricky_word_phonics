@echo off
title Tricky Words Phonics - Coral TPU Setup

echo.
echo =====================================
echo   Tricky Words Phonics Setup
echo   with Coral TPU Integration
echo =====================================
echo.

echo [1/5] Checking Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js NOT found!
    echo Please install Node.js from https://nodejs.org/
    echo Then run this script again.
    pause
    exit /b 1
)
echo ✅ Node.js found!

echo.
echo [2/5] Checking Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python NOT found!
    echo Please install Python 3.8+ from https://python.org/
    echo Then run this script again.
    pause
    exit /b 1
)
echo ✅ Python found!

echo.
echo [3/5] Installing Node.js dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install Node.js dependencies
    pause
    exit /b 1
)
echo ✅ Node.js dependencies installed!

echo.
echo [4/5] Setting up Python backend...
cd backend
if not exist "coral_env" (
    echo Creating Python virtual environment...
    python -m venv coral_env
)

echo Activating virtual environment...
call coral_env\Scripts\activate.bat

echo Installing Python dependencies...
pip install --upgrade pip
pip install -r requirements.txt
if errorlevel 1 (
    echo ❌ Failed to install Python dependencies
    echo Please check your Python installation and internet connection
    echo.
    echo Common solutions:
    echo - Ensure Python 3.8-3.11 is installed
    echo - Check internet connection
    echo - Try running as administrator
    pause
    exit /b 1
)

echo Creating dummy AI models for testing...
python create_dummy_models.py
if errorlevel 1 (
    echo ⚠️  Could not create dummy models, but continuing...
)

echo ✅ Python backend setup complete!

echo.
echo [5/5] Testing Coral TPU connection...
python -c "try: from pycoral.utils import edgetpu; devices = edgetpu.list_edge_tpus(); print('🤖 Coral TPU devices found:', len(devices)); [print(f'  - {d}') for d in devices] if devices else print('  No TPU devices detected'); except ImportError: print('⚠️  PyCoral not installed - TPU features disabled')" 2>nul
if errorlevel 1 (
    echo ⚠️  Coral TPU not detected or drivers not installed
    echo App will work with fallback CPU processing
    echo To enable TPU: Install Edge TPU Runtime from https://coral.ai/software/
) else (
    echo ✅ TPU check completed!
)

cd ..

echo.
echo =====================================
echo   Setup Complete! 🎉
echo =====================================
echo.
echo Available commands:
echo   npm run dev           - Start frontend only
echo   npm run backend       - Start backend only  
echo   npm run dev:full      - Start both frontend and backend
echo   npm run test:tpu      - Test TPU connection
echo.
echo Quick Start:
echo   1. Run: npm run dev:full
echo   2. Open: http://localhost:3000
echo   3. Enjoy learning! 🌟
echo.

:menu
echo Choose an option:
echo [1] Start full application (frontend + backend)
echo [2] Start frontend only
echo [3] Test Coral TPU
echo [4] Exit
echo.
set /p choice="Enter your choice (1-4): "

if "%choice%"=="1" (
    echo Starting full application...
    start "Backend Server" cmd /k "cd backend && coral_env\Scripts\activate && python coral_tpu_server.py"
    timeout /t 3 >nul
    echo Frontend starting in 3 seconds...
    npm run dev
) else if "%choice%"=="2" (
    echo Starting frontend only...
    npm run dev
) else if "%choice%"=="3" (
    echo Testing Coral TPU...
    cd backend
    call coral_env\Scripts\activate.bat
    python -c "try: from pycoral.utils import edgetpu; devices = edgetpu.list_edge_tpus(); print('Coral TPU devices:', devices if devices else 'None found'); except ImportError: print('PyCoral not available - install with: pip install pycoral')"
    cd ..
    echo.
    goto menu
) else if "%choice%"=="4" (
    echo Goodbye! 👋
    exit /b 0
) else (
    echo Invalid choice. Please try again.
    goto menu
)

pause
