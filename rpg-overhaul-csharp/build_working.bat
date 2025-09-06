@echo off
echo Building Working RPG Overhaul C# Mod...

REM Build only the files that compile
csc /target:library /out:bin\Release\RPGOverhaul.dll ^
    /reference:lib\Assembly-CSharp.dll ^
    /reference:lib\UnityEngine.dll ^
    /reference:lib\UnityEngine.CoreModule.dll ^
    /reference:lib\0Harmony.dll ^
    /nowarn:CS0103 ^
    src\Main.cs src\SimpleIntegration.cs src\ItemValueExtensions.cs

if errorlevel 1 (
    echo Build failed!
    pause
    exit /b 1
)

echo Build successful!
echo Output: bin\Release\RPGOverhaul.dll
pause