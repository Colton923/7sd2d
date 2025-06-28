@echo off
setlocal
set LOGFILE=%~dp0..\..\serverlog.log
echo Running full setup on %DATE% %TIME% >>"!LOGFILE!"
call "%~dp0server_management\install_steamcmd.bat" >>"!LOGFILE!" 2>&1
call "%~dp0server_management\install_server.bat" >>"!LOGFILE!" 2>&1
call "%~dp0mod_management\install_mods.bat" >>"!LOGFILE!" 2>&1
powershell -ExecutionPolicy Bypass -File "%~dp0server_management\configure_firewall.ps1" >>"!LOGFILE!" 2>&1
echo Setup complete! >>"!LOGFILE!"