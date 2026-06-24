$ErrorActionPreference = "Stop"
$root = Split-Path -Parent $PSScriptRoot
$android = Join-Path $root "android"
$out = Join-Path $root "output"

& (Join-Path $root "scripts\copy-android-icons.ps1")

New-Item -ItemType Directory -Force -Path $out | Out-Null

Push-Location $android

if (-not (Test-Path ".\gradlew.bat")) {
    $gradle = Get-Command gradle -ErrorAction SilentlyContinue
    if ($gradle) {
        & gradle wrapper --gradle-version 8.7
    } else {
        Write-Warning "gradlew yok. Android Studio ile android/ acin veya Gradle kurup 'gradle wrapper' calistirin."
    }
}

$props = Join-Path $android "gradle.properties"
if (-not (Test-Path $props)) {
    Copy-Item (Join-Path $android "gradle.properties.example") $props
}

if (Test-Path ".\gradlew.bat") {
    Write-Host "Release AAB derleniyor..."
    & .\gradlew.bat bundleRelease
    $aab = Get-ChildItem -Path "app\build\outputs\bundle\release" -Filter "*.aab" -Recurse | Select-Object -First 1
    if ($aab) {
        Copy-Item $aab.FullName (Join-Path $out "lifequest-release.aab") -Force
        Write-Host "AAB hazir: $(Join-Path $out 'lifequest-release.aab')"
    }
} else {
    Write-Host "Manuel: Android Studio > Build > Generate Signed Bundle / APK > Android App Bundle"
}

Pop-Location
