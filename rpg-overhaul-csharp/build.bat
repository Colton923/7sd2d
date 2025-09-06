@echo off
echo Building RPG Overhaul C# Mod...

REM Restore NuGet packages
dotnet restore

REM Build the project
dotnet build --configuration Release

REM Copy to mods directory
if not exist "../../rpg-overhaul/output/mods/7D2D-RPGOverhaul" mkdir "../../rpg-overhaul/output/mods/7D2D-RPGOverhaul"
copy "bin\Release\net48\RPGOverhaul.dll" "../../rpg-overhaul/output/mods/7D2D-RPGOverhaul\"

echo Build complete! DLL copied to mod directory.
