# 7D2D-RealLife Mod Client Installer (PowerShell)
# Run with: powershell -ExecutionPolicy Bypass -File Install-7D2DRLMod.ps1

param(
    [string]$GamePath = "",
    [switch]$Force = $false,
    [switch]$BackupOld = $false
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  7D2D-RealLife Mod Client Installer" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Common game installation paths
$commonPaths = @(
    "C:\Program Files (x86)\Steam\steamapps\common\7 Days To Die",
    "C:\Program Files\Steam\steamapps\common\7 Days To Die",
    "D:\Steam\steamapps\common\7 Days To Die",
    "C:\Program Files\Epic Games\7DaysToDie",
    "D:\Games\7 Days To Die"
)

# Check if running from extracted mod folder
if (-not (Test-Path "Config")) {
    Write-Host "ERROR: This script must be run from inside the extracted mod folder." -ForegroundColor Red
    Write-Host "Make sure you extracted the mod archive first!" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Find game installation
if ($GamePath -eq "") {
    Write-Host "Searching for 7 Days To Die installation..." -ForegroundColor Yellow
    
    foreach ($path in $commonPaths) {
        if (Test-Path "$path\7DaysToDie.exe") {
            $GamePath = $path
            Write-Host "✓ Found game at: $GamePath" -ForegroundColor Green
            break
        }
    }
    
    if ($GamePath -eq "") {
        Write-Host ""
        Write-Host "ERROR: Could not find 7 Days To Die installation." -ForegroundColor Red
        Write-Host ""
        Write-Host "Please run the script with the game path:" -ForegroundColor Yellow
        Write-Host "  .\Install-7D2DRLMod.ps1 -GamePath `"C:\Your\Game\Path`"" -ForegroundColor Cyan
        Write-Host ""
        Read-Host "Press Enter to exit"
        exit 1
    }
} else {
    if (-not (Test-Path "$GamePath\7DaysToDie.exe")) {
        Write-Host "ERROR: 7 Days To Die not found at: $GamePath" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
    Write-Host "✓ Using specified game path: $GamePath" -ForegroundColor Green
}

# Set paths
$ModName = "7D2D-RL"
$ModsPath = "$GamePath\Mods"
$DestPath = "$ModsPath\$ModName"

# Create Mods directory if needed
if (-not (Test-Path $ModsPath)) {
    Write-Host "Creating Mods directory..." -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $ModsPath -Force | Out-Null
}

# Check if mod already exists
if (Test-Path $DestPath) {
    if ($BackupOld) {
        $backupName = "$ModName-backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        $backupPath = "$ModsPath\$backupName"
        Write-Host "Backing up existing mod to: $backupName" -ForegroundColor Yellow
        Move-Item -Path $DestPath -Destination $backupPath -Force
    } elseif (-not $Force) {
        Write-Host ""
        Write-Host "WARNING: Mod already exists at: $DestPath" -ForegroundColor Yellow
        Write-Host ""
        $response = Read-Host "Do you want to overwrite it? (Y/N)"
        if ($response -ne 'Y' -and $response -ne 'y') {
            Write-Host "Installation cancelled." -ForegroundColor Yellow
            Read-Host "Press Enter to exit"
            exit 0
        }
    }
    
    if (Test-Path $DestPath) {
        Write-Host "Removing old mod version..." -ForegroundColor Yellow
        Remove-Item -Path $DestPath -Recurse -Force
    }
}

Write-Host ""
Write-Host "Installing mod to: $DestPath" -ForegroundColor Cyan
Write-Host ""

# Create mod directories
New-Item -ItemType Directory -Path $DestPath -Force | Out-Null
New-Item -ItemType Directory -Path "$DestPath\Config" -Force | Out-Null

# Copy mod files
Write-Host "Copying mod files..." -ForegroundColor Yellow
$configFiles = Get-ChildItem -Path "Config\*.xml"
$filesCopied = 0

foreach ($file in $configFiles) {
    Copy-Item -Path $file.FullName -Destination "$DestPath\Config\" -Force
    $filesCopied++
    Write-Host "  ✓ $($file.Name)" -ForegroundColor Gray
}

# Copy ModInfo.xml if it exists
if (Test-Path "ModInfo.xml") {
    Copy-Item -Path "ModInfo.xml" -Destination "$DestPath\" -Force
    Write-Host "  ✓ ModInfo.xml" -ForegroundColor Gray
}

# Verify installation
if ($filesCopied -gt 0) {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host "  Installation Successful!" -ForegroundColor Green
    Write-Host "==========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Installed $filesCopied config files" -ForegroundColor Cyan
    Write-Host "Mod installed to: $DestPath" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "IMPORTANT:" -ForegroundColor Yellow
    Write-Host "- Make sure the server is also running this mod version" -ForegroundColor White
    Write-Host "- Restart your game if it was running" -ForegroundColor White
    Write-Host "- Check Discord for mod updates with /mod command" -ForegroundColor White
    Write-Host ""
    
    # Offer to verify files
    $verify = Read-Host "Would you like to verify the installation? (Y/N)"
    if ($verify -eq 'Y' -or $verify -eq 'y') {
        Write-Host ""
        Write-Host "Installed files:" -ForegroundColor Cyan
        Get-ChildItem -Path "$DestPath\Config\*.xml" | ForEach-Object {
            $size = [math]::Round($_.Length / 1KB, 2)
            Write-Host "  $($_.Name) (${size}KB)" -ForegroundColor Gray
        }
    }
} else {
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Red
    Write-Host "  Installation Failed!" -ForegroundColor Red
    Write-Host "==========================================" -ForegroundColor Red
    Write-Host "No files were copied. Please check the mod archive." -ForegroundColor Yellow
    Write-Host ""
}

Read-Host "Press Enter to exit"