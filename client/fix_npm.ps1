Write-Host "=== RAHAYU SALON NPM FIXER ===" -ForegroundColor Cyan
Write-Host "Deteksi masalah: Access Token kadaluarsa/invalid." -ForegroundColor Yellow
Write-Host "Sedang membersihkan konfigurasi npm..."

# 1. Reset Registry & Auth
npm config delete //registry.npmjs.org/:_authToken --user
npm config delete //registry.npmjs.org/:_authToken --global
npm config set registry "https://registry.npmjs.org/"

# 2. Clear Cache
Write-Host "Membersihkan npm cache..."
npm cache clean --force

# 3. Clean Previous Install
if (Test-Path "node_modules") {
    Write-Host "Menghapus node_modules lama..."
    Remove-Item -Recurse -Force node_modules
}
if (Test-Path "package-lock.json") {
    Remove-Item -Force package-lock.json
}

# 4. Install
Write-Host "Mencoba install ulang (tanpa token)..." -ForegroundColor Green
npm install

if ($LASTEXITCODE -eq 0) {
    Write-Host "Instalasi BERHASIL! Menjalankan aplikasi..." -ForegroundColor Green
    npm run dev
}
else {
    Write-Host "Instalasi MASIH GAGAL." -ForegroundColor Red
    Write-Host "Cobalah login ulang manual dengan 'npm login' atau cek koneksi internet."
    Read-Host -Prompt "Tekan Enter untuk keluar"
}
