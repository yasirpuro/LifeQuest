$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$src = Join-Path $root "icons\icon-512.png"
$destDir = Join-Path $root "android\app\src\main\res\mipmap-xxxhdpi"
New-Item -ItemType Directory -Force -Path $destDir | Out-Null

if (-not (Test-Path $src)) {
    & (Join-Path $root "scripts\generate-icons.ps1")
}

Copy-Item $src (Join-Path $destDir "ic_launcher.png") -Force
Copy-Item $src (Join-Path $destDir "ic_launcher_round.png") -Force
Copy-Item $src (Join-Path $destDir "ic_launcher_foreground.png") -Force
Write-Host "Launcher ikonlari kopyalandi: $destDir"
