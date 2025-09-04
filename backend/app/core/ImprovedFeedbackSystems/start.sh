#!/bin/bash

# FAS-MBBS Startup Script
echo "Starting FAS-MBBS (Medical College Feedback Analysis System)..."

# Function to check if a port is in use
check_port() {
    if lsof -Pi :$1 -sTCP:LISTEN -t >/dev/null ; then
        echo "Port $1 is already in use"
        return 0
    else
        return 1
    fi
}

# Stop any existing servers
echo "Stopping existing servers..."
pkill -f "uvicorn"
pkill -f "npm start"
sleep 2

# Start backend
echo "Starting backend server..."
cd backend
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt

# Start backend in background
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"

# Wait for backend to start
sleep 5

# Check if backend is running
if check_port 8000; then
    echo "✓ Backend is running on http://localhost:8000"
else
    echo "✗ Backend failed to start"
    exit 1
fi

# Start frontend
echo "Starting frontend server..."
cd ../frontend
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Start frontend in background
npm start &
FRONTEND_PID=$!
echo "Frontend started with PID: $FRONTEND_PID"

# Wait for frontend to start
sleep 10

# Check if frontend is running
if check_port 3000; then
    echo "✓ Frontend is running on http://localhost:3000"
else
    echo "✗ Frontend failed to start"
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo "🎉 FAS-MBBS is now running!"
echo "🌐 Frontend: http://localhost:3000"
echo "📡 Backend API: http://localhost:8000"
echo "📚 API Docs: http://localhost:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for user interrupt
trap 'echo "Stopping servers..."; kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; exit 0' INT
wait
