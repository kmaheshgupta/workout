<#
  slice-exercises.ps1
  Slices each day's full workout poster into per-exercise panel images.
  Source posters are the 1536x1024 PNGs, stored permanently in assets/originals/
  (monday.png ... friday.png) so this script is reproducible without any
  external folder.
  Output: assets/exercises/<exercise-id>.jpg  (mapped to ids in data.js)

  Re-run after replacing a poster:
      powershell -ExecutionPolicy Bypass -File scripts/slice-exercises.ps1

  Coordinates are in the 1536x1024 poster space: x, y, width, height.
#>
param(
  [string]$SourceDir = (Join-Path $PSScriptRoot '..\assets\originals'),
  [string]$OutDir    = (Join-Path $PSScriptRoot '..\assets\exercises')
)

Add-Type -AssemblyName System.Drawing

$OutDir = [System.IO.Path]::GetFullPath($OutDir)
if (-not (Test-Path $OutDir)) { New-Item -ItemType Directory -Path $OutDir | Out-Null }

# JPEG encoder @ quality 88
$jpg = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object { $_.MimeType -eq 'image/jpeg' }
$eps = New-Object System.Drawing.Imaging.EncoderParameters 1
$eps.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter([System.Drawing.Imaging.Encoder]::Quality, [long]88)

# poster => list of { id, x, y, w, h }
$crops = @{
  'monday' = @(
    @{ id='db-bench-press';             x=12;  y=104; w=748; h=328 }
    @{ id='incline-db-press';           x=764; y=104; w=760; h=328 }
    @{ id='push-ups';                   x=12;  y=438; w=748; h=277 }
    @{ id='overhead-tricep-extension';  x=764; y=438; w=760; h=277 }
    @{ id='plank';                      x=764; y=724; w=384; h=246 }
  )
  'tuesday' = @(
    @{ id='one-arm-db-row';  x=12;  y=57;  w=748; h=378 }
    @{ id='cable-band-row';  x=764; y=57;  w=760; h=378 }
    @{ id='reverse-fly';     x=12;  y=440; w=748; h=278 }
    @{ id='db-curl';         x=764; y=440; w=760; h=278 }
    @{ id='hammer-curl';     x=12;  y=722; w=748; h=248 }
    @{ id='bird-dog';        x=764; y=722; w=760; h=248 }
  )
  'wednesday' = @(
    @{ id='goblet-squat';         x=12;  y=66;  w=748; h=356 }
    @{ id='walking-lunges';       x=764; y=66;  w=760; h=356 }
    @{ id='step-ups';             x=12;  y=426; w=748; h=280 }
    @{ id='romanian-db-deadlift'; x=764; y=426; w=760; h=280 }
    @{ id='calf-raise';           x=12;  y=710; w=748; h=270 }
  )
  'thursday' = @(
    @{ id='seated-db-shoulder-press'; x=12;  y=66;  w=748; h=348 }
    @{ id='lateral-raise';            x=764; y=66;  w=760; h=348 }
    @{ id='front-raise';              x=12;  y=422; w=748; h=266 }
    @{ id='rear-delt-fly';            x=764; y=422; w=760; h=266 }
  )
}

foreach ($poster in $crops.Keys) {
  $src = Join-Path $SourceDir "$poster.png"
  if (-not (Test-Path $src)) { $src = Join-Path $SourceDir "$poster.PNG" }
  if (-not (Test-Path $src)) { Write-Warning "Missing poster: $poster"; continue }

  $img = [System.Drawing.Image]::FromFile($src)
  try {
    foreach ($c in $crops[$poster]) {
      $x = [Math]::Max(0, $c.x); $y = [Math]::Max(0, $c.y)
      $w = [Math]::Min($c.w, $img.Width - $x); $h = [Math]::Min($c.h, $img.Height - $y)
      $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
      $crop = ($img).Clone($rect, $img.PixelFormat)
      $dest = Join-Path $OutDir ("{0}.jpg" -f $c.id)
      $crop.Save($dest, $jpg, $eps)
      $crop.Dispose()
      Write-Host ("{0,-11} -> {1}.jpg  ({2}x{3})" -f $poster, $c.id, $w, $h)
    }
  } finally {
    $img.Dispose()
  }
}

Write-Host "`nDone. Sliced images in: $OutDir"
