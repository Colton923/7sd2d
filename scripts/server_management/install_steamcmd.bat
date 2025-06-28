@echo off
cd /d "%~dp0..\..\7d2d-server\steamcmd"
echo Downloading SteamCMD...
powershell -Command "Invoke-WebRequest -Uri https://steamcdn-a.akamaihd.net/client/installer/steamcmd.zip -OutFile steamcmd.zip"
tar -xf steamcmd.zip
del steamcmd.zip
echo SteamCMD setup complete.
