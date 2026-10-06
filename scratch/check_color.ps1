Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::new((Resolve-Path "public/images/brand/vineeta_honey_bg.jpg").Path)
$color = $bmp.GetPixel(10, 10)
Write-Host "Color: R=$($color.R), G=$($color.G), B=$($color.B)"
$bmp.Dispose()
