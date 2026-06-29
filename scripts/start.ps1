$projectRoot = Split-Path $PSScriptRoot -Parent
$envFile = Join-Path $projectRoot ".env.local"

if (Test-Path $envFile) {
  Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*EXPO_TOKEN\s*=\s*(.+)\s*$') {
      $env:EXPO_TOKEN = $matches[1].Trim()
    }
  }
}

Remove-Item Env:CI -ErrorAction SilentlyContinue
Remove-Item Env:EXPO_OFFLINE -ErrorAction SilentlyContinue

Set-Location $projectRoot
Write-Host "Demarrage en mode LAN (Wi-Fi local). Scannez le QR avec l'app Appareil photo."
npx expo start --go --lan --port 8081
