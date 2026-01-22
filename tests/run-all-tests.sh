#!/bin/bash

# Main Test Runner - Customer Support Ticket System
# Runs all end-to-end tests in sequence
# Usage: ./tests/run-all-tests.sh

set -e  # Exit on first error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Test results tracking
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
SKIPPED_TESTS=0

# Start time
START_TIME=$(date +%s)

echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║     Customer Support Ticket System - Test Suite               ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "${CYAN}Starting comprehensive test suite...${NC}"
echo ""

# Function to print section header
print_section() {
    echo ""
    echo -e "${MAGENTA}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${MAGENTA}  $1${NC}"
    echo -e "${MAGENTA}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
}

# Function to check if a service is running
check_service() {
    local service_name=$1
    local url=$2
    local max_attempts=5
    local attempt=1
    
    echo -e "${YELLOW}Checking if $service_name is running...${NC}"
    
    while [ $attempt -le $max_attempts ]; do
        if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200"; then
            echo -e "${GREEN}✓ $service_name is running${NC}"
            return 0
        fi
        
        echo -e "${YELLOW}  Attempt $attempt/$max_attempts - waiting for $service_name...${NC}"
        sleep 2
        ((attempt++))
    done
    
    echo -e "${RED}✗ $service_name is not running${NC}"
    echo -e "${RED}  Please start $service_name before running tests${NC}"
    return 1
}

# Function to run a test script
run_test_script() {
    local script_name=$1
    local script_path="tests/$script_name"
    local description=$2
    
    echo -e "${BLUE}Running: $description${NC}"
    echo -e "${BLUE}Script: $script_name${NC}"
    echo ""
    
    if [ ! -f "$script_path" ]; then
        echo -e "${RED}✗ Test script not found: $script_path${NC}"
        ((FAILED_TESTS++))
        return 1
    fi
    
    # Make script executable
    chmod +x "$script_path"
    
    # Run the script and capture output
    if bash "$script_path"; then
        echo ""
        echo -e "${GREEN}✓ $description - PASSED${NC}"
        ((PASSED_TESTS++))
        return 0
    else
        echo ""
        echo -e "${RED}✗ $description - FAILED${NC}"
        ((FAILED_TESTS++))
        return 1
    fi
}

# Pre-flight checks
print_section "Pre-Flight Checks"

echo -e "${CYAN}Checking prerequisites...${NC}"
echo ""

# Check if Node.js is installed
if command -v node &> /dev/null; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}✓ Node.js installed: $NODE_VERSION${NC}"
else
    echo -e "${RED}✗ Node.js not found${NC}"
    echo -e "${RED}  Please install Node.js 18+ to run tests${NC}"
    exit 1
fi

# Check if curl is installed
if command -v curl &> /dev/null; then
    echo -e "${GREEN}✓ curl installed${NC}"
else
    echo -e "${RED}✗ curl not found${NC}"
    echo -e "${RED}  Please install curl to run tests${NC}"
    exit 1
fi

# Check if Python 3 is installed (for JSON parsing)
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✓ Python 3 installed: $PYTHON_VERSION${NC}"
else
    echo -e "${RED}✗ Python 3 not found${NC}"
    echo -e "${RED}  Please install Python 3 for JSON parsing in tests${NC}"
    exit 1
fi

echo ""

# Check if backend is running
if ! check_service "Backend" "http://localhost:3000/health"; then
    echo ""
    echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}  Backend is not running. Please start it first:${NC}"
    echo -e "${YELLOW}    cd backend && npm run dev${NC}"
    echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    exit 1
fi

# Check if frontend is running
if ! check_service "Frontend" "http://localhost:5173"; then
    echo ""
    echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
    echo -e "${YELLOW}  Frontend is not running. Please start it first:${NC}"
    echo -e "${YELLOW}    cd frontend && npm run dev${NC}"
    echo -e "${YELLOW}═══════════════════════════════════════════════════════════════${NC}"
    echo ""
    exit 1
fi

echo ""
echo -e "${GREEN}✓ All prerequisites met${NC}"

# Test Suite 1: Backend API Tests
print_section "Test Suite 1: Backend API Integration Tests"
((TOTAL_TESTS++))
run_test_script "test-api.sh" "Backend API Integration Tests"

# Test Suite 2: Frontend Integration Tests
print_section "Test Suite 2: Frontend Integration Tests"
((TOTAL_TESTS++))
run_test_script "test-frontend.sh" "Frontend Integration Tests"

# Test Suite 3: UI Enhancement Tests
print_section "Test Suite 3: UI Enhancement Tests"
((TOTAL_TESTS++))
run_test_script "test-ui-enhancements.sh" "UI Enhancement Tests"

# Test Suite 4: Dashboard Verification
print_section "Test Suite 4: Dashboard Verification"
((TOTAL_TESTS++))
run_test_script "verify-dashboard.sh" "Dashboard Verification"

# Test Suite 5: Kanban Board Tests
print_section "Test Suite 5: Kanban Board Integration Tests"
((TOTAL_TESTS++))
run_test_script "test-kanban.sh" "Kanban Board Integration Tests"

# Calculate duration
END_TIME=$(date +%s)
DURATION=$((END_TIME - START_TIME))
MINUTES=$((DURATION / 60))
SECONDS=$((DURATION % 60))

# Final Summary
echo ""
echo ""
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                                                                ║"
echo "║                      TEST SUMMARY                              ║"
echo "║                                                                ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""
echo -e "  Total Test Suites:    ${CYAN}$TOTAL_TESTS${NC}"
echo -e "  Passed:               ${GREEN}$PASSED_TESTS${NC}"
echo -e "  Failed:               ${RED}$FAILED_TESTS${NC}"
echo -e "  Skipped:              ${YELLOW}$SKIPPED_TESTS${NC}"
echo ""
echo -e "  Duration:             ${CYAN}${MINUTES}m ${SECONDS}s${NC}"
echo ""

if [ $FAILED_TESTS -eq 0 ]; then
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                                ║${NC}"
    echo -e "${GREEN}║                  ✓ ALL TESTS PASSED ✓                          ║${NC}"
    echo -e "${GREEN}║                                                                ║${NC}"
    echo -e "${GREEN}║  The Customer Support Ticket System is fully operational!     ║${NC}"
    echo -e "${GREEN}║                                                                ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${GREEN}System Status: 🟢 OPERATIONAL${NC}"
    echo ""
    echo -e "${CYAN}Next Steps:${NC}"
    echo -e "  • Open browser to: ${BLUE}http://localhost:5173${NC}"
    echo -e "  • Login with: ${BLUE}agent1@example.com / password123${NC}"
    echo -e "  • Review QUICKSTART.md for demo flow"
    echo ""
    exit 0
else
    echo -e "${RED}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${RED}║                                                                ║${NC}"
    echo -e "${RED}║                  ✗ SOME TESTS FAILED ✗                         ║${NC}"
    echo -e "${RED}║                                                                ║${NC}"
    echo -e "${RED}║  Please review the test output above for details.             ║${NC}"
    echo -e "${RED}║                                                                ║${NC}"
    echo -e "${RED}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${RED}System Status: 🔴 TESTS FAILING${NC}"
    echo ""
    echo -e "${YELLOW}Troubleshooting:${NC}"
    echo -e "  • Check that both backend and frontend are running"
    echo -e "  • Verify database has been seeded: ${BLUE}cd backend && npm run seed${NC}"
    echo -e "  • Check for errors in backend/frontend terminal output"
    echo -e "  • Review individual test scripts in tests/ directory"
    echo ""
    exit 1
fi
