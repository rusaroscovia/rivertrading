@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js was not found. Install Node.js, then run this file again.
  pause
  exit /b 1
)
node serve-site.js
if errorlevel 1 (
  echo.
  echo The River Trading website could not start. Read the error above.
  pause
  exit /b 1
)
