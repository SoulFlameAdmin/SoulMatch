@echo off
title SoulMatchBG Localhost
echo.
echo ===============================================
echo  SoulMatchBG - starting localhost
echo ===============================================
echo.

where node >nul 2>nul
if %errorlevel% neq 0 (
  echo Node.js ne e instaliran.
  echo Instalirai Node.js ot: https://nodejs.org/
  pause
  exit /b
)

start http://localhost:5173
npm start

pause
