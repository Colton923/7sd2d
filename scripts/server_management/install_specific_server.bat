@echo off
set "PROJECT_ROOT=%~dp0..\.."
set "SERVER_DIR=%PROJECT_ROOT%\7d2d-server\server"
set "STEAMCMD_DIR=%PROJECT_ROOT%\7d2d-server\steamcmd"
echo Installing 7 Days to Die server (version: %1) via SteamCMD...
%STEAMCMD_DIR%\steamcmd.exe +force_install_dir "%SERVER_DIR%" +login anonymous +app_update 294420 -beta %1 -validate +quit >> "%CD%\steamcmd-log.txt" 2>&1
if errorlevel 1 (
  echo ERROR: SteamCMD failed to install server. Check steamcmd-log.txt for details. >> "%CD%\install-log.txt"
  pause
  exit /b
)
copy /Y "config\serverconfig.xml" "%SERVER_DIR%\" >nul
echo Server installation finished.
