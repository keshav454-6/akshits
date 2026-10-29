# CyberShield One Launcher Script for PowerShell
$ErrorActionPreference = "Stop"

Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "          CYBERSHIELD ONE - ALL-IN-ONE DEFENSE PLATFORM               " -ForegroundColor Cyan
Write-Host "       'One Platform. Multiple Threats. One Smarter Defence.'         " -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

$nodePath = "C:\Users\akshi\AppData\Local\Microsoft\WinGet\Packages\OpenJS.NodeJS.LTS_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v24.20.0-win-x64"
$pythonPath = "C:\Users\akshi\AppData\Local\Programs\Python\Python311"
$env:PATH = "$nodePath;$pythonPath;$pythonPath\Scripts;$env:PATH"

$workspaceRoot = $PSScriptRoot

Write-Host "[*] Launching Python Flask Backend on port 5000..." -ForegroundColor Green
$backendProcess = Start-Process -FilePath "$pythonPath\python.exe" -ArgumentList "app.py" -WorkingDirectory "$workspaceRoot\backend" -PassThru -WindowStyle Hidden

Start-Sleep -Seconds 2

Write-Host "[*] Launching Vite React Frontend on port 5173..." -ForegroundColor Green
$frontendProcess = Start-Process -FilePath "$nodePath\npm.cmd" -ArgumentList "run", "dev" -WorkingDirectory "$workspaceRoot\frontend" -PassThru

Start-Sleep -Seconds 3

Write-Host "[*] Opening browser at http://localhost:5173 ..." -ForegroundColor Cyan
Start-Process "http://localhost:5173"

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "  CyberShield One is currently active!" -ForegroundColor Green
Write-Host "  Backend Process ID:  $($backendProcess.Id)" -ForegroundColor White
Write-Host "  Frontend Process ID: $($frontendProcess.Id)" -ForegroundColor White
Write-Host "======================================================================" -ForegroundColor Green
Write-Host "Press any key to stop both services..." -ForegroundColor Yellow
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Stop-Process -Id $backendProcess.Id -Force -ErrorAction SilentlyContinue
Stop-Process -Id $frontendProcess.Id -Force -ErrorAction SilentlyContinue
Write-Host "CyberShield One shut down gracefully." -ForegroundColor Green

