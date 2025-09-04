#!/bin/bash

echo "🧪 Running FAS-MBBS Health Check..."
echo "=================================="

cd /Users/srinivasanramanujam/FAS-MBBS

# Test backend
echo "Testing backend..."
cd backend
source venv/bin/activate 2>/dev/null || echo "Virtual env not activated"

# Test database initialization
python init_db.py

# Test if server can start
echo "Testing server startup..."
timeout 5s uvicorn app.main:app --port 8001 > /dev/null 2>&1
if [ $? -eq 124 ]; then
    echo "✅ Backend server can start"
else
    echo "❌ Backend server failed to start"
fi

# Test frontend
echo "Testing frontend..."
cd ../frontend

if [ -d "node_modules" ]; then
    echo "✅ Frontend dependencies installed"
else
    echo "❌ Frontend dependencies not installed - run: npm install"
fi

echo ""
echo "✅ Health check complete!"
echo ""
echo "To start the application:"
echo "  ./start.sh"
