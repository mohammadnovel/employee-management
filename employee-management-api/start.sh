#!/bin/bash

echo "🚀 Starting Employee Management Backend"
echo "========================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if .env exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found!"
    echo "Please create .env file with your database credentials"
    echo ""
    echo "Example:"
    echo "PORT=5100"
    echo "DB_HOST=localhost"
    echo "DB_USER=root"
    echo "DB_PASSWORD=your_password"
    echo "DB_NAME=employee_management"
    echo ""
    exit 1
fi

# Check database password
DB_PASS=$(grep "^DB_PASSWORD=" .env | cut -d '=' -f2)
if [ -z "$DB_PASS" ]; then
    echo "⚠️  Database password not set in .env"
    echo "Please edit .env and set DB_PASSWORD=your_password"
    echo ""
    exit 1
fi

echo "✅ Configuration OK"
echo "🚀 Starting server on port 5100..."
echo ""

npm run dev
