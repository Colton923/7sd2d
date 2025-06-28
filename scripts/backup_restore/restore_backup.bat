@echo off
setlocal enabledelayedexpansion

:: === Define directories ===
set "PROJECT_ROOT=%~dp0..\.."
set "SERVER_DIR=%PROJECT_ROOT%\7d2d-server\server"
set "APPDATA_7DTD=%AppData%\7DaysToDie"
set "BACKUP_DIR=%PROJECT_ROOT%\backups"

:select_backup
cls
echo.
echo ================================================
echo    Restore Backup
echo ================================================
echo.
echo Available Backups:
echo.

set "backup_count=0"
for /d %%i in ("%BACKUP_DIR%\7d2d_backup_*") do (
    set /a backup_count+=1
    for /f "delims=" %%j in ("%%i") do (
        set "backup_path_!backup_count!=%%j"
        echo   [!backup_count!] %%~nxj
    )
)

if %backup_count% equ 0 (
    echo No backups found in %BACKUP_DIR%.
    echo.
    pause
    exit /b 1
)

echo.
echo  [0] Cancel
echo.
set /p "choice=Enter the number of the backup to restore, or 0 to cancel: "

if "%choice%"=="0" (
    echo Restore cancelled.
    pause
    exit /b 0
)

if not defined backup_path_%choice% (
    echo Invalid choice. Please try again.
    pause
    goto select_backup
)

set "SELECTED_BACKUP_PATH=!backup_path_%choice%!"
echo.
echo You selected: !SELECTED_BACKUP_PATH!
echo.
echo WARNING: This will overwrite your current server and client save data.
echo Please ensure your 7 Days to Die server is shut down before proceeding.
pause

set /p "confirm=Are you sure you want to restore from this backup? (y/n): "
if /i not "%confirm%"=="y" (
    echo Restore cancelled.
    pause
    exit /b 0
)

echo Deleting current server directory contents...
rmdir /s /q "%SERVER_DIR%" >nul 2>&1
mkdir "%SERVER_DIR%" >nul 2>&1

echo Deleting current client save data...
rmdir /s /q "%APPDATA_7DTD%\Saves" >nul 2>&1
mkdir "%APPDATA_7DTD%\Saves" >nul 2>&1

echo Restoring server files from backup...
robocopy "!SELECTED_BACKUP_PATH!\server" "%SERVER_DIR%" /E /COPY:DAT /DCOPY:T
if %errorlevel% geq 8 (
    echo ERROR: Failed to restore server files. Check robocopy output above.
    pause
    exit /b 1
)

echo Restoring client save data from backup...
robocopy "!SELECTED_BACKUP_PATH!\client_saves" "%APPDATA_7DTD%\Saves" /E /COPY:DAT /DCOPY:T
if %errorlevel% geq 8 (
    echo ERROR: Failed to restore client save data. Check robocopy output above.
    pause
    exit /b 1
)

echo.
echo Restore complete. Your server and client save data have been restored.
echo.
pause
exit /b 0
