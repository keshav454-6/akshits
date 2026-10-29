@echo off
title CyberShield One - Unified Protection Platform
color 0b

echo ======================================================================
echo           CYBERSHIELD ONE - ALL-IN-ONE DEFENSE PLATFORM
echo       "One Platform. Multiple Threats. One Smarter Defence."
echo ======================================================================
echo.

set "NODE_DIR=C:\Users\akshi\AppData\Local\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v24.20.0-win-x64"
set "PYTHON_DIR=C:\Users\akshi\AppData\Local\Programs\Python\Python311"
set "PATH=%NODE_DIR%;%PYTHON_DIR%;%PYTHON_DIR%\Scripts;%PATH%"

echo [*] Starting Python Flask Security Engine on port 5000...
cd /d "%~dp0backend"
start "CyberShield Backend" /min "%PYTHON_DIR%\python.exe" app.py

timeout /t 2 /nobreak >nul

echo [*] Starting Vite React Frontend on port 5173...
cd /d "%~dp0frontend"
start "CyberShield Frontend" cmd /c "%NODE_DIR%\npm.cmd run dev"

timeout /t 3 /nobreak >nul

echo [*] Opening CyberShield One in your default browser...
start http://localhost:5173

echo.
echo ======================================================================
echo  [+] CyberShield One is LIVE!
echo  [+] Frontend URL: http://localhost:5173
echo  [+] Backend API:  http://localhost:5000/api/health
echo ======================================================================
echo.
pause

