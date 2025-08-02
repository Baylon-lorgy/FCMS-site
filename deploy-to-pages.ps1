# Deploy to GitHub Pages PowerShell Script
Write-Host "🚀 Deploying to GitHub Pages..." -ForegroundColor Green

# Check if client/dist exists
if (-not (Test-Path "client/dist")) {
    Write-Host "❌ Error: client/dist folder not found!" -ForegroundColor Red
    Write-Host "Please run 'npm run build' in the client folder first." -ForegroundColor Yellow
    exit 1
}

# Create docs folder if it doesn't exist
if (-not (Test-Path "docs")) {
    New-Item -ItemType Directory -Path "docs"
    Write-Host "✅ Created docs folder" -ForegroundColor Green
}

# Copy all files from client/dist to docs
Write-Host "📁 Copying files from client/dist to docs..." -ForegroundColor Yellow
Copy-Item -Path "client/dist/*" -Destination "docs/" -Recurse -Force

Write-Host "✅ Files copied successfully!" -ForegroundColor Green
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Commit and push the docs folder" -ForegroundColor White
Write-Host "2. Go to your repository Settings > Pages" -ForegroundColor White
Write-Host "3. Set Source to 'Deploy from a branch'" -ForegroundColor White
Write-Host "4. Select 'main' branch and '/docs' folder" -ForegroundColor White
Write-Host "5. Click Save" -ForegroundColor White 