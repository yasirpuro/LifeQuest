Add-Type -AssemblyName System.Drawing
$appRoot = Split-Path -Parent $PSScriptRoot
$dir = Join-Path $appRoot "icons"
New-Item -ItemType Directory -Force -Path $dir | Out-Null

function Save-Icon {
    param([int]$Size, [string]$Path)
    $bmp = New-Object System.Drawing.Bitmap $Size, $Size
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $rect = New-Object System.Drawing.Rectangle 0, 0, $Size, $Size
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush @(
        $rect,
        [System.Drawing.Color]::FromArgb(255, 139, 92, 246),
        [System.Drawing.Color]::FromArgb(255, 16, 185, 129),
        45.0
    )
    $g.FillRectangle($brush, 0, 0, $Size, $Size)
    $fontSize = [Math]::Max(10, [int]($Size / 5))
    $fontFamily = New-Object System.Drawing.FontFamily "Segoe UI"
    $font = New-Object System.Drawing.Font @($fontFamily, $fontSize, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $sf = New-Object System.Drawing.StringFormat
    $sf.Alignment = [System.Drawing.StringAlignment]::Center
    $sf.LineAlignment = [System.Drawing.StringAlignment]::Center
    $rectF = New-Object System.Drawing.RectangleF(0, 0, $Size, $Size)
    $g.DrawString("LQ", $font, [System.Drawing.Brushes]::White, $rectF, $sf)
    $bmp.Save($Path, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
}

Save-Icon -Size 192 -Path (Join-Path $dir "icon-192.png")
Save-Icon -Size 512 -Path (Join-Path $dir "icon-512.png")
Write-Output "Icons written to $dir"
