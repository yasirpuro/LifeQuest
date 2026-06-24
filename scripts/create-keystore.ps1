$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$ks = Join-Path $root "release.keystore"
$alias = "lifequest"
$validity = 10000

if (Test-Path $ks) {
    Write-Host "Keystore zaten var: $ks"
    exit 0
}

$keytool = Get-Command keytool -ErrorAction SilentlyContinue
if (-not $keytool) {
    Write-Error "keytool bulunamadi. JDK kurulu olmali (Android Studio ile gelir)."
}

Write-Host "Release keystore olusturuluyor..."
Write-Host "Sifreleri not alin — Play Console upload key ile eslesmeli."

& keytool -genkeypair -v `
    -keystore $ks `
    -alias $alias `
    -keyalg RSA -keysize 2048 -validity $validity `
    -storepass "LifeQuest2026!" `
    -keypass "LifeQuest2026!" `
    -dname "CN=LifeQuest, OU=Mobile, O=LifeQuest, L=Istanbul, ST=TR, C=TR"

Write-Host ""
Write-Host "Keystore: $ks"
Write-Host "Alias: $alias"
Write-Host "Ornek sifre (degistirin): LifeQuest2026!"
Write-Host ""
Write-Host "SHA256 fingerprint (assetlinks.json icin):"
& keytool -list -v -keystore $ks -alias $alias -storepass "LifeQuest2026!" | Select-String "SHA256"
