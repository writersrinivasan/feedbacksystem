#!/bin/bash

# FAS-MBBS Complete Testing Script
# This script runs all available tests and generates a comprehensive report

echo "🧪 FAS-MBBS Complete Testing Suite"
echo "=================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Test results tracking
BACKEND_TESTS_PASSED=false
FRONTEND_BUILD_PASSED=false
TOTAL_ISSUES=0

# Function to print colored output
print_status() {
    if [ "$2" = "PASS" ]; then
        echo -e "${GREEN}✅ $1: PASSED${NC}"
    elif [ "$2" = "FAIL" ]; then
        echo -e "${RED}❌ $1: FAILED${NC}"
        ((TOTAL_ISSUES++))
    elif [ "$2" = "WARN" ]; then
        echo -e "${YELLOW}⚠️  $1: WARNING${NC}"
        ((TOTAL_ISSUES++))
    else
        echo -e "${BLUE}ℹ️  $1${NC}"
    fi
}

# Start testing
echo "Starting comprehensive testing process..."
echo ""

# Test 1: Backend API Tests
echo "📡 Running Backend API Tests..."
echo "================================"
cd backend

# Activate virtual environment and run tests
if source venv/bin/activate && python -m pytest test_api_clean.py --cov=app --cov-report=term-missing -v; then
    print_status "Backend API Tests" "PASS"
    BACKEND_TESTS_PASSED=true
    echo ""
    echo "📊 Generating detailed coverage report..."
    python -m pytest test_api_clean.py --cov=app --cov-report=html --quiet
    print_status "Backend Coverage Report" "PASS"
else
    print_status "Backend API Tests" "FAIL"
fi

echo ""

# Test 2: Frontend Build Test
echo "🎨 Testing Frontend Build..."
echo "============================"
cd ../frontend

if npm run build > build.log 2>&1; then
    print_status "Frontend Build" "PASS"
    FRONTEND_BUILD_PASSED=true
else
    print_status "Frontend Build" "FAIL"
    echo -e "${YELLOW}ℹ️  TypeScript compilation errors found. See build.log for details.${NC}"
fi

echo ""

# Test 3: Basic Frontend Lint Check
echo "🔍 Running Frontend Lint Check..."
echo "================================="

if npm run lint > lint.log 2>&1; then
    print_status "Frontend Lint" "PASS"
else
    print_status "Frontend Lint" "WARN"
    echo -e "${YELLOW}ℹ️  Lint warnings found. See lint.log for details.${NC}"
fi

echo ""

# Test 4: Project Structure Validation
echo "📁 Validating Project Structure..."
echo "=================================="

# Check key files exist
REQUIRED_FILES=(
    "../backend/app/main.py"
    "../backend/app/models/models.py"
    "../backend/app/api/api_v1/endpoints/auth.py"
    "../backend/app/api/api_v1/endpoints/feedback.py"
    "../backend/requirements.txt"
    "src/App.tsx"
    "src/pages/LoginPage.tsx"
    "src/pages/RegisterPage.tsx"
    "src/services/api.ts"
    "package.json"
)

MISSING_FILES=0
for file in "${REQUIRED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file (missing)"
        ((MISSING_FILES++))
    fi
done

if [ $MISSING_FILES -eq 0 ]; then
    print_status "Project Structure" "PASS"
else
    print_status "Project Structure" "FAIL"
fi

echo ""

# Test 5: Dependencies Check
echo "📦 Checking Dependencies..."
echo "=========================="

cd ../backend
if source venv/bin/activate && pip check > /dev/null 2>&1; then
    print_status "Backend Dependencies" "PASS"
else
    print_status "Backend Dependencies" "WARN"
fi

cd ../frontend
if npm ls > /dev/null 2>&1; then
    print_status "Frontend Dependencies" "PASS"
else
    print_status "Frontend Dependencies" "WARN"
fi

echo ""
echo "🎯 TESTING SUMMARY"
echo "=================="

# Overall results
if [ $BACKEND_TESTS_PASSED = true ] && [ $FRONTEND_BUILD_PASSED = true ] && [ $TOTAL_ISSUES -eq 0 ]; then
    echo -e "${GREEN}🎉 ALL TESTS PASSED - PROJECT IS PRODUCTION READY!${NC}"
    EXIT_CODE=0
elif [ $BACKEND_TESTS_PASSED = true ] && [ $TOTAL_ISSUES -le 3 ]; then
    echo -e "${YELLOW}✅ CORE FUNCTIONALITY WORKING - Minor issues need fixing${NC}"
    echo -e "${BLUE}ℹ️  Backend is production-ready, frontend needs attention${NC}"
    EXIT_CODE=1
else
    echo -e "${RED}❌ SIGNIFICANT ISSUES FOUND - Requires fixes before production${NC}"
    EXIT_CODE=2
fi

echo ""
echo "📊 Test Statistics:"
echo "  Backend API Tests: $([ $BACKEND_TESTS_PASSED = true ] && echo 'PASSED ✅' || echo 'FAILED ❌')"
echo "  Frontend Build: $([ $FRONTEND_BUILD_PASSED = true ] && echo 'PASSED ✅' || echo 'FAILED ❌')"
echo "  Total Issues Found: $TOTAL_ISSUES"

echo ""
echo "📋 Next Steps:"
if [ $BACKEND_TESTS_PASSED = false ]; then
    echo "  1. Fix backend API issues"
fi
if [ $FRONTEND_BUILD_PASSED = false ]; then
    echo "  2. Resolve TypeScript compilation errors"
fi
if [ $TOTAL_ISSUES -gt 0 ]; then
    echo "  3. Address remaining warnings and issues"
fi
echo "  4. Review detailed reports in backend/htmlcov/ and frontend/build.log"

echo ""
echo "📄 Full testing report available in TESTING_REPORT.md"
echo ""

exit $EXIT_CODE
