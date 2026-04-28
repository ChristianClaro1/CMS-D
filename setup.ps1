# Course Management System (CMS) Setup Script for Windows
# This script sets up the entire CMS environment

Write-Host "🚀 Setting up Course Management System (CMS)..." -ForegroundColor Green

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
    
    if ([version]$nodeVersion -lt "v16.0.0") {
        Write-Host "❌ Node.js version 16 or higher is required. Current version: $nodeVersion" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js v16 or higher." -ForegroundColor Red
    exit 1
}

# Install backend dependencies
Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
Set-Location backend
npm install

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install

# Copy environment files
Write-Host "📝 Setting up environment configuration..." -ForegroundColor Yellow
if (-not (Test-Path "backend\.env")) {
    Copy-Item "backend\.env.example" "backend\.env"
    Write-Host "📄 Created backend\.env from example" -ForegroundColor Green
}

if (-not (Test-Path "frontend\.env")) {
    Copy-Item "frontend\.env.example" "frontend\.env" -ErrorAction SilentlyContinue
    Write-Host "📄 Created frontend\.env from example" -ForegroundColor Green
}

# Create logs directory
Write-Host "📁 Creating logs directory..." -ForegroundColor Yellow
New-Item -ItemType Directory -Path "backend\logs" -Force

# Check if Docker is available
Write-Host "🐳 Checking Docker..." -ForegroundColor Yellow
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker is available for Kafka setup" -ForegroundColor Green
} catch {
    Write-Host "⚠️ Docker not found. Kafka requires Docker or manual installation." -ForegroundColor Yellow
}

# Check if PostgreSQL is running
Write-Host "🗄️ Checking PostgreSQL..." -ForegroundColor Yellow
try {
    $null = psql --version 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ PostgreSQL is available" -ForegroundColor Green
    } else {
        Write-Host "⚠️ PostgreSQL not found or not running" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ PostgreSQL not found. Please install PostgreSQL:" -ForegroundColor Yellow
    Write-Host "   - macOS: brew install postgresql" -ForegroundColor Gray
    Write-Host "   - Ubuntu: sudo apt-get install postgresql postgresql-contrib" -ForegroundColor Gray
    Write-Host "   - Windows: Download from postgresql.org" -ForegroundColor Gray
}

# Check if Redis is running
Write-Host "🔴 Checking Redis..." -ForegroundColor Yellow
try {
    $null = redis-cli ping 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Redis is running" -ForegroundColor Green
    } else {
        Write-Host "⚠️ Redis is not running" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️ Redis not found. Please install Redis:" -ForegroundColor Yellow
    Write-Host "   - macOS: brew install redis" -ForegroundColor Gray
    Write-Host "   - Ubuntu: sudo apt-get install redis-server" -ForegroundColor Gray
    Write-Host "   - Windows: Download from redis.io" -ForegroundColor Gray
}

Write-Host ""
Write-Host "🎉 Setup completed successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Next steps:" -ForegroundColor Cyan
Write-Host "   1. Configure your database connection in backend\.env" -ForegroundColor White
Write-Host "   2. Start PostgreSQL and Redis services" -ForegroundColor White
Write-Host "   3. Run database migrations: cd backend && npm run migrate" -ForegroundColor White
Write-Host "   4. Start development servers: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Access application:" -ForegroundColor Cyan
Write-Host "   - Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   - Backend API: http://localhost:8000" -ForegroundColor White
Write-Host "   - API Documentation: http://localhost:8000/api-docs" -ForegroundColor White
Write-Host ""
Write-Host "📚 For more information, see README.md" -ForegroundColor Cyan

# Ask user if they want to start services now
$choice = Read-Host "Do you want to start the development servers now? (Y/N): " -ForegroundColor Yellow
if ($choice -eq 'Y') {
    Write-Host "🚀 Starting development servers..." -ForegroundColor Green
    Start-Job -Name "Backend" -ScriptBlock {
        Set-Location backend
        npm run dev
    }
    Start-Job -Name "Frontend" -ScriptBlock {
        Set-Location frontend
        npm run dev
    }
    Write-Host "✅ Both servers started! Access the application at http://localhost:3000" -ForegroundColor Green
}
