# ==============================================================================
# Silk & Stone — Set Up GitHub Secrets for cPanel Deployment
# ==============================================================================

Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host "  Silk & Stone — Setup cPanel Auto-Deploy via GitHub      " -ForegroundColor Cyan
Write-Host "==========================================================" -ForegroundColor Cyan
Write-Host ""

$repo = "kim425716-dotcom/silk-and-stone"

# Check GitHub CLI
try {
    $ghVersion = gh --version 2>&1 | Select-Object -First 1
    Write-Host "[✓] GitHub CLI available: $ghVersion" -ForegroundColor Green
} catch {
    Write-Host "[!] GitHub CLI (gh) not found. Please install with: winget install GitHub.cli" -ForegroundColor Red
    exit 1
}

# Ensure authenticated
$authStatus = gh auth status 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Logging into GitHub..." -ForegroundColor Yellow
    gh auth login --web --git-protocol https
}

Write-Host ""
Write-Host "Enter your cPanel FTP connection details:" -ForegroundColor Yellow
Write-Host ""

$ftpHost = Read-Host "FTP Host (default: logictech.co.ke)"
if ([string]::IsNullOrWhiteSpace($ftpHost)) { $ftpHost = "logictech.co.ke" }

$ftpUser = Read-Host "cPanel FTP Username"
$ftpPass = Read-Host "cPanel FTP Password" -AsSecureString
$bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($ftpPass)
$plainPass = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)

$deployPath = Read-Host "Remote Deploy Folder on cPanel (default: /public_html/silk-and-stone/)"
if ([string]::IsNullOrWhiteSpace($deployPath)) { $deployPath = "/public_html/silk-and-stone/" }

# Set secrets on GitHub repo
function Set-Secret($name, $value) {
    if (-not [string]::IsNullOrWhiteSpace($value)) {
        $value | gh secret set $name --repo $repo 2>&1 | Out-Null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "  [✓] Set secret: $name" -ForegroundColor Green
        } else {
            Write-Host "  [!] Failed to set: $name" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "Saving deployment secrets to GitHub ($repo)..." -ForegroundColor Cyan

Set-Secret "FTP_HOST" $ftpHost
Set-Secret "FTP_USERNAME" $ftpUser
Set-Secret "FTP_PASSWORD" $plainPass
Set-Secret "DEPLOY_PATH_PROD" $deployPath

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  Setup Complete!                                         " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "Now, whenever you push changes to GitHub (git push origin main),"
Write-Host "GitHub Actions will automatically deploy to your cPanel folder:"
Write-Host "  Target: $deployPath" -ForegroundColor White
Write-Host "  Monitor runs at: https://github.com/$repo/actions" -ForegroundColor White
Write-Host ""
