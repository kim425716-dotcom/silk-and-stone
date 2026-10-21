# ==============================================================================
# Build cPanel Production Zip Bundle for Silk & Stone
# ==============================================================================

$root = Split-Path -Parent $PSScriptRoot
$src = Join-Path $root "silk-stone-interiors"
$zipPath = Join-Path $root "silk-and-stone-cpanel.zip"

Write-Host "Creating cPanel production bundle..." -ForegroundColor Cyan

if (Test-Path $zipPath) {
    Remove-Item $zipPath -Force
}

$tempDir = Join-Path $env:TEMP ("silk_build_" + [System.Guid]::NewGuid().ToString("N"))
New-Item -ItemType Directory -Path $tempDir | Out-Null

try {
    # Copy website files, excluding dev/sync conflict files
    Get-ChildItem -Path $src -Exclude "*DESKTOP*", ".zencoder", ".zenflow", "serve.ps1" | ForEach-Object {
        Copy-Item -Path $_.FullName -Destination $tempDir -Recurse -Force
    }

    # Ensure .htaccess is included
    $htaccess = Join-Path $src ".htaccess"
    if (Test-Path $htaccess) {
        Copy-Item -Path $htaccess -Destination (Join-Path $tempDir ".htaccess") -Force
    }

    # Compress into zip
    Compress-Archive -Path (Join-Path $tempDir "*") -DestinationPath $zipPath -Force
    
    # Also include hidden files like .htaccess if Compress-Archive missed it
    # PowerShell Compress-Archive with * sometimes skips hidden dotfiles. Let's make sure .htaccess is included:
    Add-Type -AssemblyName System.IO.Compression.FileSystem
    $zipArchive = [System.IO.Compression.ZipFile]::Open($zipPath, [System.IO.Compression.ZipArchiveMode]::Update)
    $hasHtaccess = $false
    foreach ($entry in $zipArchive.Entries) {
        if ($entry.Name -eq ".htaccess") { $hasHtaccess = $true; break }
    }
    if (-not $hasHtaccess -and (Test-Path (Join-Path $tempDir ".htaccess"))) {
        [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zipArchive, (Join-Path $tempDir ".htaccess"), ".htaccess")
    }
    $zipArchive.Dispose()

    $item = Get-Item $zipPath
    $sizeMB = [math]::Round($item.Length / 1MB, 2)
    Write-Host "Bundle successfully created:" -ForegroundColor Green
    Write-Host "  File: $zipPath" -ForegroundColor White
    Write-Host "  Size: $sizeMB MB ($($item.Length) bytes)" -ForegroundColor White
}
finally {
    if (Test-Path $tempDir) {
        Remove-Item -Recurse -Force $tempDir -ErrorAction SilentlyContinue
    }
}
