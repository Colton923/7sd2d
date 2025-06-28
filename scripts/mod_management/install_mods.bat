@echo off
set "SOURCE_DIR=C:\Program Files (x86)\Steam\steamapps\common\7 Days To Die\Mods"
set "DEST_MODS_DIR=%~dp0..\..\7d2d-server\server\Mods"
set "DEST_WORLDS_DIR=%~dp0..\..\7d2d-server\server\Data\Worlds"
set "DEST_PREFABS_DIR=%~dp0..\..\7d2d-server\server\Data\Prefabs"
set "MAP_NAME=New York Undead One UE"

echo --- Attempting to copy mods... ---
robocopy "%SOURCE_DIR%" "%DEST_MODS_DIR%" /E /XD "New York Undead One UE Map-Bundle"

echo --- Attempting to copy map data... ---
robocopy "%SOURCE_DIR%\New York Undead One UE Map-Bundle\Worlds\%MAP_NAME%" "%DEST_WORLDS_DIR%\%MAP_NAME%" /E

echo --- Attempting to copy map prefabs... ---
robocopy "%SOURCE_DIR%\New York Undead One UE Map-Bundle\Prefabs" "%DEST_PREFABS_DIR%" /E

echo ---
echo Mod copy script finished.
echo Please review the output above for any errors.
echo ---
pause
