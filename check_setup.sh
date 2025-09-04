#!/bin/bash

echo "🔍 Checking FAS-MBBS Setup..."
echo

# Check Python
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo "✅ Python found: $PYTHON_VERSION"
else
    echo "❌ Python 3 not found. Please install Python 3.8+"
    exit 1
fi

# Check Node.js
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo "✅ Node.js found: $NODE_VERSION"
else
    echo "❌ Node.js not found. Please install Node.js 16+"
    exit 1
fi

# Check npm
if command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✅ npm found: $NPM_VERSION"
else
    echo "❌ npm not found"
    exit 1
fi

echo
echo "📦 Checking Backend Dependencies..."

# Check if virtual environment exists
if [ -d "backend/venv" ]; then
    echo "✅ Backend virtual environment found"
else
    echo "❌ Backend virtual environment not found"
    echo "   Run: cd backend && python -m venv venv"
fi

# Check if requirements are installed
if [ -d "backend/venv" ]; then
    source backend/venv/bin/activate
    python -c "import fastapi, uvicorn, sqlalchemy, pydantic" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "✅ Backend dependencies installed"
    else
        echo "❌ Backend dependencies missing"
        echo "   Run: cd backend && source venv/bin/activate && pip install fastapi uvicorn sqlalchemy pydantic python-jose passlib python-multipart email-validator"
    fi
fi

echo
echo "📦 Checking Frontend Dependencies..."

# Check if node_modules exists
if [ -d "frontend/node_modules" ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Frontend dependencies missing"
    echo "   Run: cd frontend && npm install"
fi

echo
echo "🚀 Ready to start!"
echo
echo "To start the application:"
echo "  ./start.sh"
echo
echo "Or manually:"
echo "  Terminal 1: cd backend && source venv/bin/activate && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000"
echo "  Terminal 2: cd frontend && npm run dev"
echo
echo "Access at:"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:8000"
