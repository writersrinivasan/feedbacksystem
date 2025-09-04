#!/bin/bash

# FAS-MBBS Test Script
echo "Running FAS-MBBS Tests..."

# Test backend first
echo "Testing backend..."
cd backend

# Install dependencies if needed
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt

# Run backend tests
python test_backend.py
BACKEND_TEST_RESULT=$?

if [ $BACKEND_TEST_RESULT -eq 0 ]; then
    echo "✓ Backend tests passed"
else
    echo "✗ Backend tests failed"
fi

# Test frontend build
echo "Testing frontend build..."
cd ../frontend

if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Run frontend tests
npm test -- --coverage --watchAll=false
FRONTEND_TEST_RESULT=$?

if [ $FRONTEND_TEST_RESULT -eq 0 ]; then
    echo "✓ Frontend tests passed"
else
    echo "✗ Frontend tests failed"
fi

# Test frontend build
echo "Testing frontend build..."
npm run build
BUILD_RESULT=$?

if [ $BUILD_RESULT -eq 0 ]; then
    echo "✓ Frontend build successful"
else
    echo "✗ Frontend build failed"
fi

# Overall result
if [ $BACKEND_TEST_RESULT -eq 0 ] && [ $FRONTEND_TEST_RESULT -eq 0 ] && [ $BUILD_RESULT -eq 0 ]; then
    echo ""
    echo "🎉 All tests passed! FAS-MBBS is ready for deployment."
    exit 0
else
    echo ""
    echo "❌ Some tests failed. Please check the output above."
    exit 1
fi
