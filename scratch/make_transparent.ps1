Add-Type -AssemblyName System.Drawing

$srcPath = (Resolve-Path "public/images/brand/vineeta_honey_bg.jpg").Path
$destPath = Join-Path (Split-Path $srcPath) "vineeta_cutout.png"

$src = [System.Drawing.Bitmap]::new($srcPath)
$width = $src.Width
$height = $src.Height

# Create 32bpp ARGB bitmap
$dst = [System.Drawing.Bitmap]::new($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

# Lock bits for fast access
$rect = [System.Drawing.Rectangle]::new(0, 0, $width, $height)
$srcData = $src.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$dstData = $dst.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$bytes = [byte[]]::new($width * $height * 4)
[System.Runtime.InteropServices.Marshal]::Copy($srcData.Scan0, $bytes, 0, $bytes.Length)

# BFS flood fill from edges for colors close to orange (R ~ 221, G ~ 120, B ~ 28)
$visited = [bool[]]::new($width * $height)
$queue = [System.Collections.Generic.Queue[int]]::new()

# Helper to check if pixel is background orange
function IsBg($r, $g, $b) {
    return ($r -ge 180 -and $r -le 245 -and $g -ge 95 -and $g -le 155 -and $b -ge 10 -and $b -le 55)
}

# Add all border pixels to queue
for ($x = 0; $x -lt $width; $x++) {
    $idxTop = $x
    $idxBottom = ($height - 1) * $width + $x
    $pTop = $idxTop * 4
    if (IsBg $bytes[$pTop + 2] $bytes[$pTop + 1] $bytes[$pTop]) {
        $visited[$idxTop] = $true
        $queue.Enqueue($idxTop)
    }
    $pBottom = $idxBottom * 4
    if (IsBg $bytes[$pBottom + 2] $bytes[$pBottom + 1] $bytes[$pBottom]) {
        $visited[$idxBottom] = $true
        $queue.Enqueue($idxBottom)
    }
}
for ($y = 0; $y -lt $height; $y++) {
    $idxLeft = $y * $width
    $idxRight = $y * $width + ($width - 1)
    $pLeft = $idxLeft * 4
    if (IsBg $bytes[$pLeft + 2] $bytes[$pLeft + 1] $bytes[$pLeft]) {
        $visited[$idxLeft] = $true
        $queue.Enqueue($idxLeft)
    }
    $pRight = $idxRight * 4
    if (IsBg $bytes[$pRight + 2] $bytes[$pRight + 1] $bytes[$pRight]) {
        $visited[$idxRight] = $true
        $queue.Enqueue($idxRight)
    }
}

$dx = @(1, -1, 0, 0)
$dy = @(0, 0, 1, -1)

while ($queue.Count -gt 0) {
    $curr = $queue.Dequeue()
    $cx = $curr % $width
    $cy = [math]::Floor($curr / $width)

    # Set alpha to 0 for background
    $bytes[$curr * 4 + 3] = 0

    for ($i = 0; $i -lt 4; $i++) {
        $nx = $cx + $dx[$i]
        $ny = $cy + $dy[$i]
        if ($nx -ge 0 -and $nx -lt $width -and $ny -ge 0 -and $ny -lt $height) {
            $nidx = $ny * $width + $nx
            if (-not $visited[$nidx]) {
                $visited[$nidx] = $true
                $np = $nidx * 4
                if (IsBg $bytes[$np + 2] $bytes[$np + 1] $bytes[$np]) {
                    $queue.Enqueue($nidx)
                }
            }
        }
    }
}

[System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $dstData.Scan0, $bytes.Length)
$src.UnlockBits($srcData)
$dst.UnlockBits($dstData)

$dst.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
$src.Dispose()
$dst.Dispose()

Write-Host "Saved cutout to $destPath"
