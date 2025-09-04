#!/bin/bash

echo "🛑 Stopping FAS-MBBS servers..."

# Kill processes by PID if available
if [ -f ".backend_pid" ]; then
    BACKEND_PID=$(cat .backend_pid)
    kill $BACKEND_PID 2>/dev/null || true
    rm .backend_pid
    echo "Backend stopped (PID: $BACKEND_PID)"
fi

if [ -f ".frontend_pid" ]; then
    FRONTEND_PID=$(cat .frontend_pid)
    kill $FRONTEND_PID 2>/dev/null || true
    rm .frontend_pid
    echo "Frontend stopped (PID: $FRONTEND_PID)"
fi

# Also kill by process name as backup
pkill -f uvicorn || true
pkill -f vite || true

echo "✅ All servers stopped!"
