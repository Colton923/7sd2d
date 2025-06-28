try {
    Write-Host "Adding firewall rules..." -ForegroundColor Cyan
    New-NetFirewallRule -DisplayName "7DTD TCP" -Direction Inbound -Protocol TCP -LocalPort 26900-26902 -Action Allow -Profile Any -ErrorAction Stop
    New-NetFirewallRule -DisplayName "7DTD UDP" -Direction Inbound -Protocol UDP -LocalPort 26900-26902 -Action Allow -Profile Any -ErrorAction Stop
    Write-Host "Firewall configured successfully." -ForegroundColor Green
}
catch {
    Write-Host ""
    Write-Host "Firewall configuration FAILED." -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "Please run this script with Administrator privileges." -ForegroundColor Yellow
    exit 1
}
