$projectRoot = Split-Path $PSScriptRoot -Parent
$envFile = Join-Path $projectRoot ".env.local"

if (Test-Path $envFile) {
  Get-Content $envFile | ForEach-Object {
    if ($_ -match '^\s*EXPO_TOKEN\s*=\s*(.+)\s*$') {
      $env:EXPO_TOKEN = $matches[1].Trim()
    }
  }
}

if (-not $env:EXPO_TOKEN) {
  Write-Warning "EXPO_TOKEN absent de .env.local — la signature du manifest peut echouer."
}

Remove-Item Env:CI -ErrorAction SilentlyContinue
Remove-Item Env:EXPO_OFFLINE -ErrorAction SilentlyContinue

Set-Location $projectRoot
Write-Host "Mode tunnel (secours si le Wi-Fi local ne marche pas)."
npx expo start --clear --tunnel --go --port 8082
