#!/bin/bash

echo "🚀 FAS-MBBS Simple Startup"
echo "========================="

cd "/Users/srinivasanramanujam/FAS-MBBS"

# Kill existing processes
pkill -f uvicorn 2>/dev/null || true
pkill -f vite 2>/dev/null || true
sleep 1

echo "📦 Backend setup..."
cd backend

# Activate virtual environment
source venv/bin/activate

# Install any missing packages
pip install -q bcrypt==4.0.1 requests

# Initialize database
echo "🗄️ Initializing database..."
python init_db.py

# Start backend
echo "⚡ Starting backend on port 8000..."
uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!

cd ../frontend

# Start frontend
echo "🎨 Starting frontend on port 5173..."
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ Servers started!"
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "⚡ Backend:  http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "👤 Test Accounts:"
echo "   Student: student1@example.com / password123"
echo "   Teacher: teacher1@example.com / password123"
echo ""
echo "Press Ctrl+C to stop"

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    pkill -f uvicorn 2>/dev/null || true
    pkill -f vite 2>/dev/null || true
    echo "✅ Stopped!"
    exit 0
}

trap cleanup INT
wait
