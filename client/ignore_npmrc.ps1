$npmrcPath = "$env:USERPROFILE\.npmrc"
$backupPath = "$env:USERPROFILE\.npmrc.backup"

Write-Host "Checking for global .npmrc at $npmrcPath..."
if (Test-Path $npmrcPath) {
    Write-Host "Found .npmrc. Renaming to .npmrc.backup..."
    Rename-Item -Path $npmrcPath -NewName $backupPath -Force
    Write-Host "Global config disabled."
}
else {
    Write-Host "No global .npmrc found."
}

Write-Host "Cleaning cache..."
npm cache clean --force

Write-Host "Installing dependencies..."
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "Success! Starting server..." -ForegroundColor Green
    npm run dev
}
else {
    Write-Host "Install failed again." -ForegroundColor Red
}
