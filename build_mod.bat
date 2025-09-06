@echo off
echo ============================================
echo   7D2D RPG Overhaul - Complete Build
echo ============================================
echo.

REM Set consistent paths and mod name
set "PROJECT_DIR=C:\Users\admin\projects\7d2d"
set "MOD_NAME=7D2D-RPGOverhaul"
set "OUTPUT_DIR=%PROJECT_DIR%\rpg-overhaul\output\Mods\%MOD_NAME%"
set "GAME_DIR=C:\Program Files (x86)\Steam\steamapps\common\7 Days To Die"
set "GAME_MOD_DIR=%GAME_DIR%\Mods\%MOD_NAME%"
set "SERVER_MOD_DIR=%PROJECT_DIR%\7d2d-server\server\Mods\%MOD_NAME%"

echo [1/5] Cleaning previous build...
if exist "%OUTPUT_DIR%" rmdir /s /q "%OUTPUT_DIR%"
mkdir "%OUTPUT_DIR%"
mkdir "%OUTPUT_DIR%\Config"

echo.
echo [2/5] Building TypeScript XML Generator...
cd "%PROJECT_DIR%\rpg-overhaul-ts"
if exist "package.json" (
    call npm install --silent
    call npm run build
    if errorlevel 1 (
        echo ERROR: TypeScript build failed!
        pause
        exit /b 1
    )
    
    echo Generating XML Configuration Files...
    node dist\generate-mod.js
    if errorlevel 1 (
        echo ERROR: XML generation failed!
        pause
        exit /b 1
    )
) else (
    echo WARNING: TypeScript project not found, skipping...
)

echo.
echo [3/5] Building C# Mod DLL...
cd "%PROJECT_DIR%\rpg-overhaul-csharp"

REM Check if required assemblies exist
if not exist "lib\Assembly-CSharp.dll" (
    echo ERROR: Missing Assembly-CSharp.dll in lib folder!
    echo Please copy from: "%GAME_DIR%\7DaysToDie_Data\Managed\"
    pause
    exit /b 1
)

REM Build the minimal C# project
dotnet build RPGOverhaulMinimal.csproj --configuration Release --verbosity quiet
if errorlevel 1 (
    echo ERROR: C# build failed!
    pause
    exit /b 1
)

echo.
echo [4/5] Packaging Mod...

REM Copy C# DLL
if exist "bin\RPGOverhaulMinimal.dll" (
    copy "bin\RPGOverhaulMinimal.dll" "%OUTPUT_DIR%\" >nul
) else (
    echo ERROR: C# DLL not found!
    exit /b 1
)

REM Copy Harmony DLL
if exist "bin\0Harmony.dll" (
    copy "bin\0Harmony.dll" "%OUTPUT_DIR%\" >nul
)

REM Create ModInfo.xml (V2 format)
(
echo ^<?xml version="1.0" encoding="UTF-8"?^>
echo ^<ModInfo^>
echo   ^<Name value="7D2D-RPG-Overhaul" /^>
echo   ^<DisplayName value="7D2D-RPG-Overhaul" /^>
echo   ^<Description value="Complete RPG overhaul with procedural weapons, elemental damage, affixes, mastery system, and enhanced loot" /^>
echo   ^<Author value="7D2D RPG Overhaul Team" /^>
echo   ^<Version value="1.0.0" /^>
echo   ^<Website value="" /^>
echo ^</ModInfo^>
) > "%OUTPUT_DIR%\ModInfo.xml"

REM Copy XML configs if they exist
if exist "..\rpg-overhaul-ts\output\*.xml" (
    copy "..\rpg-overhaul-ts\output\*.xml" "%OUTPUT_DIR%\Config\" >nul
)

echo.
echo [5/5] Installing to Game and Server...
choice /C YN /M "Install mod to 7 Days to Die Client and Server"
if errorlevel 2 goto :validation

REM Install to game directory
if exist "%GAME_MOD_DIR%" (
    echo Removing old client version...
    rmdir /s /q "%GAME_MOD_DIR%"
)

REM Install to server directory
if exist "%SERVER_MOD_DIR%" (
    echo Removing old server version...
    rmdir /s /q "%SERVER_MOD_DIR%"
)

echo Installing to client...
xcopy "%OUTPUT_DIR%\*" "%GAME_MOD_DIR%\" /E /I /Y >nul

echo Installing to server...
xcopy "%OUTPUT_DIR%\*" "%SERVER_MOD_DIR%\" /E /I /Y >nul

:validation
echo.
echo ============================================
echo   Validation
echo ============================================

REM Check files were created
if exist "%OUTPUT_DIR%\ModInfo.xml" (
    echo [OK] ModInfo.xml created
) else (
    echo [ERROR] ModInfo.xml missing!
)

if exist "%OUTPUT_DIR%\RPGOverhaulMinimal.dll" (
    echo [OK] C# DLL created
) else (
    echo [ERROR] C# DLL missing!
)

echo.
echo Files in mod package:
dir /B "%OUTPUT_DIR%"
if exist "%OUTPUT_DIR%\Config" (
    dir /B "%OUTPUT_DIR%\Config"
)

echo.
echo ============================================
echo   Build Complete!
echo ============================================
echo Output: %OUTPUT_DIR%
if exist "%GAME_MOD_DIR%\ModInfo.xml" (
    echo Installed: "%GAME_MOD_DIR%"
)
echo.
pause