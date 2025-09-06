@echo off
echo Building Minimal RPG Overhaul C# Mod...

REM Create a minimal version that will compile
echo Creating minimal working version...

REM Build with only SimpleIntegration
dotnet build --configuration Release /p:DefineConstants="MINIMAL_BUILD"

if errorlevel 1 (
    echo Build failed! Creating ultra-minimal version...
    
    REM Compile just the essential files
    csc /target:library /out:bin\Release\net48\RPGOverhaul.dll ^
        /reference:lib\Assembly-CSharp.dll ^
        /reference:lib\UnityEngine.dll ^
        /reference:lib\UnityEngine.CoreModule.dll ^
        /reference:lib\0Harmony.dll ^
        src\Main.cs src\SimpleIntegration.cs src\ItemValueExtensions.cs
)

echo Build complete!
pause