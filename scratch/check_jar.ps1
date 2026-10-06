Add-Type -AssemblyName System.Drawing
$bmp = [System.Drawing.Bitmap]::new((Resolve-Path "public/images/brand/madhuvan_jute_jar.jpg").Path)
Write-Host "Corner top-left: R=$($bmp.GetPixel(10, 10).R), G=$($bmp.GetPixel(10, 10).G), B=$($bmp.GetPixel(10, 10).B)"
Write-Host "Corner top-right: R=$($bmp.GetPixel(1000, 10).R), G=$($bmp.GetPixel(1000, 10).G), B=$($bmp.GetPixel(1000, 10).B)"
Write-Host "Corner bot-left: R=$($bmp.GetPixel(10, 1000).R), G=$($bmp.GetPixel(10, 1000).G), B=$($bmp.GetPixel(10, 1000).B)"
$bmp.Dispose()
