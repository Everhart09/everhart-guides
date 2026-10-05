@echo off
rem Double-click to build and open Everhart Guides.
cd /d "%~dp0"
set ELECTRON_RUN_AS_NODE=
call npm.cmd run build
if errorlevel 1 (
  echo.
  echo Build failed - see the messages above.
  pause
  exit /b 1
)
start "" "%~dp0node_modules\electron\dist\electron.exe" .
