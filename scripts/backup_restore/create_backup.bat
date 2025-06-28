@echo off
setlocal enabledelayedexpansion

:: === Define directories ===
set "PROJECT_ROOT=%~dp0..\.."
set "SERVER_DIR=%PROJECT_ROOT%\7d2d-server\server"
set "APPDATA_7DTD=%AppData%\7DaysToDie"
set "BACKUP_DIR=%PROJECT_ROOT%\backups"

:: Get current timestamp for backup folder name
for /f "usebackq tokens=1-4 delims=/ " %%a in ('date /t') do (
    set "YY=%%d"
    set "MM=%%b"
    set "DD=%%c"
)
for /f "usebackq tokens=1-2 delims=:" %%a in ('time /t') do (
    set "HH=%%a"
    set "NN=%%b"
)
set "TIMESTAMP=!YY!!MM!!DD!_!HH!!NN!"
set "CURRENT_BACKUP_DIR=%BACKUP_DIR%\7d2d_backup_!TIMESTAMP!"

echo.
echo ================================================
echo    Creating Backup
echo ================================================
echo.

echo Creating backup directory: %CURRENT_BACKUP_DIR%
mkdir "%CURRENT_BACKUP_DIR%\server" >nul 2>&1
mkdir "%CURRENT_BACKUP_DIR%\client_saves" >nul 2>&1

echo Copying server files...
robocopy "%SERVER_DIR%" "%CURRENT_BACKUP_DIR%\server" /E /COPY:DAT /DCOPY:T
if %errorlevel% geq 8 (
    echo ERROR: Failed to copy server files. Check robocopy output above.
    pause
    exit /b 1
)
echo Server files copied.

echo Copying client save data...
robocopy "%APPDATA_7DTD%" "%CURRENT_BACKUP_DIR%\client_saves" /E /COPY:DAT /DCOPY:T
if %errorlevel% geq 8 (
    echo ERROR: Failed to copy client save data. Check robocopy output above.
    pause
    exit /b 1
)
echo Client save data copied.

echo.
echo Backup created successfully at: %CURRENT_BACKUP_DIR%
echo.
pause
exit /b 0
