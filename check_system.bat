@echo off
title Sistema Check - Tricky Words Phonics

echo.
echo =====================================
echo   Sistema Check - Verifica Requisiti
echo =====================================
echo.

echo Checking system requirements...
echo.

REM Test Node.js
echo [1/3] Node.js:
node --version >nul 2>&1
if errorlevel 1 (
    echo   ❌ NON INSTALLATO
    echo   📥 Installa da: https://nodejs.org/
    set NODEJS_OK=false
) else (
    echo   ✅ Installato
    node --version
    set NODEJS_OK=true
)

echo.

REM Test Python
echo [2/3] Python:
python --version >nul 2>&1
if errorlevel 1 (
    echo   ❌ NON INSTALLATO
    echo   📥 Installa da: https://python.org/
    set PYTHON_OK=false
) else (
    echo   ✅ Installato
    python --version
    set PYTHON_OK=true
)

echo.

REM Test Browser
echo [3/3] Browser supportato:
echo   ✅ Edge/Chrome raccomandati per speech recognition
echo   ⚠️  Firefox/Safari hanno supporto limitato

echo.
echo =====================================
echo   Risultato Verifica
echo =====================================

if "%NODEJS_OK%"=="true" if "%PYTHON_OK%"=="true" (
    echo.
    echo ✅ TUTTO PRONTO! Puoi procedere con:
    echo    .\start_app.bat
    echo.
    echo 🎯 Quick Start:
    echo    1. .\start_app.bat
    echo    2. Scegli opzione [1] o [2]
    echo    3. Apri http://localhost:3000
    echo    4. Divertiti! 🌟
) else (
    echo.
    echo ❌ REQUISITI MANCANTI
    echo.
    if "%NODEJS_OK%"=="false" (
        echo 📥 Installa Node.js: https://nodejs.org/
    )
    if "%PYTHON_OK%"=="false" (
        echo 📥 Installa Python: https://python.org/
    )
    echo.
    echo ⏭️  Dopo l'installazione rilancia questo script
)

echo.
echo =====================================

pause
