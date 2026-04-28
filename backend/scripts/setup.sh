#!/bin/bash

# Course Management System (CMS) Setup Script
# This script sets up the entire CMS environment

set -e

echo "🚀 Setting up Course Management System (CMS)..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js v16 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 16 ]; then
    echo "❌ Node.js version 16 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install backend dependencies
echo "📦 Installing backend dependencies..."
cd backend
npm install

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd ../frontend
npm install

# Go back to root
cd ..

# Copy environment files
echo "📝 Setting up environment configuration..."
if [ ! -f backend/.env ]; then
    cp backend/.env.example backend/.env
    echo "📄 Created backend/.env from example"
fi

if [ ! -f frontend/.env ]; then
    cp frontend/.env.example frontend/.env 2>/dev/null || echo "📄 Frontend .env.example not found, skipping..."
fi

# Create logs directory
echo "📁 Creating logs directory..."
mkdir -p backend/logs

# Check if PostgreSQL is running
echo "🗄️ Checking PostgreSQL..."
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL is installed"
else
    echo "⚠️ PostgreSQL not found. Please install PostgreSQL:"
    echo "   - macOS: brew install postgresql"
    echo "   - Ubuntu: sudo apt-get install postgresql postgresql-contrib"
    echo "   - Windows: Download from postgresql.org"
fi

# Check if Redis is running
echo "🔴 Checking Redis..."
if command -v redis-cli &> /dev/null; then
    if redis-cli ping &> /dev/null; then
        echo "✅ Redis is running"
    else
        echo "⚠️ Redis is not running. Please start Redis:"
        echo "   - macOS: brew services start redis"
        echo "   - Ubuntu: sudo systemctl start redis-server"
        echo "   - Windows: Start Redis service"
    fi
else
    echo "⚠️ Redis not found. Please install Redis:"
    echo "   - macOS: brew install redis"
    echo "   - Ubuntu: sudo apt-get install redis-server"
    echo "   - Windows: Download from redis.io"
fi

# Check if Docker is available for Kafka
echo "🐳 Checking Docker..."
if command -v docker &> /dev/null; then
    echo "✅ Docker is available for Kafka setup"
else
    echo "⚠️ Docker not found. Kafka requires Docker or manual installation."
fi

# Run database migrations (if database is available)
echo "🗄️ Preparing database migrations..."
cd backend
if command -v npx &> /dev/null; then
    echo "📋 Migration command: npm run migrate"
    echo "   Run this after setting up your database connection in backend/.env"
fi

cd ..

echo "🎉 Setup completed successfully!"
echo ""
echo "📋 Next steps:"
echo "   1. Configure your database connection in backend/.env"
echo "   2. Start PostgreSQL and Redis services"
echo "   3. Run database migrations: cd backend && npm run migrate"
echo "   4. Start development servers: npm run dev"
echo ""
echo "🌐 Access the application:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:8000"
echo "   - API Documentation: http://localhost:8000/api-docs"
echo ""
echo "📚 For more information, see README.md"
