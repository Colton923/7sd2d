try {
    $ruleTCP = Get-NetFirewallRule -DisplayName '7DTD TCP' -ErrorAction SilentlyContinue
    if ($ruleTCP) {
        Write-Host '  [SUCCESS] TCP Firewall rule found.' -ForegroundColor Green
    } else {
        Write-Host '  [FAILURE] TCP Firewall rule NOT found.' -ForegroundColor Red
    }

    $ruleUDP = Get-NetFirewallRule -DisplayName '7DTD UDP' -ErrorAction SilentlyContinue
    if ($ruleUDP) {
        Write-Host '  [SUCCESS] UDP Firewall rule found.' -ForegroundColor Green
    } else {
        Write-Host '  [FAILURE] UDP Firewall rule NOT found.' -ForegroundColor Red
    }
}
catch {
    Write-Host ""
    Write-Host "An unexpected error occurred during firewall verification." -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}
