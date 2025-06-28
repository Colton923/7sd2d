@echo off
set "SERVER_DIR=%~dp0..\..\7d2d-server\server"
set "STEAMCMD_DIR=%~dp0..\..\7d2d-server\steamcmd"
echo Installing 7 Days to Die server (latest experimental) via SteamCMD...
%STEAMCMD_DIR%\steamcmd.exe +force_install_dir "%SERVER_DIR%" +login anonymous +app_update 294420 -beta latest_experimental -validate +quit >> "%PROJECT_ROOT%\install-log.txt" 2>&1
if errorlevel 1 (
  echo ERROR: SteamCMD failed to install server. Check steamcmd-log.txt for details. >> "%PROJECT_ROOT%\install-log.txt"
  pause
  exit /b
)
copy /Y "%PROJECT_ROOT%\7d2d-server\config\serverconfig.xml" "%SERVER_DIR%" >nul
echo Server installed.
