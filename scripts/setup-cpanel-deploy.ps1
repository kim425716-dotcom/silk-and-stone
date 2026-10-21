param(
    [string]$FtpHost,
    [string]$FtpUsername,
    [string]$FtpPassword,
    [string]$DeployPath = "/public_html/silk-and-stone/"
)

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

# Prompt interactively if parameters not provided
if ([string]::IsNullOrWhiteSpace($FtpHost)) {
    Write-Host ""
    Write-Host "Enter your cPanel FTP connection details:" -ForegroundColor Yellow
    Write-Host ""
    $FtpHost = Read-Host "FTP Host (default: logictech.co.ke)"
    if ([string]::IsNullOrWhiteSpace($FtpHost)) { $FtpHost = "logictech.co.ke" }
}

if ([string]::IsNullOrWhiteSpace($FtpUsername)) {
    $FtpUsername = Read-Host "cPanel FTP Username"
}

if ([string]::IsNullOrWhiteSpace($FtpPassword)) {
    $securePass = Read-Host "cPanel FTP Password" -AsSecureString
    $bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePass)
    $FtpPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
}

if ([string]::IsNullOrWhiteSpace($DeployPath)) {
    $DeployPath = Read-Host "Remote Deploy Folder on cPanel (default: /public_html/silk-and-stone/)"
    if ([string]::IsNullOrWhiteSpace($DeployPath)) { $DeployPath = "/public_html/silk-and-stone/" }
}

# Ensure trailing slash
if (-not $DeployPath.EndsWith("/")) {
    $DeployPath = $DeployPath + "/"
}

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

Set-Secret "FTP_HOST" $FtpHost
Set-Secret "FTP_USERNAME" $FtpUsername
Set-Secret "FTP_PASSWORD" $FtpPassword
Set-Secret "DEPLOY_PATH_PROD" $DeployPath

Write-Host ""
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "  Setup Complete! Secrets configured on GitHub.           " -ForegroundColor Green
Write-Host "==========================================================" -ForegroundColor Green
Write-Host "Repo: https://github.com/$repo" -ForegroundColor White
Write-Host "Target cPanel folder: $DeployPath" -ForegroundColor White
Write-Host ""
Write-Host "To trigger your first deployment right now, run:" -ForegroundColor Cyan
Write-Host "  gh workflow run deploy.yml --repo $repo" -ForegroundColor Yellow
Write-Host "Monitor runs at: https://github.com/$repo/actions" -ForegroundColor White
Write-Host ""
