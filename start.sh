#!/bin/bash

echo "🚀 Starting FAS-MBBS (Minimalist Version)"
echo "========================================="

# Kill any existing processes
pkill -f uvicorn 2>/dev/null || true
pkill -f vite 2>/dev/null || true
sleep 1

echo "📦 Setting up backend..."
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

# Activate virtual environment and install dependencies
source venv/bin/activate
echo "Installing backend dependencies..."
pip install -q -r requirements.txt

# Initialize database
echo "Initializing database..."
python init_db.py

# Start backend server
echo "Starting backend server..."
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 > backend.log 2>&1 &
BACKEND_PID=$!

cd ../frontend

# Install frontend dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start frontend server
echo "Starting frontend server..."
npm run dev > frontend.log 2>&1 &
FRONTEND_PID=$!

echo ""
echo "✅ Application started successfully!"
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "⚡ Backend:  http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "👤 Test Accounts:"
echo "   Student: student1@example.com / password123"
echo "   Teacher: teacher1@example.com / password123"
echo "   Admin:   admin@example.com / admin123"
echo ""
echo "📝 Logs:"
echo "   Backend: backend/backend.log"
echo "   Frontend: frontend/frontend.log"
echo ""
echo "🛑 To stop: ./stop.sh"

# Save PIDs for cleanup
echo $BACKEND_PID > .backend_pid
echo $FRONTEND_PID > .frontend_pid

# Wait for user input
echo ""
echo "Press Ctrl+C to stop servers..."
trap cleanup INT

cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null || true
    kill $FRONTEND_PID 2>/dev/null || true
    rm -f .backend_pid .frontend_pid
    echo "✅ Servers stopped!"
    exit 0
}

wait
