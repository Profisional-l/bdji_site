param(
    [switch]$WithBot
)

$ErrorActionPreference = "Stop"

$projectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $projectRoot

Write-Host "Checking Node.js and npm..." -ForegroundColor Cyan
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    throw "Node.js was not found. Please install Node.js 18+ and reopen PowerShell."
}

if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    throw "npm was not found. Reinstall Node.js with npm included."
}

if (-not (Test-Path ".env.local")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env.local"
        Write-Host ".env.local was created from .env.example" -ForegroundColor Yellow
        Write-Host "Update TG_BOT_TOKEN and TG_ALLOWED_USER_IDS in .env.local" -ForegroundColor Yellow
    }
    else {
        Write-Host ".env.example not found, skipping .env.local creation" -ForegroundColor Yellow
    }
}

if (-not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies (npm install)..." -ForegroundColor Cyan
    npm install
}

if ($WithBot) {
    $runningBot = Get-CimInstance Win32_Process |
        Where-Object { $_.Name -match '^node(\.exe)?$' -and $_.CommandLine -match 'telegram-news-bot\.cjs' } |
        Select-Object -First 1

    if ($runningBot) {
        Write-Host "Telegram bot is already running (PID: $($runningBot.ProcessId)). Skipping new bot instance." -ForegroundColor Yellow
    }
    else {
        Write-Host "Starting Telegram bot in a separate PowerShell window..." -ForegroundColor Cyan
        Start-Process powershell -ArgumentList @(
            "-NoExit",
            "-ExecutionPolicy", "Bypass",
            "-Command",
            "Set-Location '$projectRoot'; npm run bot:news"
        )
    }
}

Write-Host "Starting Next.js dev server..." -ForegroundColor Green
npm run dev
